"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var path_1 = __importDefault(require("path"));
var express_1 = require("express");
var api_1 = __importDefault(require("./api"));
var routes = (0, express_1.Router)();
// API Routes
routes.use("/api", api_1.default);
// If no API routes are hit, send the React app
routes.use(function (req, res) {
    res.sendFile(path_1.default.join(__dirname, "build", "index.html"));
});
exports.default = routes;
