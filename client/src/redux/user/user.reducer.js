import {
  LOGIN_USER,
  REGISTER_USER,
  LOGOUT_USER,
  AUTH_USER,
  ADD_TO_CART,
  GET_CART_ITEMS_USER,
  REMOVE_CART_ITEM_USER,
  GET_CART_USER,
  ON_SUCCESS_BUY_USER,
  GET_HISTORY,
} from "./user.types";
const INITIAL_STATE = {
  accessToken: window.localStorage.getItem("accessToken") || "",
  refreshToken: window.localStorage.getItem("refreshToken") || "",
  cart: [],
  cartDetail: [],
};
const userReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case REGISTER_USER:
      return { ...state, register: action.payload };
    case LOGIN_USER:
      return {
        ...state,
        accessToken: action.payload.accessToken,
        refreshToken: action.payload.refreshToken,
      };
    case AUTH_USER:
      return { ...state };
    case LOGOUT_USER:
      return { ...state, accessToken: "", refreshToken: "" };
    case ADD_TO_CART:
      return {
        ...state,
      };
    case GET_HISTORY:
      return {
        ...state,
      };
    case GET_CART_USER:
      return {
        ...state,
        cart: action.payload,
      };
    case GET_CART_ITEMS_USER:
      return {
        ...state,
        cartDetail: action.payload,
      };
    case REMOVE_CART_ITEM_USER:
      return {
        ...state,
      };
    case ON_SUCCESS_BUY_USER:
      return {
        ...state,
        cart: action.payload.cart,
        cartDetail: action.payload.cart,
      };
    default:
      return state;
  }
};
export default userReducer;
