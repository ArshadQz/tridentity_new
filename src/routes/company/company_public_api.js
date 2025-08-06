import express from "express";
import { ApiResponse } from "../helper/ApiResponse.js";
import { ApiError } from "../helper/ApiError.js";
import { sequelize } from "../../sequelize.js";
import { checkRedis } from "../../helper/redisHelper.js";

export const company_public_api = express.Router();

const ns = `/company/public`;

company_public_api.get(`${ns}/test`, async function (req, res) {
  try{
    res.send(new ApiResponse(200,"this","msg"));
  }
  catch(error){
    res.send(new ApiError(500,"erorr msg",error.message))
  }

});

company_public_api.get(`${ns}/health`, async function (req, res) {
  try{
    let dbConn = 'ok';
    let redisConn = 'ok';
    let natsConn = 'ok';
    
    try{
        const seq = await sequelize.authenticate();
        console.log("se",seq)
    }catch(e){
      console.log("health db error",e);
      dbConn = false;
    }

    try{
        const seq = await checkRedis();
        console.log("se",seq)
    }catch(e){
      console.log("health redis error",e);
      redisConn = false;
    }
    
    try{
        const nc = global.natsConn;
        if (!nc || nc.isClosed()) throw new Error('NATS not connected');
        console.log(nc.isClosed())
    }catch(e){
      console.log("health nats error",e);
      natsConn = false;
    }
    

    
    res.send({
      db: dbConn,
      redis: redisConn,
      nats: natsConn
    });
  }
  catch(error){
    res.send(new ApiError(500,"erorr msg",error.message))
  }

});