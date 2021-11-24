'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('Items', [
      {
  
        name: "Item1",
        description: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy",
        quantity: 3,
        price: 29.99,
        numOfOtherImage: 3
      },
      {
     
        name: "Item2",
        description: "Lorem Ipsum is simply dummy text of the printing and typesetting industry.",
        quantity: 5,
        price: 29.99,
        numOfOtherImage: 3
      },
      {
  
        name: "Item3",
        description: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy",
        quantity: 7,
        price: 49.99,
        numOfOtherImage: 3
      },
      {
      
        name: "Item4",
        description: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's.",
        quantity: 11,
        price: 89.99,
        numOfOtherImage: 3
      },
      {
    
        name: "Item5",
        description: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem 5.",
        quantity: 13,
        price: 79.99,
        numOfOtherImage: 2
      },
      {
      
        name: "Item6",
        description: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem 5.",
        quantity: 18,
        price: 59.99,
        numOfOtherImage: 2
      },
      {
   
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
