import { MODELS, startConnection } from '../sequelize.js';
import { connect, StringCodec, consumerOpts } from "nats";
import { NatsConnection } from './natsHelper.js';

const sc = StringCodec();
let messageBuffer = [];
const batchSize = 200; // Adjust as needed

export async function run() {
  const natsConn = await NatsConnection.getConn();
  const nc = natsConn.nc;
  await startConnection();
  console.log("Consumer connected to NATS");

  const js = nc.jetstream();
  const jsm = await nc.jetstreamManager();

  try {
    await jsm.streams.info("selectedPlayers");
    console.log("Stream 'selectedPlayers' already exists.");
  } catch {
    console.log("Stream not found. Creating...");
    await jsm.streams.add({
      name: "selectedPlayers",
      subjects: ["selected.player"]
    });
    console.log("Stream 'selectedPlayers' created.");
  }

  const opts = consumerOpts();
  opts.durable("selected-player-worker");
  opts.deliverGroup("selected-players-group");
  opts.manualAck();
  opts.deliverTo("internal.selectedPlayers.consumer");

  const sub = await js.subscribe("selected.player", opts);

  console.log(`Listening for selected players...`);
  for await (const m of sub) {
    try {
        const flushDelay = 5000; // 1 second of inactivity
        let flushTimer = null;
        if (flushTimer) clearTimeout(flushTimer);

        flushTimer = setTimeout(async () => {
        if (messageBuffer.length > 0) {
            console.log(`Flushing small batch of ${messageBuffer.length}`);
            await processBatch(messageBuffer);
            messageBuffer = [];
        }
        }, flushDelay);

      const data = JSON.parse(sc.decode(m.data));
      messageBuffer.push({ msg: m, data });

      if (messageBuffer.length >= batchSize) {
         clearTimeout(flushTimer); // prevent double flush
        await processBatch(messageBuffer);
        messageBuffer = [];
      }
    } catch (err) {
      console.error("Error decoding or buffering message:", err);
    }
  }

  await nc.drain();
}


// Batch insert handler
async function processBatch(buffer) {
  const { SelectedPlayer } = MODELS;

  const validEntries = buffer
    .map(({ msg, data }) => {
      const { customerId, playerId, matchId, soccerTeamId, soccerTeamName } = data;
      if (customerId && playerId && matchId && soccerTeamId && soccerTeamName) {
        return { record: { customerId, playerId, matchId, soccerTeamId, soccerTeamName }, msg };
      } else {
        console.warn("Skipping invalid message:", data);
        return null;
      }
    })
    .filter(Boolean);

  if (!validEntries.length) return;

  try {
    const rows = validEntries.map(v => v.record);
    await SelectedPlayer.bulkCreate(rows, {
      ignoreDuplicates: true,
    });

    for (const { msg } of validEntries) {
      msg.ack();
    }
    console.log(`✔️ Inserted ${rows.length} selected players`);
  } catch (err) {
    console.error("❌ Batch insert error:", err);
  }
}

// Graceful shutdown: flush remaining buffer
process.on('SIGINT', async () => {
  console.log("🛑 Gracefully shutting down...");
  if (messageBuffer.length) {
    await processBatch(messageBuffer);
  }
  process.exit(0);
});

run().catch(err => console.error("Consumer fatal error:", err));