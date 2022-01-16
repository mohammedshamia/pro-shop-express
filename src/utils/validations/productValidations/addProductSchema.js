import * as yup from "yup";

export const addProductSchema = yup.object().shape({
  countInStock: yup.number().min(0).required("count In Stock is required"),
  discount: yup.number().min(0).required("discount is required"),
  price: yup.number().min(0).required("price is required"),
  description: yup.string().required("Description is required"),
  name: yup.string().required("Name is required"),
  brand: yup.string().required("Brand is required"),
  categories: yup
    .array()
    .of(yup.string())
    .min(1, "Categories should be one at least")
    .max(4, "Categories max is 4")
    .required("Categories is required"),
  images: yup
    .array()
    .of(yup.string())
    .min(1, "Images should be one at least")
    .max(4, "Images max is 4")
    .required("Images is required"),
  colors: yup
    .array()
    .of(yup.string())
    .min(1, "Colors should be one at least")
    .max(4, "Colors max is 4")
    .required("Colors is required"),
});
