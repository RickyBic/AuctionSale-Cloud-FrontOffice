import { combineReducers } from "redux";
import userReducer from "./user/userReducer";
import authReducer from "./user/auth/authReducer";
import offreReducer from "./offre/offreReducer";

const rootReducer = combineReducers({
  user: userReducer,
  offre: offreReducer,
  auth: authReducer,
});

export default rootReducer;
