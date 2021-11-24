import express from "express";
import path from "path";
import routes from "./routes";
import {sequelize} from "./db_config/sequelize"
const app = express();
const PORT =  process.env.PORT || 3001;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
// Serve up static assets (usually on heroku)
// if (process.env.NODE_ENV === "production") {
//   app.use(express.static("client/build"));
// }
(async () => {
    await sequelize.sync();
    app.listen(PORT, () => console.log(`Listning on port ${PORT}`));
})();



app.use(routes);


