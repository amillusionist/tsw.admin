import { AuthProvider } from "react-admin";
import { Navigate } from "react-router-dom";
import { getAuthHeaders } from "../config/headers";
import { apiCall } from "../config/headers";
// Use environment variable for API URL
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const authProvider: AuthProvider = {
    login: async ({ username, password }) => {
    const email = username;
    try {
      const response = await fetch(`${API_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        throw new Error("Invalid username or password");
      }

      const data = await response.json();
      console.log("Login response:", data);
      
      // Store the auth data
      localStorage.setItem("auth", JSON.stringify(data));
      
      return Promise.resolve();
    } catch (error) {
      console.error("Login error:", error);
      throw error;
    }
  },

  // logout: async () => {
  //   localStorage.removeItem("auth");
  //   return Promise.resolve();
  // },
  logout: async () => {
    try {
      await apiCall("/auth/logout", { method: "POST" });
      localStorage.removeItem("auth");
      window.location.href = "/login";
    } catch (e) {
      console.error("Logout failed", e);
    } finally {
      // // localStorage.removeItem("auth");
      // Navigate("/login" as any);
      // // return Promise.resolve();
    }
  },

  checkAuth: async () => {
    try {
      const auth = localStorage.getItem("auth");
      console.log("Checking auth:", auth);
      
      if (!auth) {
        console.log("No auth data found");
        window.location.href = "/login";
        return Promise.reject();
      }
      
      const data = JSON.parse(auth);
      console.log("Parsed auth data:", data);
      
      // Check if we have the required fields
      if (!data.data || !data.data.token || !data.data.user) {
        console.log("Invalid auth data structure");
        localStorage.removeItem("auth");
        return Promise.reject();
      }
      
      console.log("Auth check successful");
      return Promise.resolve();
    } catch (error) {
      console.error("Auth check error:", error);
      localStorage.removeItem("auth");
      return Promise.reject();
    }
  },
  

  checkError: async (error) => {
    const status = error.status;
    if (status === 401 || status === 403) {
      localStorage.removeItem("auth");
      return Promise.reject();
    }
    return Promise.resolve();
  },

  getIdentity: async () => {
    try {
      const auth = localStorage.getItem("auth");
      if (!auth) return Promise.reject();

      const data = JSON.parse(auth);
      console.log("Getting identity from:", data);
      
      const user = data.data.user;
      return Promise.resolve({
        id: user.id,
        fullName: user.name,
      });
    } catch (error) {
      console.error("Get identity error:", error);
      return Promise.reject();
    }
  },

  getPermissions: async () => Promise.resolve(),
};

export { authProvider };
