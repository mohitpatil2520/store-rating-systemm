import axios from "axios";

//
// BASE URL SETUP
// -------------------------------------------
// In development:  baseURL = "/api"
//   (Vite proxy forwards to http://localhost:4000)
// In production:   baseURL = whatever you set in VITE_API_URL
//
const baseURL =
  import.meta.env.MODE === "development"
    ? "/api"
    : import.meta.env.VITE_API_URL || "/api";

const API = axios.create({ baseURL });


//
// REQUEST INTERCEPTOR
// -------------------------------------------
// Adds token automatically to every request.
//
API.interceptors.request.use((req) => {
  const token = localStorage.getItem("token");
  if (token) {
    req.headers.Authorization = `Bearer ${token}`;
  }
  return req;
});


//
// RESPONSE INTERCEPTOR
// -------------------------------------------
// If backend returns 401 (token expired/invalid),
// log out user automatically.
//
API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Remove saved session
      localStorage.removeItem("token");
      localStorage.removeItem("user");

      // Redirect to login
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export default API;
