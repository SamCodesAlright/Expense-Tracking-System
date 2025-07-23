import axiosInstance from "../utils/axiosInstance";
import { API_PATHS } from "../utils/apiPaths";

export const logoutUser = async () => {
  await axiosInstance.post(API_PATHS.AUTH.LOGOUT);
};
