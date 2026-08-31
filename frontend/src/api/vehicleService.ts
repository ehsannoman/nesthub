import { apiRequest } from './apiClient';

export async function getVehicles() {
  return apiRequest('/vehicles');
}

export async function addVehicle(plateNumber: string, type: string, model?: string) {
  return apiRequest('/vehicles', { method: 'POST', body: { plateNumber, type, model } });
}

export async function removeVehicle(id: string) {
  return apiRequest(`/vehicles/${id}`, { method: 'DELETE' });
}

export async function checkVehicleByPlate(plate: string) {
  return apiRequest(`/vehicles/check?plate=${encodeURIComponent(plate)}`);
}