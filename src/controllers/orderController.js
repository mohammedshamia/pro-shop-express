import expressAsyncHandler from "express-async-handler";
import Order from "../models/orderModel.js";
import Stripe from "stripe";
import User from "../models/userModel.js";
import { createOrderSchema, validator } from "../utils/validations/index.js";
import dotenv from "dotenv";
dotenv.config();

const stripe = Stripe(process.env.STRIPE_SECRET_KEY);

// @desc Create new order
// @route POST /api/orders
// @access Private
export const createOrder = expressAsyncHandler(async (req, res) => {
  try {
    await validator(createOrderSchema, req.body);
    const { address, city, postalCode, country } = req.body;
    const shippingAddress = { address, city, postalCode, country };
    const user = await User.findById(req.user._id).select("-password");
    const cart = user.cart;
    const orderItems = cart.items;

    if (orderItems && !orderItems.length) {
      res.status(400);
      throw new Error("Cart is empty");
    }

    const itemsPrice = user.cart.totalPrice;
    const taxPrice = user.cart.totalPrice * 0.05;
    const totalPrice = itemsPrice + taxPrice;
    const paymentMethod = "stripe";

    const order = new Order({
      user: req.user._id,
      orderItems,
      shippingAddress,
      paymentMethod,
      itemsPrice,
      taxPrice,
      totalPrice,
    });

    const createdOrder = await order.save();

    user.cart = {
      items: [],
      totalQty: [],
      totalPrice: 0,
    };
    await user.save();

    const params = {
      payment_method_types: ["card"],
      amount: (totalPrice * 100).toFixed(0),
      currency: "usd",
      metadata: {
        orderId: `${createdOrder._id}`,
      },
    };

    const paymentIntent = await stripe.paymentIntents.create(params);

    createdOrder.clientSecret = paymentIntent.client_secret;

    await createdOrder.save();

    res.status(201).json({
      clientSecret: paymentIntent.client_secret,
      order: createdOrder,
      message: "Order Created Successfully",
    });
  } catch (e) {
    res.status(400);
    throw new Error(e.message);
  }
});

/*
 * stripe login
 * stripe listen --forward-to localhost:5000/api/orders/payment-webhook
 * stripe trigger payment_intent.succeeded
 * */

// @desc Create new order
// @route POST /api/orders/payment-webhook
// @access Public
export const paymentWebhook = expressAsyncHandler(async (request, response) => {
  const sig = request.headers["stripe-signature"];

  let event;

  try {
    event = stripe.webhooks.constructEvent(
      request.rawBody,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET_KEY
    );
  } catch (err) {
    console.log(`Webhook Error: ${err.message}`);
    response.status(400).send(`Webhook Error: ${err.message}`);
    return;
  }

  let paymentIntent;
  // Handle the event
  switch (event.type) {
    case "payment_intent.created":
      paymentIntent = event.data.object;
      break;
    case "payment_intent.succeeded":
      paymentIntent = event.data.object;
      // Then define and call a function to handle the event payment_intent.succeeded
      const order = await Order.findById(event.data.object.metadata.orderId);

      if (order) {
        order.isPaid = true;
        order.paidAt = Date.now();
        const updatedOrder = await order.save();
      }
      break;
    default:
      console.log(`Unhandled event type ${event.type}`);
  }

  // Return a 200 response to acknowledge receipt of the event
  response.send();
});

// @desc Fetch a single order
// @route Get /api/orders/:id
// @access Private
export const getOrderByID = expressAsyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id)
    .populate("user", "firstName lastName email")
    .populate("orderItems.product")
    .exec();

  if (order) res.json(order);
  else {
    res.status(404);
    throw new Error("Order not found");
  }
});

// @desc Update a single order to delivered
// @route put /api/orders/:id/deliver
// @access Private/Admin
export const updateOrderToDelivered = expressAsyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);

  if (order) {
    order.isDelivered = true;
    order.deliveredAt = Date.now();

    const updatedOrder = await order.save();
    res.json(updatedOrder);
  } else {
    res.status(404);
    throw new Error("Order not found");
  }
});

// @desc Fetch the user orders
// @route get /api/orders/myorders
// @access Private
export const getUserOrders = expressAsyncHandler(async (req, res) => {
  const pageSize = 12;
  const page = Number(req.query.pageNumber) || 1;

  const count = await Order.countDocuments({
    user: req.user._id,
  });
  const orders = await Order.find({
    user: req.user._id,
  })
    .populate("orderItems.product")
    .limit(pageSize)
    .skip(pageSize * (page - 1));

  res.json({ orders, page, pages: Math.ceil(count / pageSize) });
});

// @desc Fetch orders
// @route GET /api/orders
// @access Private/Admin
export const getOrders = expressAsyncHandler(async (req, res) => {
  const pageSize = 12;
  const page = Number(req.query.pageNumber) || 1;

  const count = await Order.countDocuments();
  const orders = await Order.find()
    .populate("user", "firstName lastName email")
    .limit(pageSize)
    .skip(pageSize * (page - 1));

  res.json({ orders, page, pages: Math.ceil(count / pageSize) });
});
