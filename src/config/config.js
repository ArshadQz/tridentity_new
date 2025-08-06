import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, '../../.env.example') });


// console.log('Loaded ENV:', process.env); // Debugging
// console.log('Loaded ENV:', process.env.NODE_ENV); // Debugging

const parseConfig = (envVar) => {
  if (!process.env[envVar]) return {}; // Prevent JSON parsing errors
  try {
    return JSON.parse(process.env[envVar]);
  } catch (error) {
    console.error(`Error parsing ${envVar}:`, error);
    return {};
  }
};

const config = {
  development: {
    username: process.env.DB_USERNAME || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'tdtgo_soccer',
    host: process.env.DB_HOST || '127.0.0.1',
    port: process.env.DB_PORT || '3306',
    dialect: 'mysql'
  },
  sandbox: {
    username: process.env.DB_USERNAME || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'tdtgo_soccer',
    host: process.env.DB_HOST || '127.0.0.1',
    port: process.env.DB_PORT || '3306',
    dialect: 'mysql'
  },
  production: {
    username: process.env.DB_USERNAME || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'tdtgo_soccer',
    host: process.env.DB_HOST || '127.0.0.1',
    port: process.env.DB_PORT || '3306',
    dialect: 'mysql'
  },
  redis: {
    conn: {
      password: process.env.REDIS_PASSWORD || '',
      socket: {
        host: process.env.REDIS_HOST || "127.0.0.1",
        port: process.env.REDIS_PORT || 6379,
      },
    },
    prefix: "MOTM@",
  },
  bucket:{
    TENCENT_SECRET_KEY:process.env.TENCENT_SECRET_KEY,
    TENCENT_SECRET_ID:process.env.TENCENT_SECRET_ID,
    TENCENT_BUCKET_REGION:process.env.TENCENT_BUCKET_REGION,
    TENCENT_BUCKET:process.env.TENCENT_BUCKET,

  }
};
// console.log("config",config)
export default config;
