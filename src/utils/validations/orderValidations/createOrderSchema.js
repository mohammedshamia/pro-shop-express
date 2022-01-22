import * as yup from "yup";

export const addProductReviewSchema = yup.object().shape({
  rating: yup.number().min(0).max(5).required("Rating is required"),
  comment: yup.string().required("Comment is required"),
});
