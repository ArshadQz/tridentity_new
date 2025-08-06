import dotenv from 'dotenv';
dotenv.config();
// import { loadConfig } from "./config/config.js";
// import dbConfig from './config/config.js';


import express from 'express';
import bodyParser from 'body-parser';
import morgan from 'morgan';

import cors from 'cors';
import { companyApis } from './routes/company/company_api.js';
import {backOfficeApis} from './routes/backOffice/back_office_api.js'
import {  startConnection } from './sequelize.js';
import{initRedis} from "./helper/redisHelper.js"
import moment from 'moment';
import { CronJob } from 'cron';
import { connect, StringCodec } from 'nats';
import { NatsConnection } from '../src/helper/natsHelper.js';


const init = async () => {
  // console.log(`process.env.NODE_ENV?`, process.env.NODE_ENV);
  // const envConfig = loadConfig(process.env.NODE_ENV);

  startConnection();
  await initRedis();
  // const [results, metadata] = await sequelize.query('SELECT * from accounts');
  // console.log(`results?`, results);

  const app = express();
  app.use(express.static('client'));
  app.use(cors({ origin: '*' }));
  app.use(
    morgan('combined', {
      skip: function (req, res) {
        return res.statusCode < 400;
      },
    })
  );

  app.use(bodyParser.urlencoded({ extended: false }));
  app.use(    
    bodyParser.json({
      limit: '300mb',
    })
  );

  app.use(companyApis);
  app.use(backOfficeApis);

  app.listen(process.env.COMPANY_PORT, async () => {
    console.log(
      `COMPANY START:: Listening on COMPANY_PORT ${process.env.COMPANY_PORT}!`
    );
    console.log(
      `COMPANY UserName:: ENV MODE ${JSON.stringify(process.env.DB_PASSWORD)}!`
    );
    console.log(
      `COMPANY PAssword:: ENV MODE ${JSON.stringify(process.env.NODE_ENV)}!`
    );
    console.log(
      `COMPANY START:: ENV MODE ${JSON.stringify(process.env.DB_USERNAME)}!`
    );
    
    try{
          //load config
    // app.ts or server.ts
      const natsConn = await NatsConnection.getConn();
      const nc = natsConn.nc;
      const js = nc.jetstream();
      const jsm = await nc.jetstreamManager();

      try {
        await jsm.streams.info("selectedPlayers");
      } catch {
        await jsm.streams.add({
          name: "selectedPlayers",
          subjects: ["selected.player"]
        });
      }

      global.nats = { js }; // Or use a singleton pattern
      global.natsConn = nc; // Or use a singleton pattern
    }catch(e){
      console.log("Nats connection error")
    }

  });

    

};
init();
