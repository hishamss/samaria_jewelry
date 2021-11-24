import path from "path";
import {Router} from "express";
import apiRouters from "./api";
const routes = Router();
// API Routes
routes.use("/api", apiRouters);



export default routes;