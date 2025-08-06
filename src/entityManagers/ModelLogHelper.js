import { MODELS } from "../sequelize.js";
export class ModelLogManager {
  static async log(querier, docType, docId, pastData, newData, parentDocId) {
    const { ModelLog } = MODELS;
    const { claims } = querier;
    const profile = querier[claims.profileType];
    // console.log(`querirer`, querier, docType, pastData, newData);
    delete pastData.createdAt;
    delete pastData.updatedAt;
    delete pastData.deletedAt;
    delete newData.createdAt;
    delete newData.updatedAt;
    delete newData.deletedAt;

    const pdString = JSON.stringify(pastData);
    const ndString = JSON.stringify(newData);
    if (pdString !== ndString) {
      ModelLog.create({
        ip: querier.ip,
        companyProfileId: querier.companyId,
        profileType: claims.profileType,
        profileId: profile.id,
        docType,
        docId,
        parentDocId,
        pastData: pdString,
        newData: ndString,
      });
    } else {
    }
  }
}
