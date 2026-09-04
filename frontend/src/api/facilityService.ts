import { apiRequest } from './apiClient';

export async function getMasterFacilityList() {
  return apiRequest('/facilities/master-list');
}

export async function getFacilities() {
  return apiRequest('/facilities');
}

export async function addFacility(payload: { name: string; icon: string; maxCapacity: number; pricePerHour: number }) {
  return apiRequest('/facilities', { method: 'POST', body: payload });
}

export async function updateFacility(id: string, payload: { maxCapacity?: number; pricePerHour?: number; isActive?: boolean }) {
  return apiRequest(`/facilities/${id}`, { method: 'PATCH', body: payload });
}

export async function deleteFacility(id: string) {
  return apiRequest(`/facilities/${id}`, { method: 'DELETE' });
}