import express from "express";
import Product from "../models/productModel.js";
import expressAsyncHandler from "express-async-handler";

const router = express.Router();

// @desc Fetch all products
// @route Get /api/products
// @access Public
router.get(
  "/",
  expressAsyncHandler(async (req, res) => {
    const products = await Product.find({});
    res.json(products);
  })
);

// @desc Fetch a single product
// @route Get /api/products/:id
// @access Public
router.get(
  "/:id",
  expressAsyncHandler(async (req, res) => {
    const product = await Product.findById(req.params.id).catch((e) => {
      res.status(404).json({ message: "Product not found" });
    });
    if (product) res.json(product);
  })
);

export default router;
