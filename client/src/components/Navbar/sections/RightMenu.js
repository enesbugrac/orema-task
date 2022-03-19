/* eslint-disable jsx-a11y/anchor-is-valid */
import React from "react";
import { Menu, Icon, Badge, Button } from "antd";
import axios from "axios";
import { Link, useHistory, withRouter } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logoutUser } from "../../../redux/user/user.actions";
function RightMenu(props) {
  const user = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const logoutHandler = () => {
    setTimeout(() => {
      dispatch(logoutUser()).then((response) => {
        if (!response.payload.data.accessToken) {
          window.localStorage.setItem("accessToken", "");
          window.localStorage.setItem("refreshToken", "");
          props.history.push("/login");
        } else {
          alert(response.payload);
        }
      });
    }, 500);
  };

  if (!user.accessToken) {
    return (
      <Menu mode={props.mode}>
        <Menu.Item key="sigin">
          <a href="/login">Signin</a>
        </Menu.Item>
        <Menu.Item key="signup">
          <a href="/register">Signup</a>
        </Menu.Item>
      </Menu>
    );
  } else {
    return (
      <Menu mode={props.mode}>
        <Menu.Item key="history">
          <Link to="/history">History</Link>
        </Menu.Item>
        <Menu.Item key="cart">
          <Link to="/cart">Basket</Link>
        </Menu.Item>

        <Menu.Item key="logout">
          <a onClick={logoutHandler}>Logout</a>
        </Menu.Item>
      </Menu>
    );
  }
}

export default withRouter(RightMenu);
