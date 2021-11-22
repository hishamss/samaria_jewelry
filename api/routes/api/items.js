"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = require("express");
var items_json_1 = __importDefault(require("../../items.json"));
var itemsRouter = (0, express_1.Router)();
itemsRouter.route("/").get(function (req, res) {
    res.json(items_json_1.default);
});
exports.default = itemsRouter;
