import React, { useState, useEffect } from "react";
import "./index.css";
import { useAuth0 } from "@auth0/auth0-react";
import { NewItem, AddedItemSize } from "../../types"
import { addNewItem } from "../../utils/api";
const Admin = () => {
    const [itemName, SetItemName] = useState("");
    const [itemType, SetItemType] = useState("");
    const [itemDescription, SetItemDescription] = useState("");
    const [itemPrice, SetItemPrice] = useState(0);
    const [sizeWithQuantityArray, SetSizeWithQuantityArray] = useState("");
    const [itemSizes, SetItemSizes] = useState<AddedItemSize[]>([]);
    const [ItemNameMessage, SetItemNameMessage] = useState(false);
    const [ItemTypeMessage, SetItemTypeMessage] = useState(false);
    const [ItemPriceMessage, SetItemPriceMessage] = useState(false);
    const [ItemQuantityMessage, SetItemQuantityMessage] = useState(false);
    const [ItemSizeMessage, SetItemSizeMessage] = useState(false);
    const { loginWithRedirect, logout, isAuthenticated, isLoading, getIdTokenClaims  } = useAuth0();
    useEffect( () => {
        if(isAuthenticated) {
            (async () => {
                const claims = await getIdTokenClaims();
                console.log("token: ")
                console.log(claims?.__raw)
            })();
        }
        
        
    })
    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        if (itemName !== "" && itemType !== "" && itemPrice > 0 && itemSizes.length > 0) {
            const newItem: NewItem = {
                name: itemName,
                type: itemType,
                description: itemDescription,
                price: itemPrice,
                numOfOtherImage: 3,
                sizes: itemSizes
            }
            addNewItem(newItem).then(result => {
                console.log("added item: ")
                console.log(result)
            })
            resetForm();
        }
        if (itemName === "") SetItemNameMessage(true);
        if (itemType === "") SetItemTypeMessage(true);
        if (itemPrice <= 0) SetItemPriceMessage(true);
        if (itemSizes.length === 0 && itemType !== 'ring') SetItemQuantityMessage(true);
        if (itemSizes.length === 0 && itemType === 'ring') SetItemSizeMessage(true);
    }
    const resetForm = () => {
        SetItemName("")
        SetItemType("")
        SetItemDescription("")
        SetItemPrice(0)
        SetItemSizes([])
        SetSizeWithQuantityArray("");
    }

    const handleChangeQuantityForItemsWithNoSizes = (quant: number) => {
        if (quant > 0) {
            SetItemSizes([{
                size: 'all',
                quantity: quant
            }])
        }
    }
    const handleAddSizeQuantity = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        e.preventDefault();
        let tempSizeWithQuantityArray = sizeWithQuantityArray.split(":");
        let currentSize: string = tempSizeWithQuantityArray[0];
        let currentQuantity: number = Number.parseInt(tempSizeWithQuantityArray[1])
        if (!isNaN(currentQuantity) && tempSizeWithQuantityArray.length === 2) {
            let currentItemSizes = itemSizes;
            let sizeExist = false
            for(let i = 0; i<currentItemSizes.length; i++) {
                if(currentItemSizes[i].size === currentSize) { 
                    currentItemSizes[i].quantity += currentQuantity;
                    SetItemSizes(currentItemSizes);
                    sizeExist = true;
                    break;
                }
                
            }
            if (!sizeExist) SetItemSizes(currentArray => [...currentArray, { size: currentSize, quantity: currentQuantity }])
        } else {
            alert(`Failed to add size, please add size with quantity in this format size:quantity`)
        }
        SetSizeWithQuantityArray('');
        SetItemSizeMessage(false);
    }
    const handleChangeItemType = (type: string) => {
        if (type === 'ring') SetItemSizes([])
        SetItemType(type);
    }
    return <div>
        <div>
            {isAuthenticated && (<button className="login-out-btn" onClick={() => logout()}>logout</button>)}
            {!isAuthenticated && (<button className="login-out-btn" onClick={() => loginWithRedirect()}>Login</button>)}
        </div>
        <br></br>
        {isLoading && (<div>Loading...</div>)}
        {!isLoading && isAuthenticated && (
            <form onSubmit={e => handleSubmit(e)}>
                Item Name: <input type="text" name="itemName" placeholder="Item Name" value={itemName} onChange={(e) => { SetItemName(e.target.value); SetItemNameMessage(false) }} />
                <p className="formMessages" style={{ opacity: ItemNameMessage ? "1" : "0" }}>Required</p>
                Item Type: <select name="type" onChange={(e) => { handleChangeItemType(e.target.value); SetItemTypeMessage(false) }} value={itemType}>
                    <option value="" selected disabled hidden>Item Type</option>
                    <option value='earing'>earing</option>
                    <option value='pendant'>pendant</option>
                    <option value='ring'>ring</option>
                </select>
                <p className="formMessages" style={{ opacity: ItemTypeMessage ? "1" : "0" }}>Required</p>
                Description: <textarea value={itemDescription} name="description" placeholder="Item Description" maxLength={250} onChange={(e) => SetItemDescription(e.target.value)} />
                <p style={{ opacity: 0 }}>Required</p>
                Price: <input value={itemPrice} type="number" name="price" min="1" onChange={(e) => { SetItemPrice(Number.parseFloat(e.target.value)); SetItemPriceMessage(false) }} />
                <p className="formMessages" style={{ opacity: ItemPriceMessage ? "1" : "0" }}>Price Must be greater than zero</p>
                {itemType !== 'ring' ?
                    [<label>Quantity</label>,
                    <input type="number" name="quantity" min="1" onChange={(e) => { handleChangeQuantityForItemsWithNoSizes(Number.parseInt(e.target.value)); SetItemQuantityMessage(false) }
                    } />,
                    <p className="formMessages" style={{ opacity: ItemQuantityMessage ? "1" : "0" }}>Quantity Must be greater than zero</p>]
                    : null}
                {itemType === 'ring' ?


                    [<label>Size:Quantity</label>,
                    <input type="text" value={sizeWithQuantityArray} placeholder="size:quantity. ex 7:3 means size 7 has 3 pieces" onChange={(e) => { SetSizeWithQuantityArray(e.target.value); SetItemSizeMessage(false) }} />,
                    <button onClick={e => handleAddSizeQuantity(e)}>Add Size</button>,
                    <p className="formMessages" style={{ opacity: ItemSizeMessage ? "1" : "0" }}>Size and quantity must be added for this type</p>,
                    <table>
                        <tr>
                            <th>Size</th>
                            <th>Quantity</th>
                        </tr>
                        {itemSizes.map((sizeQantity) => 
                            <tr>
                                <td>{sizeQantity.size}</td>
                                <td>{sizeQantity.quantity}</td>
                            </tr>
                        )}
                    </table>

                        ]



                    : null}
                <button type="submit">Add Item</button>
            </form>
        )}
    </div>
}

export default Admin;