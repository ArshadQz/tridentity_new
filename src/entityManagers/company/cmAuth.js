import { MODELS } from '../../sequelize.js';
import dotenv from 'dotenv';
dotenv.config();
import { generate_JWT } from '../../routes/helper/JWTHelper.js';
import { mysqlDateTime } from '../../routes/helper/getDate.js';
import { sequelize } from '../../sequelize.js';
import jwt from 'jsonwebtoken';
import axios from 'axios';
import { token } from 'morgan';
// import { deleteRedis } from '../../helper/redisHelper.js';
const classIdentifier = 'Company Auth';
export class CMAuth {
  static async login(tridentToken) {
    try {
      const { Customer, Jwt } = MODELS;
      let customer;
      if (true) {
        if(process.env.BYPASS){
           tridentToken = Math.random().toString(12).split(".")[1];
        }
        const userData = await this.verifyTokenTridentity(tridentToken);

        // console.log("User Data After Verification ", userData)
        if (!userData) {
          return {
            success: false,
            message: 'Invalid or expired Tridentity token',
          };

        }
        const membershipId = userData.membershipId;
        customer = await Customer.findOne({
          where: { membershipId },
        });

        if (!customer) {
          customer = await Customer.create({
            customerName: "",
            membershipId,
            firstName: userData.firstName ? userData.firstName : "",
            lastName: userData.lastName ? userData.lastName : "",
            identityToken: userData.identityToken ? userData.identityToken : "",
          });
        } else {
          customer = await customer.update({
            firstName: userData.firstName ? userData.firstName : "",
            lastName: userData.lastName ? userData.lastName : "",
            identityToken: userData.identityToken ? userData.identityToken : "",
          });
        }
      } else {
        customer = await Customer.findOne({
          where: { membershipId: "VF43" },
        });
      }



      const { accessToken } = generate_JWT(customer);

      // console.log('accessToken');
      const existingJwt = await Jwt.findOne({
        where: { customerId: customer.id },
      });

      if (existingJwt) {
        await existingJwt.update({
          token: accessToken,
          expire: mysqlDateTime,
        });
      } else {
        await Jwt.create({
          token: accessToken,
          customerId: customer.id,
          expire: mysqlDateTime,
        });
      }


      return { accessToken, customerId: customer.id };
    } catch (err) {
      console.error('Login error:', err);
      throw new Error('Login failed. Please try again.');
    }
  }

  static async retrieveNationalDetail(tridentToken,nonce) {
    try {
      const userData = await this.getProfile(tridentToken,nonce);
      if(!userData && !userData.data) throw Error("Cannot find profile")

      return { data: userData.data };
    } catch (err) {
      console.error('Login error:', err);
      throw new Error('Login failed. Please try again.');
    }
  }
  // Token Verification  Tridentity

  static async verifyTokenTridentity(token) {
    if (!token) return false;
   
    const verifyUrl = process.env.VERIFY_TOKEN_URL;
    const profileUrl = process.env.PROFILE_URL;

    const headers = {
      'app-id': process.env.APP_ID,
      'api-key': process.env.APP_KEY,
      'Content-Type': 'application/json'
    };

    try {
      // Verifying the token
      // console.log("Token ", token);
      if(process.env.BYPASS){
             return {
              username: 'test',
              membershipId:  Math.random().toString(12).split(".")[1],
              identityToken:  Math.random().toString(12).split(".")[1]
            };
      }

      console.log(`called verify `, new Date().toISOString());
      const verifyResponse = await axios.post(verifyUrl, { authToken: token }, { headers });
      // console.log(verifyResponse)
      const identityToken = verifyResponse?.data?.data?.user?.identityToken;
      // console.log(identityToken)
      if (!identityToken) {
        console.error('Identity token not found in response. ', new Date().toISOString());
        return false;
      }
      
     console.log(`called profile `, new Date().toISOString());
      // Customer.find
      // Get user Proflie using identityToken
      const profileHeaders = {
        ...headers,
        'identity-token': identityToken
      };

      const profileResponse = await axios.post(profileUrl, {}, { headers: profileHeaders });
    console.log(`called profile done`, new Date().toISOString());
      const user = profileResponse?.data?.data?.user;
      if (user) {
        return {
          username: user.username,
          membershipId: user.membershipId,
          identityToken: identityToken
        };
      }

      return false;

    } catch (error) {
      console.error('Token Error:', error.response?.data || error.message);
      const timestamp = new Date().toISOString();
      console.log(`Error - `, timestamp);
      return false;
    }
  }

