// src/api.js
// TODO: need to use API_BASE_URL from .env
const API_BASE_URL = "http://localhost:4000/api";

// Helper function to get token from local storage
const getToken = () => localStorage.getItem("token");

// Helper function for making authenticated requests
const authFetch = async (url, options = {}) => {
  const token = getToken();
  const headers = {
    "Content-Type": "application/json",
    ...options.headers,
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const response = await fetch(url, { ...options, headers });

  // TODO: need to be reenabled
  // If unauthorized, clear token and maybe redirect to login (not implemented here, but good practice)
  //   if (response.status === 401) {
  //     localStorage.removeItem('token');
  //     // window.location.href = '/login'; // Example: redirect to login
  //   }

  return response;
};

// --- Authentication API Calls ---
export const loginUser = async (username, password) => {
  const response = await fetch(`${API_BASE_URL}/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ username, password }),
  });
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Login failed");
  }
  const data = await response.json();
  localStorage.setItem("token", data.token); // Store token
  return data;
};

export const registerUser = async (username, password) => {
  const response = await fetch(`${API_BASE_URL}/auth/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ username, password }),
  });
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Registration failed");
  }
  const data = await response.json();
  localStorage.setItem("token", data.token); // Store token upon registration
  return data;
};

export const getAnomalies = async () => {
  const response = await authFetch(`${API_BASE_URL}/anomalies`);
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Failed to fetch anomalies");
  }
  return response.json();
};

export const updateAnomaly = async (shoeData) => {
  const id = shoeData.id;
  if (!id) {
    throw new Error("ID is required for update");
  }

  const { action_required, comments, suspected_reason } = shoeData;
  if (!action_required || !comments || !suspected_reason) {
    throw new Error(
      "All fields (action_required, comments, suspected_reason) are required for update"
    );
  }

  const response = await authFetch(`${API_BASE_URL}/anomalies/${shoeData.id}`, {
    method: "PUT",
    body: JSON.stringify({ action_required, comments, suspected_reason }),
  });
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Failed to update anomalies");
  }
  return response.json();
};
