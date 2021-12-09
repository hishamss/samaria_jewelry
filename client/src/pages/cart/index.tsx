import React, { useState, useEffect } from "react";
import { Table } from "react-bootstrap"
import { CartItem, CartItemSize } from "../../types";
import "./index.css";


const Cart = () => {
    const [cartItems, setCartItems] = useState<CartItem>([]);

    useEffect(() => {
        // get number of items in cart after refreshing the page
        if (localStorage.getItem("samaria-cart")) setCartItems(JSON.parse(localStorage.getItem("samaria-cart")!));

    }, []);

    return <div className="container cart-cont">
        <div className="cart-header mb-5">My Shopping Cart</div>
        <div className="cart-body mb-5">
            {Object.keys(cartItems).length === 0 ? <p className="empty-cart">Cart is Empty</p> :
                (<Table responsive className="cart-table p-5">
                    <thead>
                        <tr>
                            <th>Item</th>
                            <th>Size</th>
                            <th>Quantity</th>
                            <th>Remove</th>
                            <th>Price</th>
                        </tr>
                    </thead>
                    <tbody>
                        {Object.keys(cartItems).map((id: string, index: number) => {
                            let currentItem: CartItemSize = cartItems[+id];
                            console.log(currentItem);
                            return currentItem.hasOwnProperty('all') ? 
                               (<tr key={+id}>
                                    <td className="cart-table-first">
                                        <img className="cart-image" loading="lazy"
                                            decoding="async" src={"images/items/item" + id + "/main.jpg"} alt="ok" />
                                        <p className="cart-table-items">{currentItem['all'].name}</p>
                                    </td>
                                    <td className="cart-table-other"><p className="cart-table-items">All</p></td>
                                    <td className="cart-table-other">
                                        <p className="cart-table-items">

                                            <i className="fas fa-plus-square increase-quan"></i>
                                            {currentItem['all'].quantity}
                                            <i className="fas fa-minus-square decrease-quan"></i>
                                        </p>
                                    </td>
                                    <td className="cart-table-other"><p className="cart-table-items"><i className="far fa-trash-alt cart-table-delete-item"></i></p></td>
                                    <td className="cart-table-other"><p className="cart-table-items">${(currentItem['all'].price) * (currentItem['all'].quantity)}</p></td>
                                </tr>): (<div>more sizes</div>)
                         
                        }
                        )}
                    </tbody>
                </Table>)
            }
        </div>

    </div>
}

export default Cart;