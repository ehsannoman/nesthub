import { apiRequest } from './apiClient';

export async function getAvailability(facilityId: string, date: string) {
  return apiRequest(`/bookings/availability?facilityId=${facilityId}&date=${date}`);
}

export async function createBooking(payload: { facilityId: string; date: string; startHour: number; endHour: number }) {
  return apiRequest('/bookings', { method: 'POST', body: payload });
}

export async function getBookings() {
  return apiRequest('/bookings');
}

export async function updateBookingStatus(id: string, status: 'approved' | 'rejected') {
  return apiRequest(`/bookings/${id}`, { method: 'PATCH', body: { status } });
}