'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
		
		static associate({ Booking }) {
			this.hasMany(Booking, { foreignKey: 'userId' });
		}
	}
  User.init({
    name: DataTypes.STRING,
    email: DataTypes.STRING,
    password: DataTypes.STRING,
    partner: DataTypes.BOOLEAN,
    img: DataTypes.STRING,
    numberPhone: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'User',
  });
  return User;
};