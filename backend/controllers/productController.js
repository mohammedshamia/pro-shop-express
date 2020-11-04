import expressAsyncHandler from "express-async-handler";
import Product from "../models/productModel.js";

// @desc Fetch all products
// @route Get /api/products
// @access Public
export const getAllProducts = expressAsyncHandler(async (req, res) => {
  const products = await Product.find({});
  res.json(products);
});

// @desc Fetch a single product
// @route Get /api/products/:id
// @access Public
export const getProductByID = expressAsyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (product) res.json(product);
  else {
    res.status(404);
    throw new Error("Product not found");
  }
});

// @desc Delete a single product
// @route DELETE /api/products/:id
// @access Private/Admin
export const deleteProductById = expressAsyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);

  if (product) {
    await product.remove();

    res.json({
      message: "Product deleted successfully",
    });
  } else {
    res.status(404);
    throw new Error("Product not found");
  }
});

// @desc Create a single product
// @route POST /api/products
// @access Private/Admin
export const createProduct = expressAsyncHandler(async (req, res) => {
  try {
    const product = new Product({
      name: "sample",
      price: 0,
      user: req.user._id,
      image: "/images/sample.jpg",
      brand: "sample brand",
      category: "sample category",
      countInStock: 0,
      numReviews: 0,
      description: "sample",
    });

    const createdProduct = await product.save();

    res.status(201).json(createdProduct);
  } catch (e) {
    console.error(e.toString().red);
    throw new Error(e);
  }
});

// @desc Update a single product
// @route PUT /api/products/:id
// @access Private/Admin
export const updateProduct = expressAsyncHandler(async (req, res) => {
  const {
    name,
    price,
    image,
    brand,
    category,
    countInStock,
    numReviews,
    description,
  } = req.body;

  const product = await Product.findById(req.params.id);

  if (product) {
    product.name = name;
    product.price = price;
    product.image = image;
    product.brand = brand;
    product.category = category;
    product.countInStock = countInStock;
    product.description = description;

    const updatedProduct = await product.save();

    res.json(updatedProduct);
  } else {
    res.status(404);
    throw new Error("Product not found");
  }
});

// @desc Create new product review
// @route POST /api/products/:id
// @access Private
export const addNewProductReview = expressAsyncHandler(async (req, res) => {
  const { rating, comment } = req.body;

  const product = await Product.findById(req.params.id);

  if (product) {
    product.numReviews = ++product.numReviews;

    const updatedProduct = await product.save();

    res.json(updatedProduct);
  } else {
    res.status(404);
    throw new Error("Product not found");
  }
});
