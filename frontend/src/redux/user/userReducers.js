import {
  USER_LOGIN_FAIL,
  USER_LOGIN_REQUEST,
  USER_LOGIN_SUCCESS,
  USER_LOGOUT,
  USER_REGISTER_REQUEST,
  USER_REGISTER_FAIL,
  USER_REGISTER_SUCCESS,
} from "./userConstants";

export const userAuthReducer = (initialState = {}, action) => {
  switch (action.type) {
    case USER_LOGIN_REQUEST:
      return {
        isLoading: true,
      };
    case USER_LOGIN_SUCCESS:
      return {
        isLoading: false,
        userInfo: action.payload,
      };
    case USER_LOGOUT:
      return {};
    case USER_LOGIN_FAIL:
      return {
        ...initialState,
        isLoading: false,
        error: action.payload,
      };
    case USER_REGISTER_REQUEST:
      return {
        isLoading: true,
      };
    case USER_REGISTER_SUCCESS:
      return {
        isLoading: false,
        userInfo: action.payload,
      };
    case USER_REGISTER_FAIL:
      return {
        ...initialState,
        isLoading: false,
        error: action.payload,
      };
    default:
      return initialState;
  }
};
