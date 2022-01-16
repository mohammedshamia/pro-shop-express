import { registerSchema } from "./userValidations/registerSchema";
import { updateProfileSchema } from "./userValidations/updateProfileSchema";
import { addCartItemSchema } from "./userValidations/addCartItemSchema";
import { loginSchema } from "./userValidations/loginSchema";
import { addProductSchema } from "./productValidations/addProductSchema";
import { addProductReviewSchema } from "./productValidations/addProductReviewSchema";
import { validator } from "./validator";

export {
  registerSchema,
  validator,
  loginSchema,
  updateProfileSchema,
  addProductSchema,
  addProductReviewSchema,
  addCartItemSchema,
};
