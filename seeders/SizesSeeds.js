// Create seed in seeders folder:
// npx sequelize-cli seed:generate --name demo-item

// populate all seeds js files under seeders directory in DB:
// npx sequelize-cli db:seed:all


// populate specific seed js file under seeders directory in DB:
// npx sequelize-cli db:seed --seed [seed file name]
// Ex: newItem.js
// npx sequelize-cli db:seed --seed newItem


// Undo all seeds:
// npx sequelize-cli db:seed:undo:all

'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('Sizes', [
      {

        itemId: 1,
        size: "all",
        quantity: 3

      },
      {

        itemId: 2,
        size: "all",
        quantity: 5
      },
      {
        itemId: 3,
        size: "7",
        quantity: 3
      },
      {
        itemId: 3,
        size: "3",
        quantity: 2
      },
      {
        itemId: 3,
        size: "8",
        quantity: 0
      },
      {

        itemId: 4,
        size: "all",
        quantity: 11
      },
      {

        itemId: 5,
        size: "all",
        quantity: 13
      },
      {

        itemId: 6,
        size: "all",
        quantity: 18
      },
      {
        itemId: 7,
        size: "9",
        quantity: 5
      },
      {
        itemId: 7,
        size: "2",
        quantity: 4
      },
      {
        itemId: 7,
        size: "8",
        quantity: 5
      },
    ])

  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Items', null, {});

  }
};
