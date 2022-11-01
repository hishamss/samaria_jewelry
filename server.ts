import express from "express";
import path from "path";
import { Item } from "./models/Item"
import { Size } from "./models/Size"
import { sequelize } from "./db_config/sequelize"
import * as dotenv from "dotenv";
import { NewItem, Order, CartItem, CartItemAvailableQuantity } from "./types";
dotenv.config();
const app = express();
const PORT = process.env.PORT || 3001;
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
let multer = require("multer");
let aws = require("aws-sdk");
let multerS3 = require("multer-s3");
aws.config.update({
    secretAccessKey: process.env.AWS_KEY,
    accessKeyId: process.env.AWS_ID,
    region: "us-east-2",
})
let s3 = new aws.S3();
const upload = multer({
    storage: multerS3({
        s3: s3,
        bucket: "samaria-item-images",
        //acl: "public-read",
        metadata: function (req: any, file: any, cb: any) {
            cb(null, { fieldName: file.fieldname });
        },
        key: function (req: any, file: any, cb: any) {
            cb(
                null,
                `${req.body.folder}/${file.originalname}.jpg`
            );
        },
    }),
    limits: { fileSize: 500000 },
    fileFilter: (req: any, file: any, cb: any) => {
        checkFileType(file, cb);
    }
}).array("images")


const checkFileType = (file: any, cb: any) => {
    const filetypes = /jpeg|jpg/;
    const mimetype = filetypes.test(file.mimetype);
    if (mimetype) {
        return cb(null, true);
    } else {
        cb("Error: Images Only");
    }
}
const { auth } = require('express-oauth2-jwt-bearer');
const checkJwt = auth({
    audience: process.env.AUTH0_AUDIENCE,
    issuerBaseURL: process.env.AUTH0_DOMAIN
})



app.get("/api/items/getall", (req, res) => {
    Item.findAll({ include: [Size] })
        .then(items => {
            res.json(items)

        })
        .catch(e => console.log(e))
});

app.post("/api/items/s3-upload", checkJwt, (req, res) => {
    upload(req, res, (err: any) => {
        if (err) {
            console.log(err)
            res.status(400)
            res.send("Failed to upload")
        } else {
            res.status(200)
            res.send("Images uploaded sucessfully");
        }

    })
})

app.post("/api/items/order", async (req, res) => {
    if (req.body) {
        console.log('received order in backend', req.body)
        let order: Order = req.body;
        if (order) {
            if (order.stripeToken && order.claimedPrice && order.buyerInfo.firstname && order.buyerInfo.lastname && order.buyerInfo.email && order.buyerInfo.address1 && order.buyerInfo.state && order.buyerInfo.zip) {
                let availableQuants = await getAvailableQuantities(order.cartItems)
                console.log('availableQuants', availableQuants)
                if(isSufficientInventory(availableQuants)) {
                    res.status(200)
                    res.send('request quantities are in stock')
                }else {
                    res.status(404)
                    res.json(availableQuants)
                }

            } else {
                res.status(400)
            }

        } else {
            res.status(400)
        }

    } else {
        res.status(400)
    }
})

const isSufficientInventory = (availQuants: CartItemAvailableQuantity[]) => {
    let sufficientInventory = true;
    availQuants.forEach(availQuant => {
        if (!availQuant.isQuantInStock) {
            sufficientInventory = false;
            return
        };
    })

    return sufficientInventory;
}

const getAvailableQuantities = async (cartItems: CartItem[]) => {
    let availableQuantities: CartItemAvailableQuantity[] = []
    let cartItemIds = cartItems.map(cartItem => cartItem.id);
    let cartItemSizes = cartItems.map(cartItem => cartItem.size);
    let foundItems = await Size.findAll({ where: { itemId: cartItemIds, size: cartItemSizes } })
    console.log('foundItems', foundItems)
    if (foundItems.length > 0) {
        foundItems.forEach(foundItem => {
            let foundItemId = foundItem.getDataValue('itemId')
            let foundItemSize = foundItem.getDataValue('size');
            let cartItemQuantity = cartItems.find((cartItem => cartItem.id === foundItemId && cartItem.size === foundItemSize))?.quantity as number
            availableQuantities.push({
                id: foundItemId,
                size: foundItemSize,
                availableQuantity: foundItem.getDataValue('quantity'),
                isQuantInStock: foundItem.getDataValue('quantity') >=  cartItemQuantity? true : false
            })
        })

    }
    return availableQuantities;

}

app.post("/api/items/add", checkJwt, (req, res) => {
    if (req.body) {
        let newItem: NewItem = req.body;
        if (newItem) {
            Item.create(

                newItem
                , {
                    include: Size
                }).then(item => {
                    res.status(200)
                    res.json(item)
                }
                ).catch(e => {
                    let errorMessage = ""
                    if (e.name && e.name === 'SequelizeUniqueConstraintError') {
                        errorMessage = "Item already exists"
                    } else {
                        errorMessage = e.message
                    }
                    res.status(400)
                    res.send(errorMessage)
                })
        } else {
            res.status(400)
            res.send("Incomplete request")
        }
    } else {
        res.status(400)
        res.send("Incomplete request")
    }
});

app.delete("/api/items/delete", checkJwt, (req, res) => {
    if (req.body) {
        if (req.body.name) {
            let itemName = (req.body.name).toLocaleUpperCase();
            Item.destroy({
                where: { name: itemName }
            }).then(async (numOFRowsDeleted) => {
                if (numOFRowsDeleted) {
                    try {
                        const response = await deleteItemFromS3(itemName);
                        if (response.Deleted) {
                            res.status(200);
                            res.send("Deleted sucessfully")
                        } else {
                            res.status(400);
                            res.send("item has been deleted from DB but item images failed delete")
                        }
                    } catch (e: any) {
                        res.status(500);
                        res.send("item has been deleted from DB but item images failed delete")
                    }


                }
                if (!numOFRowsDeleted) {
                    res.status(200)
                    res.send("No item found with this name")

                }

            }).catch(e => {
                res.status(400)
                res.send("failed to delete")
            })
        } else {
            res.status(400)
            res.send("Incomplete request")
        }
    } else {
        res.status(400)
        res.send("Incomplete request")
    }

})
const deleteItemFromS3 = async (folder: string) => {
    const listParams = {
        Bucket: "samaria-item-images",
        Prefix: folder
    };
    const listedObjects = await s3.listObjectsV2(listParams).promise();
    if (listedObjects.Contents.length === 0) {
        return {
            Deleted: [],
            Errors: []
        };
    }
    const deleteParams = {
        Bucket: "samaria-item-images",
        Delete: {
            Objects: []
        }
    };
    deleteParams.Delete.Objects = listedObjects.Contents.map((Content: any) => {
        return { Key: Content.Key }
    });
    return await s3.deleteObjects(deleteParams).promise();

}
if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, '../client/build')));
    // If no API routes are hit, send the React app
    app.get("*", (req, res) => {
        res.sendFile(path.join(__dirname, "../client/build", "index.html"));
    });
} else {
    app.get("*", (req, res) => {
        res.redirect("http://localhost:3000");
    })
}
(async () => {
    await sequelize.sync();
    app.listen(PORT, () => console.log(`Listning on port ${PORT}`));
})();





