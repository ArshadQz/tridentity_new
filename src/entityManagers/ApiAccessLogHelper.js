import { MODELS } from "../sequelize.js";
export class ApiLogManager {
  static async log(querier, path) {
    const { ApiAccessLog } = MODELS;
    const { claims } = querier;
    const profileType = "";
    const profile = {};
    const profileId = profile.id;

    ApiAccessLog.create({
      ip: querier.ip,
      profileType,
      profileId,
      path,
    });
  }
}