  static async getProfile(token, nonce) {
    if (!token) return false;
   
    const TDT_URL = process.env.TDT_API+"/external/ekyc/nation/profile";
    
    const headers = {
      'app-id': process.env.APP_ID,
      'api-key': process.env.APP_KEY,
      'Content-Type': 'application/json'
    };

    try {

      console.log(`called verify `, new Date().toISOString());
      const resp = await axios.post(TDT_URL, { token, nonce }, { headers });
      console.log(resp)
      const profileData = resp?.data;
      // console.log(identityToken)
      if (!profileData) {
        console.error('Identity token not found in response. ', new Date().toISOString());
        return false;
      }
      
      return profileData;

    } catch (error) {
      console.error('Token Error:', error.response?.data || error.message);
      const timestamp = new Date().toISOString();
      console.log(`Error - `, timestamp);
      return false;
    }
  }


  //  Refresh Token
  // static async refreshToken(refreshToken) {
  //   const { Jwt, Customer } = MODELS;

  //   const tokenRecord = await Jwt.findOne({ where: { token: refreshToken } });

  //   if (!tokenRecord) {
  //     throw new Error('Invalid refresh token');
  //   }

  //   let payload;
  //   try {
  //     payload = jwt.verify(refreshToken, process.env.REFRESH_SECRET);
  //     // console.log(payload);
  //   } catch (err) {
  //     throw new Error('Refresh token is expired or invalid');
  //   }

  //   const customer = await Customer.findByPk(payload.customerId);
  //   if (!customer) {
  //     throw new Error('User not found');
  //   }

  //   const { accessToken, refreshToken: newRefreshToken } =
  //     generate_JWT(customer);

  //   await tokenRecord.update({
  //     token: newRefreshToken,
  //     expire: mysqlDateTime,
  //   });

  //   return { accessToken, newRefreshToken };
  // }

  static async logout(user) {
    const { Jwt } = MODELS;
    // console.log(user);
    // const tokenRecord = await Jwt.findOne({
    //   where: { customerId: user.customerId },
    // });

    // if (!tokenRecord) {
    //   throw new Error('Refresh token not found');
    // }
    // console.log(tokenRecord);
    // await tokenRecord.destroy({ force: true });
  }
  static async checkJwt(token, custId) {
    // console.log('token', token);
    const { Jwt } = MODELS;
    const jwt = await Jwt.findOne({
      where: {
        token,
      },
    });
    if (jwt) {
      return true;
    } else {
      return false;
    }
  }

  static async profile(querier) {
    const customerId = querier?.claims?.id;
    const { Customer } = MODELS;
    const customer = await Customer.findByPk(customerId);
    return customer.get({ plain: true });
  }




  static async voucherVerification(voucherData) {
    try {
      const { Customer } = MODELS;

      let customer = await Customer.findOne({
        where: {
          membershipId: voucherData.membershipId
        }
      });

      if (!customer) {
        customer = await Customer.create({
          customerName: "",
          membershipId: voucherData.membershipId,
          firstName: "",
          lastName: "",
          identityToken: "",
        });
      }

      //clear custome redis
      // const redisKey = "customer@"+customer.id;
      // await deleteRedis(redisKey);
      // const stampTransaction = await StampTransaction.findOne({
      //   where: {
      //     customerId: customer.id,
      //     docId: voucherData.id,
      //     docType: voucherData.type,
      //   },
      // });

      // if (stampTransaction) {
      //   return false;
      // }
      // console.log(det);

      return true;
    } catch (error) {
      console.error('Voucher verification failed:', error.response?.data || error.message);
      return false;
    }
  }

}
