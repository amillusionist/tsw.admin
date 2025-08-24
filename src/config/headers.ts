// Headers configuration for API calls

// Get JWT token from localStorage
const getAuthToken = (): string => {
  const authData = localStorage.getItem("auth");
  if (authData) {
    const parsed = JSON.parse(authData); // string → object
    const token = parsed?.data?.token;   // token access
     return token;
  }
  else{
    return ""
  }

}

// Headers without authentication (for GET requests)
export const getHeaders = (): HeadersInit => {
  return {
    "Content-Type": "application/json",
  }
}

// Headers with authentication (for POST, PUT, DELETE requests)
export const getAuthHeaders = (): HeadersInit => {
  const token = getAuthToken()
  
  if (!token) {
    console.log(token)
    throw new Error("No authentication token found")
  }
  
  return {
    "Content-Type": "application/json",
    "Authorization": `Bearer ${token}`
  }
}

// Headers with optional authentication
export const getOptionalAuthHeaders = (): HeadersInit => {
  const token = getAuthToken()
  
  const headers: HeadersInit = {
    "Content-Type": "application/json",
  }
  
  if (token) {
    headers.Authorization = `Bearer ${token}`
  }
  
  return headers
}

// API URL configuration
export const getApiUrl = (): string => {
  return import.meta.env.VITE_API_URL || "http://localhost:5000/api"
}

// Helper function to make API calls
export const apiCall = async (
  endpoint: string,
  options: RequestInit = {}
): Promise<Response> => {
  const baseUrl = getApiUrl()
  const url = `${baseUrl}${endpoint}`
  
  // Determine which headers to use based on the method
  const method = options.method?.toUpperCase() || "GET"
  const needsAuth = ["POST", "PUT", "DELETE", "PATCH"].includes(method)
  
  const headers = needsAuth ? getAuthHeaders() : getHeaders()
  
  const config: RequestInit = {
    ...options,
    headers: {
      ...headers,
      ...options.headers,
    },
  }
  
  return fetch(url, config)
}
