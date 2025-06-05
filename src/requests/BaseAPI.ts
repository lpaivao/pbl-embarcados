import axios from "axios";

const baseUrl = process.env.API_URL || "http://localhost:3000/api";

export const axiosRequest = axios.create({
  baseURL: baseUrl,
  headers: {
    "Content-Type": "application/json",
  },
});
