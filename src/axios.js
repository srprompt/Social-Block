import axios from "axios";

export const makeRequest = axios.create({
  baseURL: "https://seahorse-app-64ieu.ondigitalocean.app/api/",
  withCredentials: true,
});