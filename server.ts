import express from "express";
import path from "path";
import { Item } from "./models/Item"
import { Size } from "./models/Size"
import { sequelize } from "./db_config/sequelize"
import {Op} from 'sequelize'
import * as dotenv from "dotenv";
import { NewItem, Order, CartItem, CartItemAvailableQuantity } from "./types";
let nodemailer = require('nodemailer');
let smtpTransport = require('nodemailer-smtp-transport');
dotenv.config();
var transporter = nodemailer.createTransport(smtpTransport({
    service: 'gmail',
    host: 'smtp.gmail.com',
    auth: {
      user: 'samaria.jewelery@gmail.com',
      pass: `${process.env.GMAIL_APP_PASSWORD}`
    }
  }));
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
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
        let order: Order = req.body;
        console.log('order', order)
        if (order) {
            if (order.stripeToken && order.claimedPrice && order.buyerInfo.firstname && order.buyerInfo.lastname && order.buyerInfo.email && order.buyerInfo.address1 && order.buyerInfo.state && order.buyerInfo.zip) {
                let availableQuants = await getAvailableQuantities(order.cartItems)
                if(availableQuants.length != order.cartItems.length) {
                    let unAvailableItems:CartItem[] = []
                    order.cartItems.forEach(cartItem => {
                        if(!(availableQuants.find(i => i.id === cartItem.id && i.size === cartItem.size))) {
                            unAvailableItems.push(cartItem)
                        }
                    });
                    console.log('server unavailable', unAvailableItems)
                    res.status(404).json(unAvailableItems)
                }
                if(availableQuants.length == order.cartItems.length) {
                    if(isSufficientInventory(availableQuants)) {
                        let price = await calcPrice(order.cartItems);
                        await updateQuantities(order.cartItems);
                        try {
                            const payment = await stripe.paymentIntents.create({
                              amount: price * 100,
                              currency: "USD",
                              description: `${order.buyerInfo.firstname} ${order.buyerInfo.lastname} ${order.buyerInfo.email}`,
                              payment_method: order.stripeToken,
                              confirm: true,
                            });
                            res.status(200).json(
                                {paymentInfo: {
                                    id: payment.id,
                                    amount: payment.amount,
                                    status: payment.status
                                }}
                            )
                          } catch (error) {
                            res.status(500).send(error);
                          }
                    }else {
                        res.status(200).json(
                            {availableQuants: availableQuants}
                        )
                    }
                }
             

            } else {
                res.status(400).send('missing data in order object')
            }

        } else {
            res.status(400).send('missing order object in the request body')
        }

    } else {
        res.status(400).send("missing request body")
    }
})

app.post("/api/items/sendemail", async (req, res) => {
    if(req.body) {
        let order:Order = req.body.order
        let paymentId = req.body.paymentId;
        let price = await calcPrice(order.cartItems)
        let itemsHtml = ""
        order.cartItems.forEach(item => {
            itemsHtml += `<ul><li>${item.name}<ul><li>Quantity: ${item.quantity}</li><li>Price: $${item.price}</li><li>Size: ${item.size === 'all' ? 'NA' : item.size}</li></ul></li></ul>`
        })
    let mailOptions = {
        from: 'samaria.jewelery@gmail.com',
        to: `${order.buyerInfo.email}`,
        subject: `Smaria Jewlery: order confirmed`,
        html: `
        <h2>Ordered from:</h2>
        <p> Samaria Jewelery</p>
        <h2>Order id:</h2>
        <p> ${paymentId}</p>
        <h2>Total cost:</h2>
        <p> $${price}</p>
        <h2>Items</h2>
        <ul>
        ${itemsHtml}
        </ul>
        <h2>Shipping Address:</h2>
        <p> ${order.buyerInfo.address1} ${order.buyerInfo.address2}</p>
        <p> ${order.buyerInfo.state} ${order.buyerInfo.zip} US </p>
        `
      };
    
      transporter.sendMail(mailOptions, (error: any, info: { response: string; }) => {
        if (error) {
          console.log('sending email error: ', error);
          res.status(500).send(error)
        } else {
          res.status(200).send('email sent sucessfully')
        }
      });
    }else {
        res.status(400).send('missing request body')
    }
    
})

const updateQuantities = async (cartItems: CartItem[]) => {
    for(const cartItem of cartItems) {
        let currentQuantity = (await Size.findOne({ where: {[Op.and]: [{ itemId: cartItem.id}, {size: cartItem.size } ]}  }))?.quantity as number;
        let newQuantity = currentQuantity - cartItem.quantity;
        await Size.update(
            {quantity: newQuantity},
            {where: {itemId: cartItem.id, size: cartItem.size}}
        )
    }
}

const calcPrice = async (cartItems: CartItem[]) => {
    interface IdToQuantity {
        [id:number]: number;
    }
    let quantityForEachId: IdToQuantity = {};

    let cartItemIds = cartItems.map(cartItem => {
        if(cartItem.id in quantityForEachId) {
            quantityForEachId[cartItem.id] = quantityForEachId[cartItem.id] + cartItem.quantity
        }else quantityForEachId[cartItem.id] = cartItem.quantity;
       return cartItem.id
        
    });
    let items = await Item.findAll({where: {id: cartItemIds}})
    return items.reduce((curr, next) => curr + next.price * quantityForEachId[next.id], 0);
}

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
    // let cartItemIds = cartItems.map(cartItem => cartItem.id);
    // console.log("cartItemsIds", cartItemIds)
    // let cartItemSizes = cartItems.map(cartItem => cartItem.size);
    // console.log("cartItemSizes", cartItemSizes)
    let foundItems:Size[] = []
    for(const cartItem of cartItems) {
        let foundItem = await Size.findOne({ where: {[Op.and]: [{ itemId: cartItem.id}, {size: cartItem.size } ]}  });
        if(foundItem) foundItems.push(foundItem)
    }

    console.log("foundItems", foundItems)
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




