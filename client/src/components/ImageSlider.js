import React from "react";
import { Carousel } from "antd";

function ImageSlider(props) {
  return (
    <div>
      <Carousel autoplay>
        <div key={props.key}>
          <img
            style={{ width: "100%", maxHeight: "150px" }}
            src={props.image}
            alt="productImage"
          />
        </div>
      </Carousel>
    </div>
  );
}

export default ImageSlider;
