import React, { useState, useEffect } from "react";
import { Table } from "react-bootstrap"
import { CartItem } from "../../types";
import "./index.css";


const Cart = () => {
    const [cartItems, setCartItems] = useState<CartItem[]>([]);

    useEffect(() => {
        // get items in cart after loading the page
        if (localStorage.getItem("samaria-cart")) setCartItems(JSON.parse(localStorage.getItem("samaria-cart")!));

    }, []);

    return <div className="container cart-cont">
        <div className="cart-header mb-5">My Shopping Cart</div>
        <div className="cart-body mb-5">
            {cartItems.length === 0 ? <p className="empty-cart">Cart is Empty</p> :
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
                        {cartItems.map((item, index) => {
                            return (<tr key={index}>
                                <td className="cart-table-first">
                                    <img className="cart-image" loading="lazy"
                                        decoding="async" src={"images/items/" + (item.name).replace(/ /g, "_") + "/main.jpg"} alt={item.name} />
                                    <p className="cart-table-items">{item.name}</p>
                                </td>
                                <td className="cart-table-other"><p className="cart-table-items">{item.size}</p></td>
                                <td className="cart-table-other">
                                    <p className="cart-table-items">

                                        <i className="fas fa-plus-square increase-quan"></i>
                                        {item.quantity}
                                        <i className="fas fa-minus-square decrease-quan"></i>
                                    </p>
                                </td>
                                <td className="cart-table-other"><p className="cart-table-items"><i className="far fa-trash-alt cart-table-delete-item"></i></p></td>
                                <td className="cart-table-other"><p className="cart-table-items">${(item.price) * (item.quantity)}</p></td>
                            </tr>)

                        }
                        )}
                    </tbody>
                </Table>)
            }
        </div>

    </div>
}

export default Cart;