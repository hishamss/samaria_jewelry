import express from "express";
import path from "path";
import routes from "./routes";
import * as dotenv from "dotenv";
dotenv.config();
const app = express();
const PORT =  process.env.PORT || 3001;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
// Serve up static assets (usually on heroku)
// if (process.env.NODE_ENV === "production") {
//   app.use(express.static("client/build"));
// }

if(process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, '../client/build')));
}


app.use(routes);


app.listen(PORT, () => console.log(`Listning on port ${PORT}`, process.env.DB_PASS));