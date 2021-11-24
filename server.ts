import express from "express";
import path from "path";
import routes from "./routes";
import { sequelize } from "./db_config/sequelize"
const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

if (process.env.NODE_ENV === 'production') {
    // this is default in case of unmatched routes in prod env
    routes.use((req, res) => {
        app.use(express.static(path.join(__dirname, '../client/build')));
    });
} else {
    // this is default in case of unmatched routes ind dev env
    routes.use((req, res) => {

        res.redirect("http://localhost:3000/");
    });
}
(async () => {
    await sequelize.sync();
    app.listen(PORT, () => console.log(`Listning on port ${PORT}`));
})();



app.use(routes);


