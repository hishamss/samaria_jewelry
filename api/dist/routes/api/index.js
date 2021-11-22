"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = require("express");
var items_1 = __importDefault(require("./items"));
var apiRouters = (0, express_1.Router)();
// Book routes
apiRouters.use("/items", items_1.default);
exports.default = apiRouters;
