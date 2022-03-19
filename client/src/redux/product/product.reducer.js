import * as actionTypes from "./product.types";

const INITIAL_STATE = {
  currentItem: null,
};

const productReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case actionTypes.LOAD_CURRENT_ITEM:
      return {
        ...state,
        currentItem: action.payload,
      };
    default:
      return state;
  }
};

export default productReducer;
