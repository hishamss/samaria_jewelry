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
  
        name: "Item1",
        description: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy",
        quantity: 3,
        price: 29.99,
        numOfOtherImage: 3,
        sizes: null
      },
      {
     
        name: "Item2",
        description: "Lorem Ipsum is simply dummy text of the printing and typesetting industry.",
        quantity: 5,
        price: 29.99,
        numOfOtherImage: 3,
        sizes: null
      },
      {
  
        name: "Item3",
        description: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy",
        quantity: 7,
        price: 49.99,
        numOfOtherImage: 3,
        sizes: JSON.stringify({4:3, 2:2})
      },
      {
      
        name: "Item4",
        description: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's.",
        quantity: 11,
        price: 89.99,
        numOfOtherImage: 3,
        sizes: JSON.stringify({7:3,9:2})
      },
      {
    
        name: "Item5",
        description: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem 5.",
        quantity: 13,
        price: 79.99,
        numOfOtherImage: 2,
        sizes: null
      },
      {
      
        name: "Item6",
        description: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem 5.",
        quantity: 18,
        price: 59.99,
        numOfOtherImage: 2,
        sizes: null
      },
      {
   
        name: "Item7",
        description: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem 5.",
        quantity: 19,
        price: 49.99,
        numOfOtherImage: 2,
        sizes: null
      }
    ])

  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Items', null, {});

  }
};
