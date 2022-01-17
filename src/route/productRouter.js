import express from "express";
import {
  getAllProducts,
  getProductByID,
  deleteProductById,
  createProduct,
  updateProduct,
  addNewProductReview,
  getTopRatedProducts,
  getAllProductsByCategory,
  getAllCategories,
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

router.route("/top").get(getTopRatedProducts);

// @desc Fetch all categories
// @route Get /api/products/category/all
// @access Public
router.route("/category/all").get(getAllCategories);

// @desc Fetch a category products
// @route Get /api/products/category/:category
// @access Public
router.route("/category/:category").get(getAllProductsByCategory);

// @desc Fetch a single product
// @route Get /api/products/:id
// @access Public
router
  .route("/:id")
  .get(getProductByID)
  .delete(protect, protectAdminRoute, deleteProductById)
  .put(protect, protectAdminRoute, updateProduct);

router.route("/:id/reviews").post(protect, addNewProductReview);

export default router;
