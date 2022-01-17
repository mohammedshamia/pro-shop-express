import express from "express";
import {
  authUser,
  getUserProfile,
  registerUser,
  updateUserProfile,
  getAllUsers,
  deleteUser,
  updateUser,
  getUserById,
  addCartItem,
  deleteCartItem,
} from "../controllers/userController.js";
import { protect, protectAdminRoute } from "../middleware/authMiddleware.js";

const router = express.Router();

router.route("/").get(protect, protectAdminRoute, getAllUsers);

router.route("/signup").post(registerUser);

router.route("/login").post(authUser);

router
  .route("/profile")
  .get(protect, getUserProfile)
  .put(protect, updateUserProfile);

router
  .route("/profile/cart")
  .put(protect, addCartItem)
  .delete(protect, deleteCartItem);

router
  .route("/:id")
  .get(protect, protectAdminRoute, getUserById)
  .delete(protect, protectAdminRoute, deleteUser)
  .put(protect, protectAdminRoute, updateUser);

export default router;
