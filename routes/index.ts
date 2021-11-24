import path from "path";
import {Router} from "express";
import apiRouters from "./api";
const routes = Router();
// API Routes
routes.use("/api", apiRouters);

if(process.env.NODE_ENV === 'production') {
// this is default in case of unmatched routes in prod env
routes.use((req, res) => {
  res.sendFile(path.join(__dirname, "../client/build", "index.html"));
});
} else {
  // this is default in case of unmatched routes ind dev env
  routes.use((req, res) => {
  
    res.redirect("http://localhost:3000/");
  });
}

export default routes;