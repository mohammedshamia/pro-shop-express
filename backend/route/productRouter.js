import express from "express";
import {
  getAllProducts,
  getProductByID,
} from "../controllers/productController.js";

const router = express.Router();

// @desc Fetch all products
// @route Get /api/products
// @access Public
router.route("/").get(getAllProducts);

// @desc Fetch a single product
// @route Get /api/products/:id
// @access Public
router.route("/:id").get(getProductByID);

export default router;
