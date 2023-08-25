import { USER_BALANCE } from "./actions";

const INITIAL_STATE = {
  balance: 0,
};

const UserReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case USER_BALANCE:
      return {
        ...state,
        balance: action.balance,
      };

    default:
      return state;
  }
};

export default UserReducer;
