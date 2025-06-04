"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Booking extends Model {
    static associate(models) {
      this.belongsTo(models.User, { foreignKey: 'userId' });
      this.belongsTo(models.Camper, { foreignKey: 'camperId' });
    }
  }
  Booking.init(
    {
      userId: DataTypes.INTEGER,
      camperId: DataTypes.INTEGER,
      name: DataTypes.STRING,
      famale: DataTypes.STRING,
      guest: DataTypes.INTEGER,
      shelterCount: DataTypes.INTEGER,
      camperCount: DataTypes.INTEGER,
      dateCheckIn: DataTypes.DATE,
      dateDeparture: DataTypes.DATE,
    },
    {
      sequelize,
      modelName: "Booking",
    }
  );
  return Booking;
};
