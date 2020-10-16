import React from "react";
import Header from "./components/Header";
import Footer from "./components/Footer";
import { Container } from "react-bootstrap";
import HomePage from "./screens/HomeePage";
import { Route } from "react-router";

function App() {
  return (
    <>
      <Header>header</Header>
      <main className="py-3">
        <Container>
          <Route exact path="/" component={HomePage} />
        </Container>
      </main>

      <Footer />
    </>
  );
}

export default App;
