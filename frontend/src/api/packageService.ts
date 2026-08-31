import { apiRequest } from './apiClient';

export async function registerPackage(payload: { flat: string; courier: string; photoUrl?: string }) {
  return apiRequest('/packages', { method: 'POST', body: payload });
}

export async function getPackages() {
  return apiRequest('/packages');
}

export async function markPackageCollected(id: string) {
  return apiRequest(`/packages/${id}`, { method: 'PATCH' });
}