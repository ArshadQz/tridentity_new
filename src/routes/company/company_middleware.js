import express from 'express';
import { getTokenFromHeader } from '../helper/BearerHelper.js';
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';
import { CMAuth } from '../../entityManagers/company/cmAuth.js';
import { JWT_verifyProfile } from '../helper/JWTHelper.js';
import { v4 as uuidv4 } from 'uuid';

dotenv.config();
export const company_middleware = express.Router();
const ns = `/company`;
const errorObj = (message) => {
  return { ok: false, message };
};

company_middleware.all(`${ns}/*`, async function (req, res, next) {
  const reqId = uuidv4();
   req.requestId = reqId;
  
  //  res.setHeader('X-Request-ID', reqId);
  //  res.setHeader('h-n', process.env.HOSTNAME);
  // DO NOT REMOVE , this is for testing and for the login endpoint
  const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
  const timestamp = new Date().toISOString();
  
  console.log(`in ${ns}/*`, req.path , );
  console.log(req.path - req.headers['customerid']?req.headers['customerid']:'NA' );
  console.log(`🛬 Request ${reqId} on Pod ${process.env.HOSTNAME} at ${timestamp}`);  
  console.log(`res:: incoming`, ip);
  console.log(`*************************************************\n`);
  req.body.querier = { jwt: false, ip };
  if (
    (req.path.startsWith(`/company/access`) ||
      req.path.startsWith(`/company/public`) ||
      req.path.endsWith(`/go`) ||
      req.path.endsWith(`/test`) ||
      req.path.endsWith(`/health`)) &&
    !req.path.endsWith(`/logout`)
  )
    return next();

  try {
    const token = getTokenFromHeader(req);
    if (!token) {
      return res.status(400).json({ error: 'Bearer Token is required' });
    }

    //CHECK JWT IS IN DB
    // console.log(req.headers)
    const custId = req.headers['customerid']
    const checkJwt = await CMAuth.checkJwt(token,custId);
    // console.log('checkJwt', checkJwt);
    if (!checkJwt)
      return res
        .status(403)
        .send(errorObj(`Unauthorized Access Reason: Expired`));

    const claims = JWT_verifyProfile(token);
    // console.log('claims', claims);
    if (!claims || 'customer' !== claims.profileType)
      return res.status(403).send(errorObj(`Unauthorized Access`));

    req.body.querier.claims = claims;
    const profile = await CMAuth.profile(req.body.querier);
    req.body.querier.profile = profile;

  } catch (err) {
    console.error('Unexpected error in middleware:', err);
    return res.status(500).json({ error: err.message });
  }

  next();
});