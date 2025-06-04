'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Place extends Model {
    static associate(models) {
      this.belongsToMany(models.Routes, {
        through: 'RoutesCampers',
        foreignKey: 'placeId',
      });
    }
  }
  Place.init(
    {
      title: DataTypes.STRING,
      img: DataTypes.STRING,
      eCoordinates: DataTypes.STRING,
      wCoordinates: DataTypes.STRING,
      data: DataTypes.TEXT,
    },
    {
      sequelize,
      modelName: 'Place',
    }
  );
  return Place;
};
