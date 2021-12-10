import { Sequelize } from 'sequelize-typescript';
import * as dotenv from "dotenv";
import { Item } from '../models/Item';
import {Size} from "../models/Size"
dotenv.config();
export const sequelize = new Sequelize({
    database: process.env.DB_NAME,
    dialect: 'postgres',
    dialectOptions: {
        ssl: {
            require: true,
            rejectUnauthorized: false
        }
    },
    username: process.env.DB_USER,
    password: process.env.DB_PASS,
    host: process.env.DB_URL,
    define: {
        timestamps: false
      },
    storage: ':memory:',
    models: [Item, Size ],
});