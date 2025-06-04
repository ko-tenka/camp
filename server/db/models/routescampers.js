"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class RoutesCampers extends Model {
    static associate(models) {
      this.belongsTo(models.Routes, { foreignKey: 'routId' });
      this.belongsTo(models.Camper, { foreignKey: 'camperId' });
      this.belongsTo(models.Place, { foreignKey: 'placeId' });
    }
  }
  RoutesCampers.init(
    {
      day: DataTypes.INTEGER,
      camperId: DataTypes.INTEGER,
      routId: DataTypes.INTEGER,
      placeId: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "RoutesCampers",
    }
  );
  return RoutesCampers;
};
