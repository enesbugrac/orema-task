import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  getClientSecret,
  onSuccessBuy,
  removeCartItem,
} from "../../redux/user/user.actions";
import { CartProduct } from "../../components/CartPage/CartProduct";
import "./CartPage.css";
import {
  CardElement,
  PaymentElement,
  useElements,
  useStripe,
} from "@stripe/react-stripe-js";
import { Result, Empty, Button } from "antd";
import { getCartItems, getUserCart } from "../../redux/user/user.actions";

export function CartPage(props) {
  const dispatch = useDispatch();
  const [Total, setTotal] = useState(0);
  const [error, setError] = useState(null);
  const [disabled, setDisabled] = useState(true);
  const [processing, setProcessing] = useState("");
  const [succeded, setSucceded] = useState(false);
  const [clientSecret, setClientSecret] = useState(true);
  const [cartItems, setCartItems] = useState(
    useSelector((state) => {
      return state.user.cartDetail;
    })
  );
  const stripe = useStripe();
  const elements = useElements();

  const [cart, setCart] = useState(
    useSelector((state) => {
      return state.user.cart;
    })
  );
  useEffect(() => {
    console.log(cart);
    dispatch(getUserCart()).then((response) => {
      if (response.payload) {
        setCart(response.payload);

        let query = "";
        response.payload.map((cartItem) => {
          query += "productId=" + cartItem.product_id + "&";
        });
        dispatch(getCartItems(query, response.payload)).then((response) => {
          setCartItems(response.payload);
          let total = calculateTotal(response.payload);
          if (total > 0) {
            dispatch(getClientSecret(total)).then((response) => {
              setClientSecret(response.payload.clientSecret);
            });
          }
        });
      }
    });
  }, [dispatch]);

  const calculateTotal = (cartDetail) => {
    let total = 0;
    console.log(cartDetail);
    cartDetail.map((item) => {
      total += item.price * item.quantity;
    });

    setTotal(total);
    return total;
  };

  const removeFromCart = (productId) => {
    dispatch(removeCartItem(productId)).then((response) => {
      console.log(response);
      dispatch(getUserCart()).then((cartResponse) => {
        let query = "";
        cartResponse.payload.map((cartItem) => {
          query += "productId=" + cartItem.product_id + "&";
        });
        console.log(cartResponse.payload);
        setCart(cartResponse.payload);
        dispatch(getCartItems(query, cartResponse.payload)).then(
          (cartResponse) => {
            console.log(response.payload);
            setCart(cartResponse.payload);
            calculateTotal(cartResponse.payload);
          }
        );
      });
    });
  };
  const handleChange = (event) => {
    setDisabled(event.empty);
    setError(event.error ? event.error.message : "");
  };
  const handleSubmit = async (event) => {
    //STRİPE SECTİON
    event.preventDefault();
    setProcessing(true);

    const payload = await stripe
      .confirmCardPayment(clientSecret, {
        payment_method: {
          card: elements.getElement(CardElement),
        },
      })
      .then(({ paymentIntent }) => {
        console.log(props.user.cartDetail);
        dispatch(
          onSuccessBuy({
            history: props.user.cartDetail,
            payment_id: paymentIntent.id,
          })
        ).then((response) => {
          console.log(response);
          if (response.payload) {
            setTotal(0);
            setSucceded(true);
            setError(null);
            setProcessing(false);
            props.history.push("/history");
          }
        });
      });
  };

  return (
    <div style={{ width: "85%", margin: "3rem auto" }}>
      <h1>My Cart</h1>
      <div>
        <CartProduct
          products={props.user.cartDetail}
          removeItem={removeFromCart}
        />

        {cart.length > 0 && Total > 0 ? (
          <div style={{ marginTop: "3rem" }}>
            <h2>Total amount: ${Total} </h2>
          </div>
        ) : (
          <div
            style={{
              width: "100%",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
            }}
          >
            <br />
            <Empty description={false} />
            <p>No Items In the Cart</p>
          </div>
        )}
      </div>
      {cart.length > 0 && Total > 0 && (
        <div className="payment__details">
          <form onSubmit={handleSubmit}>
            <CardElement onChange={handleChange} />
            <div className="payment__priceContainer">
              <button disabled={processing || disabled || succeded}>
                <span>{processing ? <p>Processsing</p> : "Buy Now"}</span>
              </button>
            </div>
            {error && <div>{error}</div>}
          </form>
        </div>
      )}
    </div>
  );
}
