import React, { useEffect, useState } from "react";
import { Row, Col } from "react-bootstrap";
import Product from "../components/Product";
import { useDispatch, useSelector } from "react-redux";
import { getProductsList } from "../redux/product/actions";
import { productsListSelector } from "../redux/product/productSelectors";
import Loader from "../components/Loader";
import Message from "../components/Message";

const HomePage = () => {
  const dispatch = useDispatch();
  const { products, isLoading, error } = useSelector(productsListSelector);

  useEffect(() => {
    dispatch(getProductsList());
  }, [dispatch]);

  return (
    <>
      <h1>Latest Products</h1>
      <Row>
        {isLoading && <Loader>Loading...</Loader>}
        {error && (
          <Message variant="danger">Something went wrong {error}</Message>
        )}
        {products.map((product) => (
          <Col key={product._id} sm={12} md={6} lg={4} xl={3}>
            <Product product={product} />
          </Col>
        ))}
      </Row>
    </>
  );
};

export default HomePage;
