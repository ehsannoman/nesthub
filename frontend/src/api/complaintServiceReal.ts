import { apiRequest } from './apiClient';

export async function submitComplaint(payload: {
  category: string;
  description: string;
  photoUrl?: string;
}) {
  return apiRequest('/complaints', { method: 'POST', body: payload });
}

export async function getMyComplaints() {
  return apiRequest('/complaints');
}

export async function getComplaintById(id: string) {
  return apiRequest(`/complaints/${id}`);
}

export async function updateComplaintStatus(id: string, status: string) {
  return apiRequest(`/complaints/${id}`, { method: 'PATCH', body: { status } });
}