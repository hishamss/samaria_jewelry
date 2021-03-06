import React from 'react';
import Header from "./components/header";
import Footer from "./components/footer";
import NavBar from "./components/navbar";
import About from "./pages/about";
import Shop from "./pages/shop";
import Cert from "./pages/certificate";
import Cart from "./pages/cart";
import Contact from "./pages/contactUs"
import Admin from "./pages/admin"
import { Switch, Route } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";

import './App.css';

function App() {
  const {isAuthenticated} = useAuth0();
  return (

      <div className="App">
        <Header />
        <NavBar />
        <div className="content">

          <Switch>
            <Route key="about" path="/contact" exact component={Contact} />
            <Route key="about" path="/about" exact component={About} />
            <Route key="shop" path="/shop" exact component={Shop} />
            <Route key="certificate" path="/certificate" exact component={Cert} />
            <Route key="cart" path="/cart" exact component={Cart} />
            <Route key="admin" path="/admin" exact component={Admin} />
            {isAuthenticated && <Route key="default" path="/*" component={Admin} /> }
            {!isAuthenticated && <Route key="default" path="/*" component={Shop} />}
          </Switch>
        </div>
        <Footer />
      </div>
  );
}

export default App;
