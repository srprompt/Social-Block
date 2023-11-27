import axios from "axios";

axios.defaults.withCredentials = true;

export const makeRequest = axios.create({
  //baseURL: "http://192.168.15.149:8800/api/",
  baseURL: "https://coral-app-xcxp2.ondigitalocean.app/api/",
  withCredentials: true,
});