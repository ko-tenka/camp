"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Routes extends Model {
    static associate(model) {
      // this.hasMany(models.RoutesCampers, { foreignKey: "routId" });
      this.belongsToMany(model.Camper, {
        through: 'RoutesCampers',
        foreignKey: 'routId',
      });
      this.belongsToMany(model.Place, {
        through: 'RoutesCampers',
        foreignKey: 'routId',
      });
    }
  }
  Routes.init(
    {
      title: DataTypes.STRING,
      data: DataTypes.TEXT,
      type: DataTypes.STRING,
      img: DataTypes.STRING,
      days: DataTypes.INTEGER,
      km: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "Routes",
    }
  );
  return Routes;
};
