import { apiRequest } from './apiClient';

export async function inviteVisitor(payload: {
  name: string;
  phone: string;
  visitDate: string;
  visitTime: string;
  vehicle?: string;
}) {
  return apiRequest('/visitors/invite', { method: 'POST', body: payload });
}

export async function scanVisitorQR(qrToken: string) {
  return apiRequest('/visitors/scan', { method: 'POST', body: { qrToken } });
}

export async function checkInVisitor(visitorId: string) {
  return apiRequest(`/visitors/${visitorId}/check-in`, { method: 'POST' });
}

export async function checkOutVisitor(visitorId: string) {
  return apiRequest(`/visitors/${visitorId}/check-out`, { method: 'POST' });
}

export async function getTodayVisitors() {
  return apiRequest('/visitors/today');
}

export async function getExpectedVisitors() {
  return apiRequest('/visitors/expected');
}

export async function getInsideVisitors() {
  return apiRequest('/visitors/inside');
}

export async function registerWalkInVisitor(payload: {
  name: string;
  phone: string;
  reason: string;
  flat: string;
}) {
  return apiRequest('/visitors/walk-in', { method: 'POST', body: payload });
}