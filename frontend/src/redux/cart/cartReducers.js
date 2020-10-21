import { ADD_CART_ITEM, REMOVE_CART_ITEM } from "./cartConstants";

export const cartReducer = (state = { cartItems: [] }, action) => {
  switch (action.type) {
    case ADD_CART_ITEM:
      const item = action.payload;
      const exist = state.cartItems.find(
        (cartItem) => cartItem.product === item.product
      );
      if (exist)
        return {
          ...state,
          cartItems: state.cartItems.map((cartItem) =>
            cartItem.product === item.product ? item : cartItem
          ),
        };

      return {
        ...state,
        cartItems: [...state.cartItems, item],
      };
    case REMOVE_CART_ITEM:
      return {
        ...state,
        cartItems: state.cartItems.filter((i) => i.product !== action.payload),
      };

    default:
      return state;
  }
};
