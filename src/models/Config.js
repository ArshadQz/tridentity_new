export default (sequelize, DataTypes) => {
  const Config = sequelize.define('configs', {
    keyName: { type: DataTypes.STRING, primaryKey: true },
    value: { type: DataTypes.STRING, allowNull: false },
  }, {
    tableName: 'configs',
    timestamps: true,
    paranoid: true,
  });

  return Config;
};
