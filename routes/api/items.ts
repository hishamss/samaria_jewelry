import { Router } from "express";
import * as dotenv from "dotenv";
import { Item } from "../../models/Item"
import { Size } from "../../models/Size"
import { NewItem } from "../../types";
const itemsRouter = Router();
dotenv.config();
itemsRouter.route("/").get((req, res) => {
    Item.findAll({ include: [Size] })
        .then(items => {
            res.json(items)

        })
        .catch(e => console.log(e))
})

itemsRouter.route("/add").post((req, res) => {
    if (req.body) {
        console.log(req.body)
        let requestBody = req.body;
        if (requestBody.hasOwnProperty('password')) {
            let { password, newItem }: { password: string; newItem: NewItem } = requestBody;
            if (password === process.env.CREATE_PASS) {
                if (newItem) {
                    Item.create(

                        newItem
                        , {
                            include: Size
                        }).then(item => {
                            res.status(200)
                            res.json(req.body)
                        }

                        ).catch(e => {
                            res.status(400)
                            res.json({ "error": e.message })
                        })

                }
                if (!newItem) {
                    res.status(400)
                    res.send("Incomplete request")
                }
            }
            if (password !== process.env.CREATE_PASS) {
                res.status(401);
                res.send("Unauthorized");
            }
        }
        if (!requestBody.hasOwnProperty('password')) {
            res.status(401);
            res.send("Unauthorized");
        }
    }

})

export default itemsRouter;




