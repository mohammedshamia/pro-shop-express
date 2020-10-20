import {
  PRODUCT_LIST_FAIL,
  PRODUCT_LIST_REQUEST,
  PRODUCT_LIST_SUCCESS,
  PRODUCT_DETAILS_REQUEST,
  PRODUCT_DETAILS_SUCCESS,
  PRODUCT_DETAILS_FAIL,
} from "./productConstants";

export const productListReducers = (
  initialState = { products: [] },
  action
) => {
  switch (action.type) {
    case PRODUCT_LIST_REQUEST:
      return {
        ...initialState,
        isLoading: true,
        products: [],
      };
    case PRODUCT_LIST_SUCCESS:
      return {
        ...initialState,
        isLoading: false,
        products: action.payload,
      };
    case PRODUCT_LIST_FAIL:
      return {
        ...initialState,
        isLoading: false,
        errorMsg: action.payload,
      };
    default:
      return initialState;
  }
};

export const productDetailsReducers = (
  initialState = { product: { reviews: [] } },
  action
) => {
  switch (action.type) {
    case PRODUCT_DETAILS_REQUEST:
      return {
        ...initialState,
        isLoading: true,
        product: { reviews: [] },
      };
    case PRODUCT_DETAILS_SUCCESS:
      return {
        ...initialState,
        isLoading: false,
        product: action.payload,
      };
    case PRODUCT_DETAILS_FAIL:
      return {
        ...initialState,
        isLoading: false,
        errorMsg: action.payload,
      };
    default:
      return initialState;
  }
};
