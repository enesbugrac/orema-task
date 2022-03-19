import React, { useEffect, useState } from "react";
import { Button, Descriptions } from "antd";

function ProductInfo(props) {
  const [Product, setProduct] = useState({});

  useEffect(() => {
    console.log(props.buttonDisabled);
    setProduct(props.detail);
  }, [props.detail, props.buttonDisabled]);

  const addToCarthandler = () => {
    props.addToCart(props.detail._id);
  };

  return (
    <div>
      <Descriptions title="Product Info">
        <Descriptions.Item label="Price"> {Product.price}</Descriptions.Item>
        <Descriptions.Item label="Description">
          {" "}
          {Product.description}
        </Descriptions.Item>
      </Descriptions>

      <br />
      <br />
      <br />
      <div style={{ display: "flex", justifyContent: "center" }}>
        <Button
          size="large"
          shape="round"
          type="danger"
          onClick={addToCarthandler}
          disabled={props.buttonDisabled}
        >
          Add to Cart
        </Button>
      </div>
    </div>
  );
}

export default ProductInfo;
