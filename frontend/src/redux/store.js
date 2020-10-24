import { createStore, combineReducers, applyMiddleware } from "redux";
import thunk from "redux-thunk";
import { composeWithDevTools } from "redux-devtools-extension";
import {
  productListReducers,
  productDetailsReducers,
} from "./product/prooductReducers";
import { cartReducer } from "./cart/cartReducers";
import {
  updateUserProfileReducer,
  userAuthReducer,
  userDetailsReducer,
} from "./user/userReducers";

const reducer = combineReducers({
  productList: productListReducers,
  productDetails: productDetailsReducers,
  cart: cartReducer,
  user: userAuthReducer,
  userDetails: userDetailsReducer,
  userUpdateProfile: updateUserProfileReducer,
});

const cartItemsFromStorage = localStorage.getItem("cartItems")
  ? JSON.parse(localStorage.getItem("cartItems"))
  : [];

const userInfoFromStorage = localStorage.getItem("userInfo")
  ? JSON.parse(localStorage.getItem("userInfo"))
  : null;

const initialStat = {
  cart: {
    cartItems: cartItemsFromStorage,
  },
  user: {
    userInfo: userInfoFromStorage,
  },
};

const middleware = [thunk];

const store = createStore(
  reducer,
  initialStat,
  composeWithDevTools(applyMiddleware(...middleware))
);

export default store;
