import axios from "axios";

const api = axios.create({
  baseURL: "https://task-lab08-backend.onrender.com"
});

export default api;