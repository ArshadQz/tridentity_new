import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import fs from 'fs';

dotenv.config();

const privateKEY = fs.readFileSync('./private.key', 'utf8');
const publicKEY = fs.readFileSync('./public.key', 'utf8');
const profile_signOptions = {
  issuer: `LEO`,
  subject: `Profile`,
  audience: `TDTGO`,
  // expiresIn: '60s',
  expiresIn: '999h',
  algorithm: 'RS256', // RSASSA [ "RS256", "RS384", "RS512" ]
};
export const JWT_signProfile = (profile, profileType) => {
  let newProfile = { ...profile };
  if (newProfile.accessRole) delete newProfile.accessRole;
  newProfile.profileType = profileType;
  const token = jwt.sign(newProfile, privateKEY, profile_signOptions);
  // console.log(`token??`, process.env.JWT_EXPIRES_IN, token);
  return { token, expiresIn: profile_signOptions.expiresIn };
};

export const JWT_verifyProfile = (token) => {
  try {
    const claim = jwt.verify(token, publicKEY, profile_signOptions);

    return claim;
  } catch (err) {
    console.log(`JWT_verifyProfile ERROR`, err.name);
    return;
  }
};

// export const generate_JWT = (customer) => {

//     const payload = {
//         customerId: customer.id,
//         name: customer.customerName,
//         membershipId: customer.membershipId,
//     };
//     const secret = process.env.JWT_SECRET
//     const options = {
//         expiresIn: `${process.env.JWT_EXPIRES_IN} days`,
//     }
//     const token = jwt.sign(payload, secret, options);
//     console.log("Token", token);
//     return token;
// }

export function generate_JWT(customer) {
  const payload = {
    id: customer.id,
    name: customer.customerName,
    membershipId: customer.membershipId,
  };
  let newProfile = { ...payload };
  newProfile.profileType = 'customer';
  const token = jwt.sign(newProfile, privateKEY, profile_signOptions);
  // console.log(`token??`, token);
  return { accessToken: token, expiresIn: profile_signOptions.expiresIn };
}

export function generate_JWT_backOffice(account) {
  const payload = {
    id: account.id,
    username: account.username,
    password: account.password,
    userProfileId:account.userProfileId
  };
  let newProfile = { ...payload };
  newProfile.profileType = 'user';
  const token = jwt.sign(newProfile, privateKEY, profile_signOptions);
  // console.log(`token??`, token);
  return { accessToken: token, expiresIn: profile_signOptions.expiresIn };
}