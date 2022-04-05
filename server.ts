import express from "express";
import path from "path";
import { Item } from "./models/Item"
import { Size } from "./models/Size"
import { sequelize } from "./db_config/sequelize"
import * as dotenv from "dotenv";
import { NewItem } from "./types";
dotenv.config();
const app = express();
const PORT = process.env.PORT || 3001;
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
const { auth } = require('express-oauth2-jwt-bearer');
const checkJwt = auth({
    audience: "3VgqmK6whmqGeTXFpF9afOmjvUPOXN0Y",
    issuerBaseURL: process.env.AUTH0_DOMAIN
})

if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, '../client/build')));
}





app.get("/api/items/", (req, res) => {
    Item.findAll({ include: [Size] })
        .then(items => {
            res.json(items)

        })
        .catch(e => console.log(e))
});

app.post("/api/items/add", checkJwt, (req, res) => {
    if (req.body) {
        let newItem: NewItem = req.body;
        if (newItem) {
            Item.create(

                newItem
                , {
                    include: Size
                }).then(item => {
                    res.status(200)
                    res.json(item)
                }
                ).catch(e => {
                    let errorMessage = ""
                    if(e.name && e.name === 'SequelizeUniqueConstraintError') {
                        errorMessage = "Item already exists"
                    }else {
                        errorMessage = e.message
                    }
                    res.status(400)
                    res.send(errorMessage)
                })
        } else {
            res.status(400)
            res.send("Incomplete request")
        }
    }else {
        res.status(400)
        res.send("Incomplete request")
    }
});
if (process.env.NODE_ENV === 'production') {
    // If no API routes are hit, send the React app
    app.get("*", (req, res) => {
        res.sendFile(path.join(__dirname, "../../client/build", "index.html"));
    });
} else {
    app.get("*", (req, res) => {
        res.redirect("http://localhost:3000");
    })
}
(async () => {
    await sequelize.sync();
    app.listen(PORT, () => console.log(`Listning on port ${PORT}`));
})();





