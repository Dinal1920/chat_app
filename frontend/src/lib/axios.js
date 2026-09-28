import axios from "axios";

export const axiosInstance = axios.create({
  baseURL: "http://localhost:5124/api",
  withCredentials: true,
});