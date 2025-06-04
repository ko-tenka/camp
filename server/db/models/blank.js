'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Blank extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Blank.init({
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
    camperId: DataTypes.INTEGER,
  }, {
    sequelize,
    modelName: 'Blank',
  });
  return Blank;
};