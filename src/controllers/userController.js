import expressAsyncHandler from "express-async-handler";
import User from "../models/userModel.js";
import generateWebToken from "../utils/generateWebToken.js";
import {
  addCartItemSchema,
  loginSchema,
  registerSchema,
  updateProfileSchema,
  validator,
} from "../utils/validations/index.js";
import Product from "../models/productModel.js";
import getUserObject from "../utils/getUserObject.js";

// @desc Auth user and get token
// @route Get /api/users/login
// @access Public
export const authUser = expressAsyncHandler(async (req, res) => {
  try {
    await validator(loginSchema, req.body);
    const { email: loginEmail, password } = req.body;
    const email = loginEmail.toLowerCase();
    const user = await User.findOne({ email })
      .populate({
        path: "cart.items.product",
        model: "Product",
      })
      .exec();

    if (user && (await user.matchPassword(password))) {
      res.json(
        getUserObject(user, {
          token: generateWebToken(user._id),
        })
      );
    } else {
      res.status(401);
      throw new Error("Invalid email or password");
    }
  } catch (e) {
    res.status(400);
    throw new Error(e);
  }
});

// @desc Auth user and get token
// @route Get /api/users/signup
// @access Public
export const registerUser = expressAsyncHandler(async (req, res) => {
  try {
    await validator(registerSchema, req.body);
    const { firstName, lastName, email: loginEmail, password } = req.body;
    const email = loginEmail.toLowerCase();
    const userExists = await User.findOne({ email });

    if (userExists) {
      res.status(400);
      throw new Error("User already exists");
    }

    const user = await User.create({
      firstName,
      lastName,
      email,
      password,
    });

    if (user) {
      res.status(201).json(
        getUserObject(user, {
          token: generateWebToken(user._id),
        })
      );
    } else {
      res.status(400);
      throw new Error("Invalid user data");
    }
  } catch (e) {
    res.status(400);
    throw new Error(e);
  }
});

// @desc  Get user profile
// @route Get /api/users/profile
// @access Private
export const getUserProfile = expressAsyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id)
    .populate({
      path: "cart.items.product",
      model: "Product",
    })
    .exec();

  if (user) {
    res.json(getUserObject(user));
  } else {
    res.status(404);
    throw new Error("User not found");
  }
});

// @desc  Update user profile
// @route Put /api/users/profile
// @access Private
export const updateUserProfile = expressAsyncHandler(async (req, res) => {
  try {
    await validator(updateProfileSchema, req.body);
    const user = await User.findById(req.user._id)
      .populate({
        path: "cart.items.product",
        model: "Product",
      })
      .exec();
    const email = req.body.email.toLowerCase();
    if (user) {
      user.firstName = req.body.firstName || user.firstName;
      user.profileImage = req.body.profileImage || user.profileImage;
      user.lastName = req.body.lastName || user.lastName;
      user.dateOfBirth = req.body.dateOfBirth || user.dateOfBirth;
      user.email = email || user.email;
      req.body.password && (user.password = req.body.password);

      const updatedUser = await user.save();
      res.json(
        getUserObject(updatedUser, {
          token: generateWebToken(updatedUser._id),
        })
      );
    } else {
      res.status(404);
      throw new Error("User not found");
    }
  } catch (e) {
    res.status(400);
    throw new Error(e);
  }
});

// @desc  Get all users for admins only
// @route GET /api/users
// @access Private
export const getAllUsers = expressAsyncHandler(async (req, res) => {
  const pageSize = 12;
  const page = Number(req.query.pageNumber) || 1;

  const count = await User.countDocuments();
  const users = await User.find()
    .populate({
      path: "cart.items.product",
      model: "Product",
    })
    .limit(pageSize)
    .skip(pageSize * (page - 1))
    .exec();

  res.json({ users, page, pages: Math.ceil(count / pageSize) });
});

// @desc  DELETE user for admins only
// @route DELETE /api/users/:id
// @access Private/Admin
export const deleteUser = expressAsyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);

  if (user) {
    await user.remove();
    res.json({
      message: "user removed",
    });
  } else {
    res.status(404);
    throw new Error("User not found");
  }
});

