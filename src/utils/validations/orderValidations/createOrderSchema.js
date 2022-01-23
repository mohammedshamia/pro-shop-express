import * as yup from "yup";

export const createOrderSchema = yup.object().shape({
  address: yup.string().required("Address is required"),
  city: yup.string().required("City is required"),
  postalCode: yup.string().required("PostalCode is required"),
  country: yup.string().required("Country is required"),
});
