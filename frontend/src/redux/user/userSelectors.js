import { createSelector } from "reselect";

const userSelector = (state) => state.user;

export const userInfoSelector = createSelector(userSelector, (user) => ({
  userInfo: user.userInfo,
  isLoading: user.isLoading,
  error: user.error,
}));
