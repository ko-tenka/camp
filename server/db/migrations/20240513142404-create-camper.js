'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Campers', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      title: {
        type: Sequelize.STRING
      },
      shelterCount: {
        type: Sequelize.INTEGER
      },
      camperCount: {
        type: Sequelize.INTEGER
      },
      eCoordinates: {
        type: Sequelize.STRING
      },
      wCoordinates: {
        type: Sequelize.STRING
      },
      data: {
        type: Sequelize.TEXT
      },
      timeOpen: {
        type: Sequelize.STRING
      },
      timeClosed: {
        type: Sequelize.STRING
      },
      rate: {
        type: Sequelize.INTEGER
      },
      img: {
        type: Sequelize.TEXT
      },
      img2: {
        type: Sequelize.TEXT
      },
      img3: {
        type: Sequelize.TEXT
      },
      camperPrice: {
        type: Sequelize.INTEGER
      },
      shelterPrice: {
        type: Sequelize.INTEGER
      },
      place_type: {
        type: Sequelize.STRING
      },
      seasonality: {
        type: Sequelize.STRING
      },
      reservoir: {
        type: Sequelize.STRING
      },
      entertainment: {
        type: Sequelize.STRING
      },
      communication: {
        type: Sequelize.STRING
      },
      sanitation: {
        type: Sequelize.STRING
      },
      location: {
        type: Sequelize.STRING
      },
      pay_by_card: {
        type: Sequelize.STRING
      },
      addition: {
        type: Sequelize.STRING
      },
      camperId: {
        type: Sequelize.INTEGER
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.fn('NOW')
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.fn('NOW')
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Campers');
  }
};