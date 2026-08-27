import { apiRequest, setAuthToken } from './apiClient';

interface RegisterManagerPayload {
  name: string;
  email: string;
  phone?: string;
  password: string;
  buildingName: string;
  buildingAddress: string;
  buildingType?: string;
  totalFloors?: number;
  totalFlats?: number;
}

export async function registerManager(payload: RegisterManagerPayload) {
  const data = await apiRequest('/auth/register-manager', {
    method: 'POST',
    body: payload,
    requiresAuth: false,
  });
  setAuthToken(data.token);
  return data;
}

export async function login(email: string, password: string) {
  const data = await apiRequest('/auth/login', {
    method: 'POST',
    body: { email, password },
    requiresAuth: false,
  });
  setAuthToken(data.token);
  return data;
}