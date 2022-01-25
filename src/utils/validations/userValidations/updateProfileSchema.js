import * as yup from "yup";

export const updateProfileSchema = yup.object({
  firstName: yup
    .string()
    .required("First name is required")
    .matches(
      /^[A-Za-z ]+$/,
      "Should field with the alphabet with spaces format"
    ),
  lastName: yup
    .string()
    .required("Last name is required")
    .matches(
      /^[A-Za-z ]+$/,
      "Should field with the alphabet with spaces format"
    ),
  email: yup.string().email("Email is not valid").required("Email is required"),
  password: yup
    .string()
    .matches(
      /^(?=.*[A-Z])(?=.*\d)[a-zA-Z0-9!@#$%./^&*()_+<>,~`"':;]{8,}$/,
      `Password should be 8 digits length at least, contains at least one Capital letter, contains at least one number.)`
    ),
  profileImage: yup.string(),
  isAdmin: yup.bool(),
  dateOfBirth: yup.date().defined("Date of birth is required"),
});
