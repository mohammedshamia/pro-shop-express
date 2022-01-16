import { registerSchema } from "./authValidations/registerSchema";
import { updateProfileSchema } from "./authValidations/updateProfileSchema";
import { loginSchema } from "./authValidations/loginSchema";
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
};
