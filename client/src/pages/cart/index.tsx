import React from "react";
import { Table, Button } from "react-bootstrap"
import "./index.css";


const Cart = () => {
    return <div className="container cart-cont">
        <div className="cart-header mb-5">My Shopping Cart</div>
        <div className="cart-body mb-5">
            <Table responsive className="cart-table p-5">
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
                    <tr>
                        <td className="cart-table-first">
                        <img className="cart-image" loading="lazy"
                  decoding="async" src={"images/items/item" + 1 + "/main.jpg"} alt="ok" />
                  <p className="cart-table-items">Item1</p>
                        </td>
                        <td className="cart-table-other"><p className="cart-table-items">Mark</p></td>
                        <td className="cart-table-other">
                            <p className="cart-table-items">
                                <div className="increase-quan">+</div>
                                2
                                <div className='decrease-quan'>-</div>
                            </p>
                            </td>
                        <td className="cart-table-other"><p className="cart-table-items">@mdo</p></td>
                        <td className="cart-table-other"><p className="cart-table-items">$39.99</p></td>
                    </tr>
                </tbody>
            </Table>
        </div>
    </div>
}

export default Cart;