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

function App() {
  return (
    <>
      <Header />
      <main className="py-3">
        <Container>
          <Route exact path="/" component={HomePage} />
          <Route path="/products/:id" component={ProductPage} />
          <Route path="/cart/:id?" component={CartPage} />
          <Route path="/login" component={LoginScreen} />
          <Route path="/register" component={RegisterPage} />
        </Container>
      </main>

      <Footer />
    </>
  );
}

export default App;
