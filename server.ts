import express from "express";
import path from "path";
import routes from "./routes";
import db from "./models";

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

const startApp = async() => {
    try {
        await db.sequelize.sync({force:true}).then(() => {
            app.listen(PORT, () => console.log(`Listning on port ${PORT}`));
            
        });
    }catch(err) {
        console.log(err);
    }
    
};


startApp();

