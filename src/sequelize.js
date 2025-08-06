import Sequelize from 'sequelize';
import dbConfig from "./config/config.js";

import CustomerModel from './models/Customer.js';
import AccountModel from './models/Account.js';
import UserProfileModel from './models/UserProfile.js';
import ConfigModel from './models/Config.js';
import JwtModel from './models/Jwt.js';

export let sequelize;
export const MODELS = {};

export const startConnection = async () => {
  const db = dbConfig[process.env.NODE_ENV];
  sequelize = getSequelize();
  await sequelize.authenticate();

  // Passing The Sequelize Instance 
  MODELS.Customer = CustomerModel(sequelize, Sequelize);
  MODELS.Account = AccountModel(sequelize, Sequelize);
  MODELS.UserProfile = UserProfileModel(sequelize, Sequelize);
  MODELS.Config = ConfigModel(sequelize, Sequelize);
  MODELS.Jwt = JwtModel(sequelize, Sequelize);


  MODELS.Customer.hasMany(MODELS.Jwt, { foreignKey: 'customerId', as: 'jwts' });
  MODELS.Jwt.belongsTo(MODELS.Customer, {
    foreignKey: 'customerId',
    as: 'customer',
  });



  MODELS.UserProfile.hasOne(MODELS.Account, { foreignKey: 'userProfileId' });

  MODELS.Account.belongsTo(MODELS.UserProfile, { foreignKey: 'userProfileId' });
};

const getSequelize = () => {
  if (!sequelize) {
    const db = dbConfig[process.env.NODE_ENV];
    sequelize = new Sequelize(db.database, db.username, db.password, {
      host: db.host,
      port: db.port,
      dialect: 'mysql',
      pool: { max: 50, min: 0, acquire: 30000, idle: 10000 }, // More reasonable
      timezone: '+08:00',
      logging: false,
    });
    console.log("Connecting DB");
  } else {
    console.log("DB already connected");
  }
  return sequelize;
};