import React, { useState, useEffect } from "react";
import { Table, Form } from "react-bootstrap"
import { CartItem, CheckoutFormValues } from "../../types";
import { useDispatch } from "react-redux";
import { UpdateCartCount } from "../../redux/action-creators"
import { Formik, Field } from "formik"
import * as yup from 'yup'
import { Elements, CardElement, useElements, useStripe } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import "./index.css";



const CartChild = () => {
    const stripe = useStripe();
    const elements = useElements();
    const checkoutFromInitialValues: CheckoutFormValues = {
        firstName: '',
        lastName: '',
        email: '',
        address1: '',
        address2: '',
        state: '',
        zip: '',
    }

    const FormikValidationSchema = yup.object({
        firstName: yup.string().required("Required").matches(/^[a-zA-Z]+$/, 'First name must contain letters only'),
        lastName: yup.string().required("Required").matches(/^[a-zA-Z]+$/, 'Last name must contain letters only'),
        email: yup.string().required("Required").email("Invalid email"),
        address1: yup.string().required("Required"),
        state: yup.string().required("Required"),
        zip: yup.string().required("Required").matches(/^[0-9]+$/, "Invalid zip code").min(5, 'Invalid zip code').max(5, 'Invalid zip code')
    })
    const addionalStateValidation = (value: any) => {
        let error;
        if (value === 'state') {
            error = "Required"
        }
        return error;
    }
    const [cartItems, setCartItems] = useState<CartItem[]>([]);
    const [isStripeInvalid, setIsStripeInvalid] = useState(false);
    let currentSubtotal = 0;
    const dispatch = useDispatch();
    useEffect(() => {
        // get items in cart after loading the page
        if (localStorage.getItem("samaria-cart")) setCartItems(JSON.parse(localStorage.getItem("samaria-cart")!));

    }, []);

    const deleteItem = (item: CartItem) => {
        let currentCart: CartItem[] = JSON.parse(localStorage.getItem("samaria-cart")!);
        let indexToDelete: number = currentCart.findIndex(currItem => (currItem.id === item.id) && (currItem.size === item.size));
        currentCart.splice(indexToDelete, 1);
        localStorage.setItem("samaria-cart", JSON.stringify(currentCart));
        setCartItems(currentCart);
        dispatch(UpdateCartCount(currentCart.length));
    }

    const increaseQuantity = (item: CartItem) => {
        let currentCart: CartItem[] = JSON.parse(localStorage.getItem("samaria-cart")!);
        let indexToUpdate: number = currentCart.findIndex(currItem => (currItem.id === item.id) && (currItem.size === item.size));
        currentCart[indexToUpdate].quantity += 1;
        localStorage.setItem("samaria-cart", JSON.stringify(currentCart));
        setCartItems(currentCart);

    }
    const decreaseQuantity = (item: CartItem) => {
        // only of quantity greater than 1
        let currentCart: CartItem[] = JSON.parse(localStorage.getItem("samaria-cart")!);
        let indexToUpdate: number = currentCart.findIndex(currItem => (currItem.id === item.id) && (currItem.size === item.size));
        currentCart[indexToUpdate].quantity -= 1;
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
                                            decoding="async" src={`https://samaria-item-images.s3.us-east-2.amazonaws.com/${(item.name).replace(/ /g, "+")}/main.jpg`} alt={item.name} />
                                        <p className="cart-table-items">{item.name}</p>
                                    </td>
                                    <td className="cart-table-other"><p className="cart-table-items">{item.size}</p></td>
                                    <td className="cart-table-other">
                                        <p className="cart-table-items">

                                            <i className="fas fa-plus-square increase-quan" onClick={() => increaseQuantity(item)}></i>
                                            {item.quantity}
                                            <i className="fas fa-minus-square decrease-quan" onClick={() => item.quantity > 1 ? decreaseQuantity(item) : null}></i>
                                        </p>
                                    </td>
                                    <td className="cart-table-other">
                                        <i className="far fa-trash-alt cart-table-delete-item" onClick={() => deleteItem(item)}></i>
                                    </td>
                                    <td className="cart-table-other"><p className="cart-table-items">${(item.price) * (item.quantity)}</p></td>

                                </tr>)
                            }
                            )}
                    </tbody>
                </Table>)
            }
        </div>
        <div className="cart-subtotal mb-5">Subtotal: ${currentSubtotal}</div>
        <div className="cart-checkout mb-5 d-flex align-items-center flex-column">
            <Formik
                initialValues={checkoutFromInitialValues}
                validationSchema={FormikValidationSchema}
                onSubmit={async (values, { setSubmitting }) => {
                    setIsStripeInvalid(false);
                    setSubmitting(true)
                    
                    if (stripe && elements) {
                        const cardElement = elements.getElement(CardElement);
                        if (!cardElement) return
                        
                        // Use your card Element with other Stripe.js APIs
                        const { error, paymentMethod } = await stripe.createPaymentMethod({
                            type: 'card',
                            card: cardElement,
                        });
                        if (error) {
                            setSubmitting(false);
                            setIsStripeInvalid(true);
                            return 
                        }

                        if(!paymentMethod?.id) {
                            alert("failed to generate payment token, try again")
                            return
                        }

                        if(cartItems.length === 0) {
                            alert("cart is empty")
                            return
                        }
                        
                        let order = {
                            buyerInfo: {
                                firstname: values.firstName,
                                lastname: values.lastName,
                                email: values.email,
                                address1: values.address1,
                                address2: values.address2,
                                state: values.state,
                                zip: values.zip
                            },
                            cartItems: cartItems,
                            claimedAmount: currentSubtotal,
                            stripeToken: paymentMethod?.id
                        } 
                        cardElement?.clear();
                        alert(JSON.stringify(order, null, 2));
                        setSubmitting(false);
                    }
                    
                    
                }}

            >
                {({ errors, touched, isSubmitting, handleSubmit }) => (
                    <Form className="w-50" onSubmit={handleSubmit}>

                        <Form.Group className="mb-3">
                            <Field
                                placeholder="first name"
                                name='firstName'
                                type="input"
                                as={Form.Control}

                            />
                            {touched.firstName && errors.firstName ? <div className="text-start formik_err_msg">{errors.firstName}</div> : null}
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Field
                                placeholder="last name"
                                name='lastName'
                                type="input"
                                as={Form.Control}

                            />
                            {touched.lastName && errors.lastName ? <div className="text-start formik_err_msg">{errors.lastName}</div> : null}
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Field
                                placeholder="email"
                                name='email'
                                type="email"
                                as={Form.Control}

                            />
                            {touched.email && errors.email ? <div className="text-start formik_err_msg">{errors.email}</div> : null}
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Field
                                placeholder="123 Main St"
                                name='address1'
                                type="input"
                                as={Form.Control}

                            />
                            {touched.address1 && errors.address1 ? <div className="text-start formik_err_msg">{errors.address1}</div> : null}
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Field
                                placeholder="unit, apt (optional)"
                                name='address2'
                                type="input"
                                as={Form.Control}

                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Field
                                placeholder="state"
                                name='state'
                                type="input"
                                validate={addionalStateValidation}
                                as={Form.Select}>
                                <option value="state">state</option>
                                <option value="AL">AL</option>
                                <option value="AK">AK</option>
                                <option value="AR">AR</option>
                                <option value="AZ">AZ</option>
                                <option value="CA">CA</option>
                                <option value="CO">CO</option>
                                <option value="CT">CT</option>
                                <option value="DC">DC</option>
                                <option value="DE">DE</option>
                                <option value="FL">FL</option>
                                <option value="GA">GA</option>
                                <option value="HI">HI</option>
                                <option value="IA">IA</option>
                                <option value="ID">ID</option>
                                <option value="IL">IL</option>
                                <option value="IN">IN</option>
                                <option value="KS">KS</option>
                                <option value="KY">KY</option>
                                <option value="LA">LA</option>
                                <option value="MA">MA</option>
                                <option value="MD">MD</option>
                                <option value="ME">ME</option>
                                <option value="MI">MI</option>
                                <option value="MN">MN</option>
                                <option value="MO">MO</option>
                                <option value="MS">MS</option>
                                <option value="MT">MT</option>
                                <option value="NC">NC</option>
                                <option value="NE">NE</option>
                                <option value="NH">NH</option>
                                <option value="NJ">NJ</option>
                                <option value="NM">NM</option>
                                <option value="NV">NV</option>
                                <option value="NY">NY</option>
                                <option value="ND">ND</option>
                                <option value="OH">OH</option>
                                <option value="OK">OK</option>
                                <option value="OR">OR</option>
                                <option value="PA">PA</option>
                                <option value="RI">RI</option>
                                <option value="SC">SC</option>
                                <option value="SD">SD</option>
                                <option value="TN">TN</option>
                                <option value="TX">TX</option>
                                <option value="UT">UT</option>
                                <option value="VT">VT</option>
                                <option value="VA">VA</option>
                                <option value="WA">WA</option>
                                <option value="WI">WI</option>
                                <option value="WV">WV</option>
                                <option value="WY">WY</option>
                            </Field>
                            {touched.state && errors.state ? <div className="text-start formik_err_msg">{errors.state}</div> : null}
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Field
                                placeholder="zip"
                                name='zip'
                                type="input"
                                as={Form.Control}
                            />
                            {touched.zip && errors.zip ? <div className="text-start formik_err_msg">{errors.zip}</div> : null}
                        </Form.Group>
                        <Form.Group>
                            <div className="stripe-card-element">
                                    <CardElement/>
                                </div> 
                                {isStripeInvalid ? <div className="text-start formik_err_msg">Invalid Card Information</div> : null}
                        </Form.Group>

                        <button disabled={isSubmitting || cartItems.length === 0} className="w-50 mt-3" id='go-payment' type='submit'>
                            Continue to payment</button>
                            {isSubmitting ?   <div><img src="images/loading.gif" alt="loading" width={100} height={100}/></div> : null}
                           
                          
                    </Form>
                )}
            </Formik>

        </div>

    </div>
}

const Cart = () => {
    const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUPLIC_KEY!);
    return <Elements stripe={stripePromise}><CartChild/></Elements>
}
export default Cart;