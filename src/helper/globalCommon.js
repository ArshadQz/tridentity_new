import envConfig from '../config/config.js'

const obj ={};

export class GlobalCommon {
 
  push(key, value){
    obj[key] = value;
  }
  get(key){
    return obj[key];
  }
}
