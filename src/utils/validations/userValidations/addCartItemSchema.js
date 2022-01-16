import { number, object, string } from "yup";

export const addCartItemSchema = object({
  productId: string().required("Product Id required"),
  qty: number().min(0).required("Quantity required"),
});
