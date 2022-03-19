import React from "react";
import { Menu } from "antd";
import { Link } from "react-router-dom";

function LeftMenu(props) {
  return (
    <Menu mode={props.mode}>
      <Menu.Item key="home">
        <Link style={{ textDecoration: "none" }} to="/">
          Home
        </Link>
      </Menu.Item>
    </Menu>
  );
}

export default LeftMenu;
