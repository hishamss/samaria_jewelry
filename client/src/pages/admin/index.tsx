import React, { useState } from "react";
import "./index.css";
import { useAuth0 } from "@auth0/auth0-react";
import { NewItem, AddedItemSize } from "../../types"
const Admin = () => {
    const [itemName, SetItemName] = useState("");
    const [itemType, SetItemType] = useState("");
    const [itemDescription, SetItemDescription] = useState("");
    const [itemPrice, SetItemPrice] = useState(0);
    const [sizeWithQuantityArray, SetSizeWithQuantityArray] = useState("");
    const [itemsSizes, SetItemSizes] = useState<AddedItemSize[]>([]);
    const { loginWithRedirect, logout, isAuthenticated, isLoading } = useAuth0();
    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        if (itemName !== "" && itemType !== "" && itemPrice !== 0 && itemsSizes.length > 0) {
            const newItem: NewItem = {
                name: itemName,
                type: itemType,
                description: itemDescription,
                price: itemPrice,
                sizes: itemsSizes
            }
            console.log(newItem)
            resetForm();
        }
        
    }
    const resetForm = () => {
        SetItemName("")
        SetItemType("")
        SetItemDescription("")
        SetItemPrice(0)
        SetItemSizes([])
    }

    const handleChangeQuantityForItemsWithNoSizes = (quant:number) => {
        if (quant > 0) {
            SetItemSizes([{
                size: 'all',
                quantity: quant
            }])
        }
    }
    const handleAddSizeQuantity = (e:React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        e.preventDefault();
        let tempSizeWithQuantityArray = sizeWithQuantityArray.split(":");
        let currentSize:string = tempSizeWithQuantityArray[0];
        let currentQuantity:number = Number.parseInt(tempSizeWithQuantityArray[1])
        if(!isNaN(currentQuantity) && tempSizeWithQuantityArray.length === 2) {
            SetItemSizes(currentArray => [...currentArray, {size:currentSize,quantity:currentQuantity}])
            alert(`size ${currentSize} and quantity ${currentQuantity} added Successfully`)
        }else {
            alert(`Failed to add size, please add size with quantity in this format size:quantity`)
        }
        SetSizeWithQuantityArray('');
    }
    const handleChangeItemType = (type:string) => {
        if(type ==='ring') SetItemSizes([])
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
                Item Name: <input type="text" name="itemName" placeholder="Item Name" value={itemName} onChange={(e) => SetItemName(e.target.value)} />

                <br></br>
               Item Type: <select name="type" onChange={(e) => handleChangeItemType(e.target.value)} value={itemType}>
                    <option value="" selected disabled hidden>Item Type</option>
                    <option value='earing'>earing</option>
                    <option value='pendant'>pendant</option>
                    <option value='ring'>ring</option>
                </select>
                <br></br>
                Description: <textarea value={itemDescription} name="description" placeholder="Item Description" maxLength={250} onChange={(e) => SetItemDescription(e.target.value)} />
                <br></br>
                Price: <input value={itemPrice} type="number" name="price" min="1" onChange={(e) => SetItemPrice(Number.parseFloat(e.target.value))} />
                <br></br>
                {itemType !== 'ring' ?
                
                    [<label>Quantity</label>,
                    <input type="number" name="quantity" min="1" onChange={(e) => handleChangeQuantityForItemsWithNoSizes(Number.parseInt(e.target.value))
                    } />,
                    <br></br>]
                    : null}
                {itemType === 'ring' ?
                   

                                [<label>Size:Quantity</label>,
                                <input type="text"  value={sizeWithQuantityArray} placeholder="size:quantity. ex 7:3 means size 7 has 3 pieces" onChange={(e) => SetSizeWithQuantityArray(e.target.value)} />,
                                <button onClick={e => handleAddSizeQuantity(e)}>Add</button>,
                            <br></br>]
                     
               

: null}
                <button type="submit">Add Item</button>
            </form>
        )}
    </div>
}

export default Admin;