import express from "express";
import { ApiResponse } from "../helper/ApiResponse.js";
import { ApiError } from "../helper/ApiError.js";
import { sequelize } from "../../sequelize.js";

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