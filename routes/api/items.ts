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
                            res.json(item)
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
    if (!req.body) {
        res.status(400)
        res.send("Incomplete request")
    }
})

itemsRouter.route("/delete").delete((req, res) => {
    if (req.body) {
        let requestBody = req.body;
        if (requestBody.hasOwnProperty('password')) {
            let { password, itemId }: { password: string; itemId: number } = requestBody;
            if (password === process.env.DELETE_PASS) {
                if (itemId) {
                    Item.destroy({
                        where: { id: itemId }
                    }).then(() => {
                        res.status(200).end();

                    }).catch(e => {
                        res.status(400)
                        res.json({ "error": e.message })
                    })
                }
                if (!itemId) {
                    res.status(400)
                    res.send("Incomplete request")
                }
            }
            if (password !== process.env.DELETE_PASS) {
                res.status(401);
                res.send("Unauthorized");
            }
        }
        if (!requestBody.hasOwnProperty('password')) {
            res.status(401);
            res.send("Unauthorized");
        }

    }
    if (!req.body) {
        res.status(400)
        res.send("Incomplete request")
    }
})

export default itemsRouter;

///////////////////////////////////////////////////////
// Add Item Request:
// JSON body:

// {
//     "password" : "",
//     "newItem":
//     {
//             "name": "Item name",
//             "type": "Item type",
//                 "description": "Item description",
//                     "price": number,
//                         "numOfOtherImage": number,
//                             "sizes": [
//                                 {
//                                     "size": "size1",
//                                     "quantity": qunatity of this size1
//                                 },
//                                 {
//                                     "size": "size2",
//                                     "quantity": quantity of size2
//                                 }
//                             ]
//     }
// }
//////////////////////////////////////////////////////
// Remove Item Request:
// JSON Body:

// {
//     "password": "",
//     "itemId": id
// }


