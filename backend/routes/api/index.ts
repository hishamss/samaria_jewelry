import {Router} from "express";
import itemsRouter  from "./items";
const apiRouters = Router();

// Book routes
apiRouters.use("/items", itemsRouter);


export default apiRouters;