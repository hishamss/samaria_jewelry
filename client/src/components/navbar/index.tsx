import React from "react";
import { Navbar, Nav } from "react-bootstrap";
import { NavLink } from "react-router-dom";
import "./index.css";

const NavBar = () => {
    return <Navbar className="ms-2 me-2 mb-5">

        <Nav>
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
        <Nav id="logo">
            <Nav.Link >
                <img width="200" height="70" src="images/output-onlinepngtools-cropped.png" alt="logo"></img>
            </Nav.Link>
        </Nav>

        <Nav id="cart">
            <Nav.Link>
                <span><NavLink exact to="/cart"><i className="fas fa-shopping-cart"></i></NavLink></span>

            </Nav.Link>
        </Nav>
    </Navbar>
}

export default NavBar;