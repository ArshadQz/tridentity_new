import { MODELS } from "../../sequelize.js";
import Sequelize from "sequelize";
const Op = Sequelize.Op;

export class CMHelper {
  static getStdIncSim = (querier) => {
    return [];
  };
  static getStdInc = async (querier, globalName) => {
    if (!globalName) throw Error(`Invalid INCLUDE ERROR`);
    const arr = [];
    const role = querier.role;
    if (`ADMIN` === role) return arr;
    const accessRole = querier.accessRole;
    if (accessRole && accessRole.all) return arr;
    if (accessRole) {
      const foundGlobal = accessRole.accessRoleRights.find(
        (r) => r.accessClassName === globalName && `global` === r.key
      );
      if (foundGlobal) return arr;
    }
    return arr;
  };
}
