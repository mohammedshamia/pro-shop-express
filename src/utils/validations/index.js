import { registerSchema } from "./userValidations/registerSchema.js";
import { updateProfileSchema } from "./userValidations/updateProfileSchema.js";
import { addCartItemSchema } from "./userValidations/addCartItemSchema.js";
import { loginSchema } from "./userValidations/loginSchema.js";
import { addProductSchema } from "./productValidations/addProductSchema.js";
import { addProductReviewSchema } from "./productValidations/addProductReviewSchema.js";
import { createOrderSchema } from "./orderValidations/createOrderSchema.js";
import { validator } from "./validator.js";

export {
  registerSchema,
  validator,
  loginSchema,
  updateProfileSchema,
  addProductSchema,
  addProductReviewSchema,
  addCartItemSchema,
  createOrderSchema,
};
