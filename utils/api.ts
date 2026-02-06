
const API_URL = 'http://localhost:8000';
const MOCK_MODE = true;

export const checkApiStatus = async (): Promise<boolean> => {
  if (MOCK_MODE) {
    return true;
  }
  try {
    const response = await fetch(`${API_URL}/`, {
      method: 'GET',
      headers: { 'Accept': 'application/json' },
    });
    if (!response.ok) return false;
    const data = await response.json();
    return data.status === "MindMetricAI Backend is running!";
  } catch (error) {
    return false;
  }
};

export const registerUser = async (email: string, password: string) => {
  const response = await fetch(`${API_URL}/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.detail || 'Registration failed');
  }
  return response.json();
};

export const loginUser = async (email: string, password: string) => {
  const formData = new URLSearchParams();
  formData.append('username', email); // FastAPI OAuth2 uses 'username'
  formData.append('password', password);

  const response = await fetch(`${API_URL}/token`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: formData.toString(),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.detail || 'Login failed');
  }
  return response.json();
};

export const getCurrentUser = async (token: string) => {
  const response = await fetch(`${API_URL}/users/me`, {
    method: 'GET',
    headers: { 'Authorization': `Bearer ${token}` },
  });
  if (!response.ok) throw new Error('Failed to fetch user');
  return response.json();
};
