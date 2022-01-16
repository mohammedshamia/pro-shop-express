import expressAsyncHandler from "express-async-handler";
import User from "../models/userModel.js";
import generateWebToken from "../utils/generateWebToken.js";
import {
  loginSchema,
  registerSchema,
  updateProfileSchema,
  validator,
} from "../utils/validations";

// @desc Auth user and get token
// @route Get /api/users/login
// @access Public
export const authUser = expressAsyncHandler(async (req, res) => {
  await validator(loginSchema, req.body);
  const { email: loginEmail, password } = req.body;
  const email = loginEmail.toLowerCase();
  const user = await User.findOne({ email });

  if (user && (await user.matchPassword(password))) {
    res.json({
      _id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      isAdmin: user.isAdmin,
      profileImage: user.profileImage,
      dateOfBirth: user.dateOfBirth,
      token: generateWebToken(user._id),
    });
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
    res.status(201).json({
      _id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      isAdmin: user.isAdmin,
      profileImage: user.profileImage,
      dateOfBirth: user.dateOfBirth,
      token: generateWebToken(user._id),
    });
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
    res.json({
      _id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      isAdmin: user.isAdmin,
    });
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
    res.json({
      _id: updatedUser._id,
      firstName: user.firstName,
      lastName: user.lastName,
      profileImage: user.profileImage,
      dateOfBirth: user.dateOfBirth,
      email: updatedUser.email,
      isAdmin: updatedUser.isAdmin,
      token: generateWebToken(updatedUser._id),
    });
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

    res.json({
      _id: updatedUser._id,
      firstName: user.firstName,
      lastName: user.lastName,
      profileImage: user.profileImage,
      dateOfBirth: user.dateOfBirth,
      email: updatedUser.email,
      isAdmin: updatedUser.isAdmin,
    });
  } else {
    res.status(404);
    throw new Error("User not found");
  }
});
