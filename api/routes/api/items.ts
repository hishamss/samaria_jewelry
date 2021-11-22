import {Router} from "express";
import Items from "../../items.json";
const itemsRouter = Router();

itemsRouter.route("/").get((req, res) => {
    res.json(Items);
})

export default itemsRouter;