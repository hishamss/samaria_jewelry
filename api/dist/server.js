"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = __importDefault(require("express"));
var path_1 = __importDefault(require("path"));
var routes_1 = __importDefault(require("./routes"));
var app = (0, express_1.default)();
var PORT = process.env.PORT || 3001;
app.use(express_1.default.urlencoded({ extended: true }));
app.use(express_1.default.json());
// Serve up static assets (usually on heroku)
// if (process.env.NODE_ENV === "production") {
//   app.use(express.static("client/build"));
// }
app.use(express_1.default.static(path_1.default.join(__dirname, 'build')));
app.use(routes_1.default);
app.listen(PORT, function () { return console.log("Listning on port ".concat(PORT)); });
