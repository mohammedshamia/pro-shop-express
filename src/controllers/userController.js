import expressAsyncHandler from "express-async-handler";
import User from "../models/userModel.js";
import generateWebToken from "../utils/generateWebToken.js";
import {
  addCartItemSchema,
  loginSchema,
  registerSchema,
  updateProfileSchema,
  validator,
} from "../utils/validations";
import Product from "../models/productModel";
import getUserObject from "../utils/getUserObject";

// @desc Auth user and get token
// @route Get /api/users/login
// @access Public
export const authUser = expressAsyncHandler(async (req, res) => {
  await validator(loginSchema, req.body);
  const { email: loginEmail, password } = req.body;
  const email = loginEmail.toLowerCase();
  const user = await User.findOne({ email });

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
});

// @desc Auth user and get token
// @route Get /api/users/signup
// @access Public
export const registerUser = expressAsyncHandler(async (req, res) => {
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
});

// @desc  Get user profile
// @route Get /api/users/profile
// @access Private
export const getUserProfile = expressAsyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

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
  await validator(updateProfileSchema, req.body);
  const user = await User.findById(req.user._id);
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
});

// @desc  Get all users for admins only
// @route GET /api/users
// @access Private
export const getAllUsers = expressAsyncHandler(async (req, res) => {
  const users = await User.find();
  res.json(users);
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
  await validator(updateProfileSchema, req.body);
  const user = await User.findById(req.params.id);

  if (user) {
    user.firstName = req.body.firstName || user.firstName;
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
});

// @desc  Add cart item
// @route PUT /api/users/profile/cart
// @access Private
export const addCartItem = expressAsyncHandler(async (req, res) => {
  await validator(addCartItemSchema, req.body);

  const user = await User.findById(req.user._id);
  const { qty, productId } = req.body;
  if (user) {
    const product = await Product.find(productId);
    if (product && product.countInStock > qty) {
      const itemTotalPrice = product.discount
        ? (product.price - product.discount) * qty
        : qty * product.price;

      if (user.cart) {
        const cartItems = user.cart.items.filter(
          (i) => i.product._id !== productId
        );
        user.cart = {
          items: [
            {
              product: productId,
              qty: qty,
              itemTotalPrice,
            },
            ...cartItems,
          ],
          totalQty: user.cart.totalQty + qty,
          totalPrice: user.cart.totalPrice + itemTotalPrice,
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
});

// @desc  Delete cart item
// @route DELETE /api/users/profile/cart?productId
// @access Private
export const deleteCartItem = expressAsyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  const { productId } = req.params;
  if (user) {
    const product = await Product.find(productId);
    if (product) {
      if (user.cart) {
        const cartItems = user.cart.items.filter(
          (i) => i.product._id !== productId
        );
        const deletedItem = user.cart.items.find(
          (i) => i.product._id === productId
        );
        user.cart = {
          items: cartItems,
          totalQty: user.cart.totalQty - deletedItem.qty,
          totalPrice: user.cart.totalPrice - deletedItem.itemTotalPrice,
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
