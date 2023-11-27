import axios from "axios";

export const makeRequest = axios.create({
  baseURL: "https://seahorse-app-64ieu.ondigitalocean.app:8800/api/",
  withCredentials: true,
});