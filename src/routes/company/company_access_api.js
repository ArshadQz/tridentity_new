import express from "express";
import { CMAuth } from "../../entityManagers/company/cmAuth.js";
import { ApiResponse } from "../helper/ApiResponse.js";
import { ApiError } from "../helper/ApiError.js";
import { GlobalCommon } from "../../helper/globalCommon.js";
export const company_access_api = express.Router();

const ns = `/company/access`;
company_access_api.get(`${ns}/test`, async function (req, res) {
  try{
    res.send(new ApiResponse(200,"this","msg"));
  }
  catch(error){
    res.send(new ApiError(500,"erorr msg",error.message))
  }

});
company_access_api.post(`${ns}/login`, async (req, res) => {
  try {
    const { data } = req.body;
    
    if (!data || !data.token) {
      return res.status(400).json({ error: 'Token is required' });
    }

    const token = await CMAuth.login(data.token);

    // console.log(`OK jwt TOKEN GENERATED`);
    return res.status(200).json({ ...token });
  } catch (e) {
    console.error(`Login Failed:`, e.message);
    return res.status(500).json({ error: 'Login Failed' });
  }
});

company_access_api.post(`${ns}/getNationalProfile`, async (req, res) => {
  try {
    const { data } = req.body;
    
    if (!data || !data.token || !data.nonce || !data.type) {
      return res.status(400).json({ error: 'Token or nonce or type is required' });
    }

    const detail = await CMAuth.retrieveNationalDetail(data.token, data.nonce ,data.type);

    // console.log(`OK jwt TOKEN GENERATED`);
    return res.status(200).json(detail);
  } catch (e) {
    console.error(`Login Failed:`, e.message);
    return res.status(500).json({ error: 'Login Failed' });
  }
});

company_access_api.post(`${ns}/getNationalProfileOidc`, async (req, res) => {
  try {
    const { data } = req.body;
    
    if (!data || !data.code || !data.type || !data.codeChallenge) {
      return res.status(400).json({ error: 'Code or challenge or type is required' });
    }

    const detail = await CMAuth.retrieveNationalDetailOidc(data.code, data.codeChallenge ,data.type);

    // console.log(`OK jwt TOKEN GENERATED`);
    return res.status(200).json(detail);
  } catch (e) {
    console.error(`Login Failed:`, e.message);
    return res.status(500).json({ error: 'Login Failed' });
  }
});

company_access_api.get(`${ns}/getUrl`, async (req, res) => {
  try {
    // const {  } = req.body;
    const url = await CMAuth.getUrl();

    // console.log(`OK jwt TOKEN GENERATED`);
    return res.status(200).json({ data: url });
  } catch (e) {
    console.error(`Login Failed:`, e.message);
    return res.status(500).json({ error: 'Login Failed' });
  }
});
// company_access_api.post(`${ns}/refreshtoken`, async (req, res) => {
//   try {
//     const { refreshToken } = req.body;

//     if (!refreshToken) {
//       return res.status(400).json({ error: 'Refresh token is required' });
//     }
//     const {accessToken,newRefreshToken} =await CMAuth.refreshToken(refreshToken);
//     // console.log(accessToken,newRefreshToken)
//     return res.status(200).json({
//       accessToken,
//       refreshToken: newRefreshToken,
//     });

//   } catch (e) {
//     console.error('Refresh token error:', e.message);
//     return res.status(500).json({ error: 'Token refresh failed' });
//   }
// });

company_access_api.post(`${ns}/logout`, async (req, res) => {
  try {
    const { user } = req.body;

    if (!user) {
      return res.status(400).json({ error: 'User information missing' });
    }

   await CMAuth.logout(user)
        
    return res.status(200).json({ message: 'Successfully logged out' });
  } catch (err) {
    console.error('Error during logout:', err);
    return res.status(500).json({ error: 'An error occurred during logout' });
  }
});