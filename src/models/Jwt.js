export default (sequelize, DataTypes) => {
  const Jwt = sequelize.define(
    'jwts',
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      status: {
        type: DataTypes.STRING(50),
        allowNull: false,
        defaultValue: 'ACTIVE',
      },
      token: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      expire: {
        type: DataTypes.DATE,
        allowNull: false,
      },

      customerId: {
        type: DataTypes.INTEGER,
        allowNull: true, 
      },
    },
    {
      paranoid: true,
      timestamps: true,
      tableName: 'jwts',
    }
  );

  Jwt.associate = (models) => {
    Jwt.belongsTo(models.Customer, {
      foreignKey: 'customerId',
      as: 'customer',
    });
  };

  return Jwt;
};