import axios, {
  AxiosError,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from "axios";

interface CustomAxiosRequestConfig extends InternalAxiosRequestConfig {
  _retry?: boolean;
}

const axiosInstance = axios.create({
  baseURL: "http://localhost:5000", // Replace with your server URL
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
  },
});

axiosInstance.interceptors.response.use(
  (response: AxiosResponse) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as CustomAxiosRequestConfig;

    if (
      error.response?.status === 403 &&
      originalRequest &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true;
      const refreshToken = localStorage.getItem("refreshToken");
      try {
        const response = await axios.post(
          "http://localhost:5000/refresh-token",
          { refreshToken }
        );

        if (response.status === 200) {
          const { accessToken } = response.data;
          localStorage.setItem("accessToken", accessToken);
          axiosInstance.defaults.headers[
            "Authorization"
          ] = `Bearer ${accessToken}`;
          if (originalRequest.headers) {
            originalRequest.headers["Authorization"] = `Bearer ${accessToken}`;
          }
          return axiosInstance(originalRequest);
        }
      } catch (error) {
        console.log("Refresh token failed", error);
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
