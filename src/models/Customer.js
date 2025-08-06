export default (sequelize, DataTypes) => {
  const Customer = sequelize.define('customers', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    customerName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    firstName: {
      type: DataTypes.STRING,
      allowNull: true
    },
    lastName: {
      type: DataTypes.STRING,
      allowNull: true
    },
    membershipId: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    identityToken: {
      type: DataTypes.STRING,
      allowNull: true,
      unique: true,
    },
  }, {
    tableName: 'customers',
    timestamps: true,
    paranoid: true,
  });

  Customer.associate = (models) => {
    Customer.hasMany(models.SelectedPlayer, { foreignKey: 'customerId' });
    Customer.hasMany(models.LuckyDrawUser, { foreignKey: 'customerId' });
  };

  return Customer;
};