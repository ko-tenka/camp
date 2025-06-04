'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert(
      'Bookings',
      [
        {
          userId: 1,
          camperId: 1,
          shelterCount: 1,
          camperCount: 1,
          dateCheckIn: new Date(Date.parse('2024-05-15 00:00:00 +0300')),
          dateDeparture: new Date(Date.parse('2024-05-17 00:00:00 +0300')),
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          userId: 2,
          camperId: 1,
          shelterCount: 1,
          camperCount: 1,
          dateCheckIn: new Date(Date.parse('2024-05-16 00:00:00 +0300')),
          dateDeparture: new Date(Date.parse('2024-05-18 00:00:00 +0300')),
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          userId: 3,
          camperId: 1,
          shelterCount: 1,
          camperCount: 1,
          dateCheckIn: new Date(Date.parse('2024-05-17 00:00:00 +0300')),
          dateDeparture: new Date(Date.parse('2024-05-19 00:00:00 +0300')),
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          userId: 1,
          camperId: 2,
          shelterCount: 1,
          camperCount: 1,
          dateCheckIn: new Date(Date.parse('2024-05-15 00:00:00 +0300')),
          dateDeparture: new Date(Date.parse('2024-05-19 00:00:00 +0300')),
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          userId: 2,
          camperId: 2,
          shelterCount: 1,
          camperCount: 1,
          dateCheckIn: new Date(Date.parse('2024-05-17 00:00:00 +0300')),
          dateDeparture: new Date(Date.parse('2024-05-21 00:00:00 +0300')),
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          userId: 3,
          camperId: 2,
          shelterCount: 1,
          camperCount: 1,
          dateCheckIn: new Date(Date.parse('2024-05-20 00:00:00 +0300')),
          dateDeparture: new Date(Date.parse('2024-05-23 00:00:00 +0300')),
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      {}
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Bookings', null, {});
  },
};
