'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Camper extends Model {
    static associate(models) {
      this.hasMany(models.Booking, { foreignKey: 'camperId' });
      this.belongsToMany(models.Routes, {
        through: 'RoutesCampers',
        foreignKey: 'camperId',
      });
      
    }
  }
  Camper.init(
    {
      title: DataTypes.STRING,
      shelterCount: DataTypes.INTEGER,
      camperCount: DataTypes.INTEGER,
      eCoordinates: DataTypes.STRING,
      wCoordinates: DataTypes.STRING,
      data: DataTypes.TEXT,
      timeOpen: DataTypes.STRING,
      timeClosed: DataTypes.STRING,
      rate: DataTypes.INTEGER,
      img: DataTypes.TEXT,
      img2: DataTypes.TEXT,
      img3: DataTypes.TEXT,
      camperPrice: DataTypes.INTEGER,
      shelterPrice: DataTypes.INTEGER,
      place_type: DataTypes.STRING,
      seasonality: DataTypes.STRING,
      reservoir: DataTypes.STRING,
      entertainment: DataTypes.STRING,
      communication: DataTypes.STRING,
      sanitation: DataTypes.STRING,
      location: DataTypes.STRING,
      pay_by_card: DataTypes.STRING,
      addition: DataTypes.STRING,
      camperId: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: 'Camper',
    }
  );
  return Camper;
};
