import express from "express";
import products from "./data/products.js";
import morgan from "morgan";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import colors from "colors";

const app = express();
dotenv.config({ path: "backend/.env" });
connectDB();

if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

app.get("/get/api/products", (req, res) => {
  res.json(products);
});

app.get("/get/api/products/:id", (req, res) => {
  const product = products.find((p) => p._id === req.params.id);
  res.json(product);
});

const port = process.env.PORT || 5000;

app.listen(
  port,
  console.log(`server running on port ${port}`.yellow.underline)
);
