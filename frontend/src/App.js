import React from "react";
import Header from "./components/Header";
import Footer from "./components/Footer";
import { Container } from "react-bootstrap";
import HomePage from "./screens/HomeePage";
import { Route } from "react-router";
import ProductPage from "./screens/ProductPage";

function App() {
  return (
    <>
      <Header />
      <main className="py-3">
        <Container>
          <Route exact path="/" component={HomePage} />
          <Route exact path="/products/:id" component={ProductPage} />
        </Container>
      </main>

      <Footer />
    </>
  );
}

export default App;
