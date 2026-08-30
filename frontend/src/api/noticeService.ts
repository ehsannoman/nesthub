import { apiRequest } from './apiClient';

export async function getNotices() {
  return apiRequest('/notices');
}

export async function publishNotice(title: string, body: string, isEmergency: boolean) {
  return apiRequest('/notices', { method: 'POST', body: { title, body, isEmergency } });
}