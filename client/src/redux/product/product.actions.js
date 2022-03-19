import * as actionTypes from "./product.types";

export const loadCurrentItem = (item) => {
  console.log("GELDİ");
  return {
    type: actionTypes.LOAD_CURRENT_ITEM,
    payload: item,
  };
};
