import axios from "axios";

export const $axios = axios.create({
  baseURL: "https://food-api-production.herokuapp.com/api",
  timeout: 5000,
});

$axios.interceptors.response.use(({ data }) => {
  return data;
});
