import { useContext, useEffect } from "react";
import { UserContext } from "../context/userContext";
import { useNavigate, useLocation } from "react-router-dom";
import axiosInstance from "../utils/axiosInstance";
import { API_PATHS } from "../utils/apiPaths";

export const useUserAuth = () => {
  const { user, updateUser, clearUser } = useContext(UserContext);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (user) return;

    let isMounted = true;

    const fetchUserInfo = async () => {
      try {
        const response = await axiosInstance.get(API_PATHS.AUTH.GET_USER_INFO);

        if (isMounted && response.data) {
          updateUser(response.data);
        }
      } catch (error) {
        if (error.response?.status === 401) {
          clearUser();
          // only redirect if we're not already on an auth page
          if (
            location.pathname !== "/login" &&
            location.pathname !== "/signup"
          ) {
            navigate("/login");
          }
        } else {
          console.error("Failed to fetch User Info:", error);
        }
      }
    };

    fetchUserInfo();

    return () => {
      isMounted = false;
    };
  }, [user, updateUser, clearUser, navigate]);
};
