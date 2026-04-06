import axios from "axios";
import { useInlogStatus } from "./store";
import router from "./router";

const api = axios.create({
  baseURL: "/api"
});

api.interceptors.request.use((config) => {
  const inlog = useInlogStatus();
  if (inlog.token) {
    config.headers.Authorization = `Bearer ${inlog.token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      const inlog = useInlogStatus();
      inlog.logOut();
      router.push("/login");
    }
    return Promise.reject(error);
  }
);

export default api;
