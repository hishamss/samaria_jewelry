import React, { useEffect } from "react";
import { Navbar, Nav, Container } from "react-bootstrap";
import { NavLink } from "react-router-dom";
import { useSelector } from "react-redux";
import { reduxState } from "../../redux/reducers"
import { useDispatch } from "react-redux";
import { UpdateCartCount } from "../../redux/action-creators"
import "./index.css";

const NavBar = () => {
    const cartCount = useSelector((state: reduxState) => state.cartCountReducer);
    const dispatch = useDispatch();
    useEffect(() => {
        // get number of items in cart after refreshing the page
        if (localStorage.getItem("samaria-cart")) dispatch(UpdateCartCount(Object.keys(JSON.parse(localStorage.getItem("samaria-cart")!)).length));

    });
    return <Navbar expand="lg">
        <Container className="ms-2 me-2 mb-5">
            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            <Navbar.Collapse id="basic-navbar-nav">
                <Nav className="me-auto" style={{textAlign:"left"}}>
                    <Nav.Link >
                        <NavLink className="nav_links" to="/certificate" exact activeClassName="selected">
                            Certificate
                        </NavLink>
                    </Nav.Link>
                    <Nav.Link>
                        <NavLink className="nav_links" to="/about" exact activeClassName="selected">
                            About
                        </NavLink>
                    </Nav.Link>
                    <Nav.Link>
                        <NavLink className="nav_links" to="/shop" exact activeClassName="selected">
                            Shop
                        </NavLink>
                    </Nav.Link>
                    <Nav.Link>
                        <NavLink className="nav_links" to="/contact" exact activeClassName="selected">
                            Contact us
                        </NavLink>
                    </Nav.Link>
                </Nav>
            </Navbar.Collapse>
        </Container>
    
    <Nav id="logo">
        <Nav.Link >
            <img width="200" height="70" src="images/output-onlinepngtools-cropped.png" alt="logo"></img>
        </Nav.Link>
    </Nav>

    <Nav id="cart">
        <Nav.Link>
            <span><NavLink exact to="/cart"><i className="fas fa-shopping-cart"></i></NavLink></span>
            <strong>{cartCount}</strong>

        </Nav.Link>
    </Nav>
    </Navbar>
}

export default NavBar;