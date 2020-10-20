import { createStore, combineReducers, applyMiddleware } from "redux";
import thunk from "redux-thunk";
import { composeWithDevTools } from "redux-devtools-extension";
import {
  productListReducers,
  productDetailsReducers,
} from "./product/prooductReducers";

const reducer = combineReducers({
  productList: productListReducers,
  productDetails: productDetailsReducers,
});
const initialStat = {};
const middleware = [thunk];
const store = createStore(
  reducer,
  initialStat,
  composeWithDevTools(applyMiddleware(...middleware))
);

export default store;
