import axios from "axios";
import {
  LOGIN_USER,
  REGISTER_USER,
  AUTH_USER,
  LOGOUT_USER,
  ON_SUCCESS_BUY_USER,
  ADD_TO_CART,
  GET_CART_ITEMS_USER,
  GET_CART_USER,
  REMOVE_CART_ITEM_USER,
  GET_CLIENT_SECRET,
  GET_HISTORY,
} from "./user.types";
const USER_SERVER = "http://localhost:5000";

export async function registerUser(dataToSubmit) {
  const request = await axios
    .post(`${USER_SERVER}/api/users`, dataToSubmit)
    .then((response) => response)
    .catch((err) => err);

  return {
    type: REGISTER_USER,
    payload: request,
  };
}

export async function loginUser(dataToSubmit) {
  const request = await axios
    .post(`${USER_SERVER}/api/sessions`, dataToSubmit)
    .then((response) => {
      return response.data;
    });
  console.log(request);
  return {
    type: LOGIN_USER,
    payload: request,
  };
}

export async function auth() {
  const refreshToken = window.localStorage.getItem("refreshToken");
  const accessToken = window.localStorage.getItem("accessToken");
  console(accessToken);

  const request = await axios
    .get(`${USER_SERVER}/api/sessions`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "x-refresh": refreshToken,
      },
    })
    .then((response) => response)
    .catch((err) => err);
  console.log(request);
  return {
    type: AUTH_USER,
    payload: request,
  };
}

export function logoutUser() {
  const refreshToken = window.localStorage.getItem("refreshToken");
  const accessToken = window.localStorage.getItem("accessToken");
  const request = axios
    .delete(`${USER_SERVER}/api/sessions`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "x-refresh": refreshToken,
      },
    })
    .then((response) => response);
  window.localStorage.setItem("accessToken", "");
  window.localStorage.setItem("refreshToken", "");
  return {
    type: LOGOUT_USER,
    payload: request,
  };
}

export function addToCart(item) {
  const refreshToken = window.localStorage.getItem("refreshToken");
  const accessToken = window.localStorage.getItem("accessToken");
  const request = axios
    .get(`http://localhost:5000/api/users/addtocart?productId=${item._id}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "x-refresh": refreshToken,
      },
    })
    .then((response) => {
      return response;
    });
  return {
    type: ADD_TO_CART,
    payload: request,
  };
}
export async function getUserCart(user) {
  const refreshToken = window.localStorage.getItem("refreshToken");
  const accessToken = window.localStorage.getItem("accessToken");
  const request = await axios
    .get(`http://localhost:5000/api/users/getusercart`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "x-refresh": refreshToken,
      },
    })
    .then((response) => response.data);
  return {
    type: GET_CART_USER,
    payload: request,
  };
}
export async function getClientSecret(total) {
  const refreshToken = window.localStorage.getItem("refreshToken");
  const accessToken = window.localStorage.getItem("accessToken");
  const request = await axios
    .get(`http://localhost:5000/api/users/clientsecret?total=${total}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "x-refresh": refreshToken,
      },
    })
    .then((response) => response.data);
  console.log(request);
  return {
    type: GET_CLIENT_SECRET,
    payload: request,
  };
}
export async function getCartItems(cartItems, userCart) {
  const request = await axios
    .get(`http://localhost:5000/api/products/multiple?${cartItems}`)
    .then((response) => {
      userCart.map((cartItem) => {
        response.data.map((productDetail, i) => {
          if (cartItem.product_id === productDetail._id) {
            response.data[i].quantity = cartItem.quantity;
          }
        });
      });
      return response.data;
    });

  return {
    type: GET_CART_ITEMS_USER,
    payload: request,
  };
}
export async function removeCartItem(productId) {
  const refreshToken = window.localStorage.getItem("refreshToken");
  const accessToken = window.localStorage.getItem("accessToken");
  const request = axios
    .get(
      `http://localhost:5000/api/users/removefromcart?product_id=${productId}`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "x-refresh": refreshToken,
        },
      }
    )
    .then((response) => {});

  return {
    type: REMOVE_CART_ITEM_USER,
    payload: request,
  };
}
export async function onSuccessBuy(data) {
  const refreshToken = window.localStorage.getItem("refreshToken");
  const accessToken = window.localStorage.getItem("accessToken");
  const request = await axios
    .post(`http://localhost:5000/api/users/createhistory`, data, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "x-refresh": refreshToken,
      },
    })
    .then((response) => response.data);
  console.log(request);
  return {
    type: ON_SUCCESS_BUY_USER,
    payload: request,
  };
}
export async function getHistory() {
  const refreshToken = window.localStorage.getItem("refreshToken");
  const accessToken = window.localStorage.getItem("accessToken");
  const request = await axios
    .get("http://localhost:5000/api/users/history", {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "x-refresh": refreshToken,
      },
    })
    .then((response) => {
      return response.data;
    });
  console.log(request);
  return {
    type: GET_HISTORY,
    payload: request,
  };
}
