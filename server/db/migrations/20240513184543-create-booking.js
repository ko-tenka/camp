'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Bookings', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      userId: {
        type: Sequelize.INTEGER,
        references: {
          model: 'Users',
          key: 'id',
        },
        onDelete: 'cascade',
      },
      camperId: {
        type: Sequelize.INTEGER,
        references: {
          model: 'Campers',
          key: 'id',
        },
        onDelete: 'cascade',
      },
      name:{
        type: Sequelize.STRING,
      },
      famale:{
        type: Sequelize.STRING,
      }, 
      guest: {
        type: Sequelize.INTEGER,
      },
      shelterCount: {
        type: Sequelize.INTEGER
      },
      camperCount: {
        type: Sequelize.INTEGER
      },
      dateCheckIn: {
        type: Sequelize.DATE
      },
      dateDeparture: {
        type: Sequelize.DATE
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
    await queryInterface.dropTable('Bookings');
  }
};