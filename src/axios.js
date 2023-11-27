import axios from "axios";

export const makeRequest = axios.create({
  //baseURL: "http://192.168.15.149:8800/api/",
  baseURL: "https://socialblock-api-ybhf2.ondigitalocean.app/api/",
  withCredentials: true,
});