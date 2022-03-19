import React, { useEffect } from "react";
import { auth } from "./redux/user/user.actions";
import { useSelector, useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";
export const AuthCheck = (ComposedClass, reload, adminRoute = null) => {
  function AuthenticationCheck(props) {
    let user = useSelector((state) => state.user);
    const history = useHistory();
    const dispatch = useDispatch();
    useEffect(() => {
      dispatch(auth()).then(async (response) => {
        if (!response) {
          if (reload) {
            history.push("/login");
          }
        } else {
          if (adminRoute && !response.payload.isAdmin) {
            history.push("/");
          } else {
            if (reload === false) {
              history.push("/");
            }
          }
        }
      });
    }, [dispatch, history, user.googleAuth]);

    return <ComposedClass {...props} user={user} />;
  }
  return AuthenticationCheck;
};
