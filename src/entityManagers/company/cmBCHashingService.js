import crypto from 'crypto';

export class HashingService {
  static async generateHash(querier, body, secretKey) {
    return crypto
      .createHmac('sha256', secretKey)
      .update(JSON.stringify(body))
      .digest('hex');
  }

  static async createHashKeyBlockchain(querier, apiBody, key) {
    // const hash = this.generateHash(apiBody);
    // // static async createHashKeyBlockchain(apiBody,querier) { //use this dynamic header for aapidSK
    // //   const hash = this.generateHash(apiBody,querier);
    // return { ok: true, hash };
  }

  static async verifyHashKeyBlockchain(apiBody, hash) {
    // const computedHash = this.generateHash(apiBody);
    // const isValid = computedHash === hash;
    return { ok: isValid };
  }
}
