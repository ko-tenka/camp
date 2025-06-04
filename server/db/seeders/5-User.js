'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert(
      'Users',
      [
        {
          name: 'John',
          email: 'bv@aer.com',
          password: 'awe',
          partner: false,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          name: 'Doe',
          email: 'qqbvt@aer.com',
          password: 'awess',
          partner: true,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          name: 'Bobe',
          email: 'qqbvdsdt@aer.com',
          password: 'asdwess',
          partner: true,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      {}
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Users', null, {});
  },
};
