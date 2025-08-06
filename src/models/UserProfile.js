export default (sequelize, DataTypes) => {
  const UserProfile = sequelize.define('userProfiles', {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    firstName: { type: DataTypes.STRING, allowNull: false },
    lastName: { type: DataTypes.STRING, allowNull: false },
  }, {
    tableName: 'userProfiles',
    timestamps: true,
    paranoid: true,
  });

  UserProfile.associate = (models) => {
    UserProfile.hasOne(models.Account, { foreignKey: 'userProfileId' });
  };

  return UserProfile;
};
