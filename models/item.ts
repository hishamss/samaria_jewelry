'use strict';
import { UUIDV4 } from "sequelize/dist";
import {Item} from "../types";
const {
  Model
} = require('sequelize');
module.exports = (sequelize:any, DataTypes:any) => {
  class Item extends Model<Item> 
  implements Item {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    id!: number;
    name!: string;
    description!: string | null;
    quantity!: number;
    price!: number;
    numOfOtherImage!:number;
    static associate(models:any) {
      // define association here
    }
  };
  Item.init({
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,

    },
    name: {
      type:DataTypes.STRING,
      allowNull: false,
    },
    description: DataTypes.STRING,
    quantity: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    price: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    numOfOtherImage: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  }, {
    sequelize,
    modelName: 'Item',
    timestamps: false,
  });
  return Item;
};