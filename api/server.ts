import express from "express";

const app = express();
const port = 5000;

app.get("/", (req, res) => {
    res.json({
        "name": "hisham"
    })
})
app.listen(port, () => console.log(`express is listning on port ${port}`));
