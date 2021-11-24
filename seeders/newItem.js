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

    await queryInterface.bulkInsert('Items', [
      {
        name: "Item8",
        description: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy",
        quantity: 3,
        price: 29.99,
        numOfOtherImage: 3
      },
    ])


  },

  down: async (queryInterface, Sequelize) => {
    
  await queryInterface.bulkDelete('Items', null, {});

  }
};
