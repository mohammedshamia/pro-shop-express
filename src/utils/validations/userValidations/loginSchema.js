import * as yup from "yup";

export const loginSchema = yup.object({
  email: yup.string().email("Email is not valid").required("Email is required"),
  password: yup
    .string()
    .required("Password is required")
    .matches(
      /^(?=.*[A-Z])(?=.*\d)[a-zA-Z0-9!@#$%./^&*()_+<>,~`"':;]{8,}$/,
      `Password should be 8 digits length at least, contains at least one Capital letter, contains at least one number.)`
    ),
});
