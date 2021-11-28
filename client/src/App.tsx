import React from 'react';
import Header from "./components/header";
import Footer from "./components/footer";
import NavBar from "./components/navbar";
import About from "./pages/about";
import Shop from "./pages/shop";
import Cert from "./pages/certificate";
import Cart from "./pages/cart";
import Contact from "./pages/contactUs"
import { Switch, Route } from "react-router-dom";
// import { CartProvider} from "react-use-cart";
import './App.css';

function App() {
  return (
    // <CartProvider>
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
            <Route key="cart" path="/*" component={Shop} />
          </Switch>
        </div>
        <Footer />
      </div>
      // </CartProvider>
  );
}

export default App;
