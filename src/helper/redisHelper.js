import { createClient } from 'redis';
import envConfig from '../config/config.js';
import { manageUpdatesRedis } from './redisCacheManager.js';
import { MODELS, sequelize } from '../sequelize.js';

let prefix;
let redisClient;
let skip;

// ============= INIT REDIS =====

export const initRedis = async () => {
  try{
      const redisConfig = envConfig.redis;
      skip = redisConfig.skip;
      if (skip) return;
      redisClient = createClient({ ...redisConfig.conn });
      await redisClient.connect();
      prefix = redisConfig.prefix;
      console.log("Redis Connected");
      console.log("Data Inserted Successfully");
  }catch(e){
    console.log("Redis Err",e)
  }
};

// ======================== GET FUNCTIONS ========================

export const getRedis = async (key) => {
  if (skip) return null;
  const actualKey = `${prefix}${key}`;

  const detail = await redisClient.get(actualKey);
  return detail ? JSON.parse(detail) : null;
};

export const getMatchRedis = async (key) => {
  if (skip) return null;
  const actualKey = `${prefix}${key}`;
  const detail = await redisClient.get(actualKey);
  return detail ? JSON.parse(detail) : null;
};

export const getRedisVotedPercent = async (matchId) => {
  const key = `votingResult:${matchId}`;
  return await getRedis(key);
};
export const getMatchTimeRedis = async (matchId) => {
  const key = `votingWindow:${matchId}`;
  return await getRedis(key);
};
export const redisGetAllMatches = async () => {
  const keys = await redisClient.keys(`${prefix}match:*`);
  return keys;
};

export const redisGetAllJwts = async () => {
  const keys = await redisClient.keys(`${prefix}login:*`);
  return keys;
};

export const redisGetAllJwtsGame = async () => {
  const keys = await redisClient.keys(`${prefix}gamelogin:*`);
  return keys;
};
export const getPlayersVote = async (matchId) => {
  const { SelectedPlayer } = MODELS;
  const key = `count:${matchId}`;
  const actualKey = `${prefix}${key}`;
  const redisData = await redisClient.hGetAll(actualKey);
  if (Object.keys(redisData).length) {
    return redisData;
  }
  const records = await SelectedPlayer.findAll({
    where: { matchId },
    attributes: [
      'playerId',
      [sequelize.fn('COUNT', sequelize.col('playerId')), 'voteCount']
    ],
    group: ['playerId'],
    raw: true,
  });

  const voteMap = Object.fromEntries(
    records.map(({ playerId, voteCount }) => [playerId, parseInt(voteCount)])
  );
  try {
    if (Object.keys(voteMap).length) {
      await redisClient.hSet(actualKey, voteMap);
    }
  } catch (err) {
    console.warn('Redis write failed:', err.message);
  }

  return voteMap;
};


// ======================== DELETE FUNCTIONS ========================

export const deleteRedis = async (key) => {
  if (skip) return;
  const actualKey = `${prefix}${key}`;
  // console.log("REDIS delete", actualKey);
  await redisClient.del(actualKey);
};

export const deleteVote = async (matchId, customerId) => {
  const { SelectedPlayer } = MODELS;
  await SelectedPlayer.destroy({ where: { matchId, customerId }, force: true });
  const key = `vote:${customerId}:${matchId}`;
  await deleteRedis(key);
};

export const deleteMatchData = async (matchId) => {
  const { SelectedPlayer } = MODELS;
  const votePattern = `${prefix}vote:*:${matchId}`;
  const voteKeys = await redisClient.keys(votePattern);
  console.log(voteKeys);
  if (voteKeys.length > 0) {
    await redisClient.del(...voteKeys);
    console.log(`Deleted ${voteKeys.length} vote(s) for match: ${matchId}`);
  } else {
    console.log(`No vote keys found for match: ${matchId}`);
  }
  const deletedRows = await SelectedPlayer.destroy({ where: { matchId }, force: true });
  console.log(`Deleted ${deletedRows} selected player(s) from DB for match: ${matchId}`);
};

export const clearAllRedis = async (type) => {
  if (skip) return;
  const keys = await redisClient.keys(`*`);
  for (const key of keys) {
    if (key.startsWith(prefix)) {
      const subkey = key.substring(prefix.length);
      if (type) {
        if (subkey.startsWith(type)) {
          console.log(`Deleting key?`, key);
          deleteRedis(subkey);
        }
      } else {
        deleteRedis(subkey);
      }
    }
  }
};

// ======================== SET FUNCTIONS ========================

export const setRedis = async (key, value) => {
  if (skip) return;
  const actualKey = `${prefix}${key}`;
  await redisClient.set(actualKey, JSON.stringify(value));
};

export const setRedisScheduleVoting = async (key, value) => {
  if (skip) return;
  const actualKey = `${prefix}${key}`;
  await redisClient.set(actualKey, JSON.stringify(value));
};

export const setRedisVotedPercent = async (value, matchId) => {
  const key = `votingResult:${matchId}`;
  await setRedis(key, value);
};

export const setVoteRedis = async (customerId, matchId, playerId) => {
  const redisKey = "vote:" + customerId + ":" + matchId;
  const cachedD = await getRedis(redisKey);
  // console.log(cachedD);
  if (cachedD) return false;
  setRedis(redisKey, playerId);
  return true;
};

export const setPlayerVote = async (matchId, playerId) => {
  const key = `count:${matchId}`;
  const actualKey = `${prefix}${key}`;
  await redisClient.hIncrBy(actualKey, String(playerId), 1);
};

export const hSetConfigsRedis = async (configObject) => {
  await redisClient.del('config:quiz');
  await redisClient.hSet('config:quiz', configObject);
};

export const checkRedis = async () => {
  try {
    const timeout = new Promise((_, reject) =>
      setTimeout(() => reject(new Error("Redis check timeout")), 3000)
    );

    const ping = redisClient.ping();

    const pong = await Promise.race([ping, timeout]);

    if (pong !== 'PONG') throw new Error('Redis ping failed');

    return 'ok';
  } catch (e) {
    throw new Error('Redis ping failed');
    return false;
  }
};
