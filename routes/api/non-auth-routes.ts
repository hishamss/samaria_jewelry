
import { Router} from "express";
import { Item } from "../../models/Item"
import { Size } from "../../models/Size"
const getItemsRoute = Router();
getItemsRoute.route("/").get((req, res) => {
    Item.findAll({ include: [Size] })
        .then(items => {
            res.json(items)

        })
        .catch(e => console.log(e))
})

export default getItemsRoute