import { _ } from "meteor/underscore";

const initialState = {};

export default (state = initialState, action) => {
  switch (action.type) {
    case "ON_LOGIN":
      return { ...state, auth: { ...action } };
    case "ON_LOGOUT":
      return { ...state, auth: { ...action } };
    default:
      return state;
  }
};
