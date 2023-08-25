import { combineReducers } from "redux";

import UserReducer from "./modules/user/reducer";

const rootReducer = combineReducers({
  user: UserReducer,
});

export default rootReducer;