// @desc  Get user by id for admins only
// @route GET /api/users/:id
// @access Private/Admin
export const getUserById = expressAsyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id).select("-password");
  res.json(user);
});

// @desc  Update user profile
// @route Put /api/users/profile
// @access Private/Admin
export const updateUser = expressAsyncHandler(async (req, res) => {
  try {
    await validator(updateProfileSchema, req.body);
    const user = await User.findById(req.params.id)
      .populate({
        path: "cart.items.product",
        model: "Product",
      })
      .exec();

    if (user) {
      user.firstName = req.body.firstName || user.firstName;
      user.lastName = req.body.lastName || user.lastName;
      user.dateOfBirth = req.body.dateOfBirth || user.dateOfBirth;
      user.profileImage = req.body.profileImage || user.profileImage;
      user.email = req.body.email || user.email;
      user.isAdmin = req.body.isAdmin || req.body.isAdmin;
      const updatedUser = await user.save();

      res.json(getUserObject(updatedUser));
    } else {
      res.status(404);
      throw new Error("User not found");
    }
  } catch (e) {
    res.status(400);
    throw new Error(e);
  }
});

// @desc  Add cart item
// @route PUT /api/users/profile/cart
// @access Private
export const addCartItem = expressAsyncHandler(async (req, res) => {
  try {
    await validator(addCartItemSchema, req.body);

    const user = await User.findById(req.user._id)
      .populate({
        path: "cart.items:[product]",
        model: "Product",
      })
      .exec();

    const { qty, productId } = req.body;
    if (user) {
      const product = await Product.findById(productId);
      if (product && product.countInStock > qty) {
        const itemTotalPrice = product.discount
          ? (product.price - product.discount) * qty
          : qty * product.price;

        if (user.cart.items.length) {
          const cartItems = user.cart.items.filter(
            (i) => i.product._id != productId
          );

          const deletedItem = user.cart.items.find(
            (i) => i.product._id == productId
          );
          const newQty = deletedItem ? qty - deletedItem.qty : qty;
          const newPrice = deletedItem
            ? itemTotalPrice - deletedItem.itemTotalPrice
            : itemTotalPrice;
          user.cart = {
            items: [
              {
                product: productId,
                qty: qty,
                itemTotalPrice,
              },
              ...cartItems,
            ],
            totalQty: user.cart.totalQty + newQty,
            totalPrice: user.cart.totalPrice + newPrice,
          };
        } else {
          user.cart = {
            items: [
              {
                product: productId,
                qty: qty,
                itemTotalPrice,
              },
            ],
            totalQty: qty,
            totalPrice: itemTotalPrice,
          };
        }
      } else {
        if (!product) {
          res.status(404);
          throw new Error("Product not found");
        } else {
          res.status(400);
          throw new Error("Quantity greater than count in stock");
        }
      }

      const updatedUser = await user.save();
      res.json(
        getUserObject(updatedUser, {
          token: generateWebToken(updatedUser._id),
        })
      );
    } else {
      res.status(404);
      throw new Error("User not found");
    }
  } catch (e) {
    res.status(400);
    throw new Error(e);
  }
});

// @desc  Delete cart item
// @route DELETE /api/users/profile/cart?productId
// @access Private
export const deleteCartItem = expressAsyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id)
    .populate({
      path: "cart.items.product",
      model: "Product",
    })
    .exec();
  const { productId } = req.query;
  if (user) {
    const product = await Product.findById(productId);

    if (product) {
      if (user.cart.items.length) {
        const cartItems = user.cart.items.filter(
          (i) => i.product._id != productId
        );
        const deletedItem = user.cart.items.find(
          (i) => i.product._id == productId
        );

        user.cart = {
          items: cartItems,
          totalQty: user.cart.totalQty - deletedItem.qty,
          totalPrice: (
            user.cart.totalPrice - deletedItem.itemTotalPrice
          ).toFixed(0),
        };
      }
    } else {
      res.status(404);
      throw new Error("Product not found");
    }

    const updatedUser = await user.save();

    res.json(getUserObject(updatedUser));
  } else {
    res.status(404);
    throw new Error("User not found");
  }
});
