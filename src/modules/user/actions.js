export const USER_BALANCE = "USER_BALANCE";

export const setUserBalance = (balance) => {
  return {
    type: USER_BALANCE,
    balance,
  };
};
