import express from "express";
import {
  getAllProducts,
  getProductByID,
  deleteProductById,
  createProduct,
  updateProduct,
} from "../controllers/productController.js";
import { protect, protectAdminRoute } from "../middleware/authMiddleware.js";

const router = express.Router();

// @desc Fetch all products
// @route Get /api/products
// @access Public
router
  .route("/")
  .get(getAllProducts)
  .post(protect, protectAdminRoute, createProduct);

// @desc Fetch a single product
// @route Get /api/products/:id
// @access Public
router
  .route("/:id")
  .get(getProductByID)
  .delete(protect, protectAdminRoute, deleteProductById)
  .put(protect, protectAdminRoute, updateProduct);

export default router;
