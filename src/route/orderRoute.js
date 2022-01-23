import express from "express";
import {
  createOrder,
  getOrderByID,
  getUserOrders,
  getOrders,
  updateOrderToDelivered,
  paymentWebhook,
} from "../controllers/orderController.js";
import { protect, protectAdminRoute } from "../middleware/authMiddleware.js";

const router = express.Router();

router
  .route("/")
  .post(protect, createOrder)
  .get(protect, protectAdminRoute, getOrders);

router.route("/myorders").get(protect, getUserOrders);

router.route("/payment-webhook").post(paymentWebhook);

router.route("/:id").get(protect, getOrderByID);

router
  .route("/:id/deliver")
  .put(protect, protectAdminRoute, updateOrderToDelivered);

export default router;
