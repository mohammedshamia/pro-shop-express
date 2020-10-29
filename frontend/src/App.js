import React from "react";
import Header from "./components/Header";
import Footer from "./components/Footer";
import { Container } from "react-bootstrap";
import HomePage from "./screens/HomeePage";
import { Route } from "react-router";
import ProductPage from "./screens/ProductPage";
import CartPage from "./screens/CartPage";
import LoginScreen from "./screens/LoginPage";
import RegisterPage from "./screens/RegisterPage";
import ProfilePage from "./screens/ProfilePage";
import ShippingPage from "./screens/ShippingPage";
import PaymentPage from "./screens/PaymentPage";
import PlaceOrderPage from "./screens/PlaceOrder";
import OrderPage from "./screens/OrderPage";

function App() {
  return (
    <>
      <Header />
      <main className="py-3">
        <Container>
          <Route exact path="/" component={HomePage} />
          <Route path="/product/:id" component={ProductPage} />
          <Route path="/cart/:id?" component={CartPage} />
          <Route path="/login" component={LoginScreen} />
          <Route path="/register" component={RegisterPage} />
          <Route path="/profile" component={ProfilePage} />
          <Route path="/shipping" component={ShippingPage} />
          <Route path="/payment" component={PaymentPage} />
          <Route path="/placeorder" component={PlaceOrderPage} />
          <Route path="/order/:id" component={OrderPage} />
        </Container>
      </main>

      <Footer />
    </>
  );
}

export default App;
