import express from "express";
import path from "path";
import routes from "./routes";

const app = express();
const PORT =  process.env.PORT || 3001;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
// Serve up static assets (usually on heroku)
// if (process.env.NODE_ENV === "production") {
//   app.use(express.static("client/build"));
// }
app.use(express.static(path.join(__dirname, 'build')));

app.use(routes);


app.listen(PORT, () => console.log(`Listning on port ${PORT}`));