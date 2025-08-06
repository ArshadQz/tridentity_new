export default (sequelize, DataTypes) => {
  const Account = sequelize.define('accounts', {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    userName: { type: DataTypes.STRING, allowNull: false },
    password: { type: DataTypes.STRING, allowNull: false },
    isAdmin: { type: DataTypes.TINYINT, allowNull: false },
    userProfileId: { type: DataTypes.INTEGER, allowNull: false },
  }, {
    tableName: 'accounts',
    timestamps: true,
    paranoid: true,
  });

  Account.associate = (models) => {
    Account.belongsTo(models.UserProfile, { foreignKey: 'userProfileId' });
  };

  return Account;
};
