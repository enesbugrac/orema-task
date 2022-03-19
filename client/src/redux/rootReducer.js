import { combineReducers } from "redux";

import productReducer from "./product/product.reducer";
import userReducer from "./user/user.reducer";

const rootReducer = combineReducers({
  shop: productReducer,
  user: userReducer,
});

export default rootReducer;
