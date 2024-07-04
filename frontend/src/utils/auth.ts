import axiosInstance from "../axiosConfig";

export const setAuthToken = (token: string | null) => {
  if (token) {
    localStorage.setItem("accessToken", token);
    axiosInstance.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  } else {
    localStorage.removeItem("accessToken");
    delete axiosInstance.defaults.headers.common["Authorization"];
  }
};

export const getAuthToken = () => localStorage.getItem("accessToken");

export const isAuthenticated = () => !!getAuthToken();

export const clearAuth = () => {
  localStorage.removeItem("accessToken");
  delete axiosInstance.defaults.headers.common["Authorization"];
  // If you have any other auth-related data in localStorage, clear it here
  // For example:
  // localStorage.removeItem("user");
};
