import axios from "axios";

export const makeRequest = axios.create({
  //baseURL: "http://192.168.15.149:8800/api/",
  baseURL: "https://coral-app-xcxp2.ondigitalocean.app:8080/api/",
  withCredentials: true,
});