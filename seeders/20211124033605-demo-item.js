// Create seed in seeders folder:
// npx sequelize-cli seed:generate --name demo-item

// populate data in DB:
// npx sequelize-cli db:seed:all

// Undo all seeds:
// npx sequelize-cli db:seed:undo:all

'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {

    await queryInterface.bulkInsert('Items', [
      {
        id: 1,
        name: "Item1",
        description: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy",
        quantity: 3,
        price: 29.99,
        numOfOtherImage: 3
      },
      {
        id: 2,
        name: "Item2",
        description: "Lorem Ipsum is simply dummy text of the printing and typesetting industry.",
        quantity: 5,
        price: 29.99,
        numOfOtherImage: 3
      },
      {
        id: 3,
        name: "Item3",
        description: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy",
        quantity: 7,
        price: 49.99,
        numOfOtherImage: 3
      },
      {
        id: 4,
        name: "Item4",
        description: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's.",
        quantity: 11,
        price: 89.99,
        numOfOtherImage: 3
      },
      {
        id: 5,
        name: "Item5",
        description: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem 5.",
        quantity: 13,
        price: 79.99,
        numOfOtherImage: 2
      },
      {
        id: 6,
        name: "Item6",
        description: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem 5.",
        quantity: 18,
        price: 59.99,
        numOfOtherImage: 2
      },
      {
        id: 7,
        name: "Item7",
        description: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem 5.",
        quantity: 19,
        price: 49.99,
        numOfOtherImage: 2
      }
    ])


  },

  down: async (queryInterface, Sequelize) => {
    
  await queryInterface.bulkDelete('Items', null, {});

  }
};
