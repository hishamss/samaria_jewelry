import path from "path";
import {Router} from "express";
import apiRouters from "./api";
const routes = Router();
// API Routes
routes.use("/api", apiRouters);

if(process.env.NODE_ENV === 'production') {
  // If no API routes are hit, send the React app
  routes.use((req, res) => {
    res.sendFile(path.join(__dirname, "../client/build", "index.html"));
  });
  }else {
    routes.use((req, res) => {
      res.redirect("http://localhost:3000");
    })
  }

export default routes;