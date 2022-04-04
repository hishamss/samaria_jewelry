import React, { useState } from "react";
import "./index.css";
import { useAuth0 } from "@auth0/auth0-react";
import { NewItem, AddedItemSize } from "../../types"
const Admin = () => {
    const [itemName, SetItemName] = useState("");
    const [itemType, SetItemType] = useState("");
    const [itemDescription, SetItemDescription] = useState("");
    const [itemPrice, SetItemPrice] = useState(0);
    const [numberOfSizes, SetNumberOfSizes] = useState(1);
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
        }
        resetForm();
    }
    const resetForm = () => {
        SetItemName("")
        SetItemType("")
        SetItemDescription("")
        SetItemPrice(0)
        SetItemSizes([])
    }
    const handleChangeForSizes = (sizeVal:string, quan: number, currIndex:number, setField:string) => {
        if (quan > 0 && sizeVal === 'all') {
            SetItemSizes([{
                size: 'all',
                quantity: quan
            }])
        }
        if(setField === 'setSize' && sizeVal !== 'all') {
            let currentsizes = itemsSizes;
            currentsizes[currIndex] = {size:sizeVal, quantity:quan}
            SetItemSizes(currentsizes)
        }
        if(setField === 'setQuantity' && quan > 0) {
            let currentsizes = itemsSizes;
            currentsizes[currIndex].quantity= quan
            SetItemSizes(currentsizes)
        }
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
               Item Type: <select name="type" onChange={(e) => SetItemType(e.target.value)} value={itemType}>
                    <option value="" selected disabled hidden>Item Type</option>
                    <option value='earing'>earing</option>
                    <option value='pendant'>pendant</option>
                    <option value='ring'>ring</option>
                </select>
                <br></br>
                {itemType === 'ring' ? [
                    <label>Number of sizes</label>,
                    <input value={numberOfSizes} type="number" min="1" onChange={(e) => SetNumberOfSizes(Number.parseInt(e.target.value))} />,
                    <br></br>]
                    : null}
                Description: <textarea value={itemDescription} name="description" placeholder="Item Description" maxLength={250} onChange={(e) => SetItemDescription(e.target.value)} />
                <br></br>
                Price: <input value={itemPrice} type="number" name="price" min="1" onChange={(e) => SetItemPrice(Number.parseFloat(e.target.value))} />
                <br></br>
                {itemType !== 'ring' ?
                
                    [<label>Quantity</label>,
                    <input type="number" name="quantity" min="1" onChange={(e) => handleChangeForSizes('all', Number.parseInt(e.target.value),1,'set size & quantity')
                    } />,
                    <br></br>]
                    : null}
                {itemType === 'ring' ?
                    (<table>
                        <tr>
                            <th>Size</th>
                            <th>Quantity</th>
                        </tr>
                        {[...Array(numberOfSizes)].map((num, index) =>

                            <tr key={index}>
                                <td><input type="number" min="1" onChange={(e) => handleChangeForSizes(e.target.value, 0 ,index,'setSize')} /></td>
                                <td><input type="number" min="1" onChange={(e) => handleChangeForSizes('any', Number.parseInt(e.target.value) ,index,'setQuantity')} /></td>
                            </tr>
                        )}


                    </table>) : null}
                <button type="submit">Add Item</button>
            </form>
        )}
    </div>
}

export default Admin;