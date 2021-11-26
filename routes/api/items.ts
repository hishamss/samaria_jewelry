import {Router} from "express";
import {Item} from "../../models/Item"
const itemsRouter = Router();

itemsRouter.route("/").get((req, res) => {
    Item.findAll()
    .then(items => {
        res.json(items)
        
    })
    .catch(e => console.log(e))
})

export default itemsRouter;