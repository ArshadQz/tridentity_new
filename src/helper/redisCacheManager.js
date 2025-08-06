// import { loadConfig } from '../config/config.js';
import { hSetConfigsRedis, setRedis, deleteRedis, getRedis } from './redisHelper.js';
import { CMQuiz } from "../entityManagers/company/cmQuiz.js"
import { BKConfig } from '../entityManagers/backOffice/bkConfigs.js';

// export const updateOrderCache = async (key, documentNumber) => {
//   return new Promise(async (res, rej) => {
//     let rData = await getRedis(key);
//     // console.log('rData', rData);
//     let ind = rData.findIndex((el) => {
//       if (el && el.document) {
//         return el.document == documentNumber;
//       }
//     });
//     rData.splice(ind, 1);
//     await setRedis(key, rData);
//     res(true);
//   });
// };
// export const handleInsertion = async () => {
// const quizQs = await CMQuiz.getAllQuestions();
// await setRedis(key,value)
// }

export async function manageUpdatesRedis() {
  // await deleteRedis();
  await handleInsertion();
}

export async function getCConfig(key) {
  const redisKey = "config@"+key;
  const cached = await getRedis(redisKey);
  if(cached){
      console.log("Getting config from cache: ",redisKey)
     return cached;
  }
    console.log("Getting config from db: ",redisKey)
  const configs = await BKConfig.getKeyConfig(key);
  if(configs) await setRedis(redisKey,configs)
  return configs;
}


// export const clearCache = async (documentNumber) => {
//   return new Promise(async (res, rej) => {
//     let list = await getRedis(`cache_${documentNumber}`);

//     if (list) {
//       const entries = Object.entries(list);

//       for (let [key, value] of entries) {
//         if (key.startsWith('order_')) {
//           await updateOrderCache(key, value);
//         } else {
//           await deleteRedis(key);
//         }
//       }
//       res(true);
//     } else {
//       res(true);
//     }
//   });
// };

