import React from "react";
import Header from "./components/Header";
import Footer from "./components/Footer";
import { Container } from "react-bootstrap";

function App() {
  return (
    <>
      <Header>header</Header>
      <main className="py-3">
        <Container></Container>
      </main>

      <Footer></Footer>
    </>
  );
}

export default App;
