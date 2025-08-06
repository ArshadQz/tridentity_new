import { connect, StringCodec } from 'nats';

export class NatsConnection {
    nc;

    constructor(nc) {
        this.nc = nc;
    }

    static natsInstance = null;

    static async getConn() {
        if (!this.natsInstance || this.natsInstance.nc.isClosed()) {
            const nc = await connect({
                servers: process.env.NATS_HOST,  
                user: process.env.NATS_USER,
                pass: process.env.NATS_PASSWORD
                // servers: "nats://localhost:4222"
            });
            console.log("NATS connection established.");
            this.natsInstance = new NatsConnection(nc);
        }
        return this.natsInstance;
    }
}