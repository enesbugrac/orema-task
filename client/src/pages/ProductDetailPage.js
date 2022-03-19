import React, { useEffect, useState } from "react";
import Axios from "axios";
import { Row, Col } from "antd";
import ProductImage from "../components/ProductDetailPage/ProductImage";
import ProductInfo from "../components/ProductDetailPage/ProductInfo";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { addToCart, getUserCart } from "../redux/user/user.actions";
export function ProductDetailPage(props) {
  const dispatch = useDispatch();
  const [Product, setProduct] = useState(
    useSelector((state) => {
      return state.shop.currentItem;
    })
  );
  const [buttonDisabled, setButtonDisabled] = useState(false);
  const [cart, setCart] = useState(
    useSelector((state) => {
      return state.user.cart;
    })
  );

  useEffect(() => {
    console.log(cart);
  }, [cart]);

  const addToCartHandler = () => {
    setButtonDisabled(true);
    dispatch(addToCart(Product)).then((response) => {
      dispatch(getUserCart()).then((response) => {
        console.log(response);
        setButtonDisabled(false);
      });
    });
  };

  return (
    <div className="postPage" style={{ width: "100%", padding: "3rem 4rem" }}>
      <div style={{ display: "flex", justifyContent: "center" }}>
        <h1>{Product.title}</h1>
      </div>

      <br />

      <Row gutter={[16, 16]}>
        <Col lg={12} xs={24}>
          <ProductImage detail={Product} />
        </Col>
        <Col lg={12} xs={24}>
          <ProductInfo
            buttonDisabled={buttonDisabled}
            addToCart={addToCartHandler}
            detail={Product}
          />
        </Col>
      </Row>
    </div>
  );
}
