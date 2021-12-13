import React, { useState, useEffect } from "react";
import { Table } from "react-bootstrap"
import { CartItem } from "../../types";
import { useDispatch } from "react-redux";
import { UpdateCartCount } from "../../redux/action-creators"
import "./index.css";


const Cart = () => {
    const [cartItems, setCartItems] = useState<CartItem[]>([]);
    let currentSubtotal = 0;
    const dispatch = useDispatch();
    useEffect(() => {
        // get items in cart after loading the page
        if (localStorage.getItem("samaria-cart")) setCartItems(JSON.parse(localStorage.getItem("samaria-cart")!));

    }, []);

    const deleteItem = (item:CartItem)=> {
        let currentCart:CartItem[] = JSON.parse(localStorage.getItem("samaria-cart")!);
        let indexToDelete:number = currentCart.findIndex(currItem => (currItem.id === item.id) && (currItem.size === item.size));
        console.log(indexToDelete)
        currentCart.splice(indexToDelete, 1);
        localStorage.setItem("samaria-cart", JSON.stringify(currentCart));
        setCartItems(currentCart);
        dispatch(UpdateCartCount(currentCart.length));
    }

    const increaseQuantity = (item:CartItem) => {
     let currentCart:CartItem[] = JSON.parse(localStorage.getItem("samaria-cart")!);
     let indexToUpdate:number = currentCart.findIndex(currItem => (currItem.id === item.id) && (currItem.size === item.size));
        console.log(indexToUpdate)
        currentCart[indexToUpdate].quantity +=1;
        localStorage.setItem("samaria-cart", JSON.stringify(currentCart));
        setCartItems(currentCart);

    }
    const decreaseQuantity = (item:CartItem) => {
        // only of quantity greater than 1
        let currentCart:CartItem[] = JSON.parse(localStorage.getItem("samaria-cart")!);
     let indexToUpdate:number = currentCart.findIndex(currItem => (currItem.id === item.id) && (currItem.size === item.size));
        currentCart[indexToUpdate].quantity -=1;
        localStorage.setItem("samaria-cart", JSON.stringify(currentCart));
        setCartItems(currentCart);

    }
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
                        {
                        cartItems.map((item, index) => {
                            currentSubtotal += (item.price) * (item.quantity)
                            return (<tr key={index}>
                                <td className="cart-table-first">
                                    <img className="cart-image" loading="lazy"
                                        decoding="async" src={"images/items/" + (item.name).replace(/ /g, "_") + "/main.jpg"} alt={item.name} />
                                    <p className="cart-table-items">{item.name}</p>
                                </td>
                                <td className="cart-table-other"><p className="cart-table-items">{item.size}</p></td>
                                <td className="cart-table-other">
                                    <p className="cart-table-items">

                                        <i className="fas fa-plus-square increase-quan" onClick={() => increaseQuantity(item)}></i>
                                        {item.quantity}
                                        <i className="fas fa-minus-square decrease-quan" onClick={() => item.quantity > 1? decreaseQuantity(item):null}></i>
                                    </p>
                                </td>
                                <td className="cart-table-other">
                                    <i className="far fa-trash-alt cart-table-delete-item" onClick={() => deleteItem(item)}></i>
                                    </td>
                                <td className="cart-table-other"><p className="cart-table-items">${(item.price) * (item.quantity)}</p></td>
                                
                            </tr>)}
                        )}
                    </tbody>
                </Table>)
            }
        </div>
            <div className="cart-subtotal mb-5">Subtotal: ${currentSubtotal}</div>
    </div>
}

export default Cart;