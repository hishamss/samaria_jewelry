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
        type: "ring",
        description: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy",
        quantity: JSON.stringify({4:3, 2:2}),
        price: 29.99,
        numOfOtherImage: 3,

      },
      {
     
        name: "Item2",
        type: "bracelet",
        description: "Lorem Ipsum is simply dummy text of the printing and typesetting industry.",
        quantity: JSON.stringify({"all":5}),
        price: 29.99,
        numOfOtherImage: 3,
      },
      {
  
        name: "Item3",
        type: "ring",
        description: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy",
        quantity: JSON.stringify({7:3, 3:2, 8:0}),
        price: 49.99,
        numOfOtherImage: 3,
      },
      {
      
        name: "Item4",
        type: "bracelet",
        description: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's.",
        quantity: JSON.stringify({"all":11}),
        price: 89.99,
        numOfOtherImage: 3,
      },
      {
    
        name: "Item5",
        type: "bracelet",
        description: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem 5.",
        quantity: JSON.stringify({"all":13}),
        price: 79.99,
        numOfOtherImage: 2,
      },
      {
      
        name: "Item6",
        type: "bracelet",
        description: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem 5.",
        quantity: JSON.stringify({"all":18}),
        price: 59.99,
        numOfOtherImage: 2,
      },
      {
   
        name: "Item7",
        type: "bracelet",
        description: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem 5.",
        quantity: JSON.stringify({"all":19}),
        price: 49.99,
        numOfOtherImage: 2,
      }
    ])

  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Items', null, {});

  }
};
