import { Facility, DayStatus, Booking, FacilityId } from '../types';

// ==========================================================================
// TODO (backend integration): এই ফাইলের ফাংশনগুলোর body বদলে আসল Express API
// endpoint এ fetch call বসিয়ে দিলেই কাজ হয়ে যাবে। এখন সব mock data দিয়ে চলছে।
// ==========================================================================

export const facilities: Facility[] = [
  { id: 'community-hall', name: 'Community Hall', icon: 'people-outline', description: 'Up to 80 guests · Sound system included' },
  { id: 'rooftop', name: 'Rooftop', icon: 'sunny-outline', description: 'Up to 30 guests · Open-air seating' },
  { id: 'gym', name: 'Gym', icon: 'barbell-outline', description: 'Slot based · 1 hour sessions' },
  { id: 'bbq-area', name: 'BBQ Area', icon: 'flame-outline', description: 'Up to 20 guests · Grill provided' },
];

export const timeSlots = [
  '9:00 AM - 12:00 PM',
  '1:00 PM - 4:00 PM',
  '5:00 PM - 8:00 PM',
  '6:00 PM - 9:00 PM',
];

// TODO (backend integration): replace করো —
// const res = await fetch(`https://your-api.com/api/facilities/${facilityId}/availability?month=${month}&year=${year}`);
// return res.json();
export async function getMonthAvailability(
  facilityId: FacilityId,
  year: number,
  month: number // 0-indexed
): Promise<Record<string, DayStatus>> {
  await new Promise((r) => setTimeout(r, 300));

  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const result: Record<string, DayStatus> = {};

  for (let day = 1; day <= daysInMonth; day++) {
    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    // deterministic pseudo-random pattern দিয়ে mock status বানাচ্ছি
    const seed = (day * 7 + facilityId.length * 13) % 10;
    if (seed < 6) result[dateStr] = 'available';
    else if (seed < 9) result[dateStr] = 'booked';
    else result[dateStr] = 'pending';
  }

  return result;
}

interface SubmitBookingPayload {
  facilityId: FacilityId;
  facilityName: string;
  date: string;
  timeSlot: string;
}

// TODO (backend integration): replace করো —
// const res = await fetch('https://your-api.com/api/bookings', {
//   method: 'POST',
//   headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
//   body: JSON.stringify(payload),
// });
// return res.json();
export async function submitBooking(payload: SubmitBookingPayload): Promise<Booking> {
  await new Promise((r) => setTimeout(r, 800));

  return {
    id: `BK-${Math.floor(Math.random() * 900 + 100)}`,
    facilityId: payload.facilityId,
    facilityName: payload.facilityName,
    date: payload.date,
    timeSlot: payload.timeSlot,
    status: 'pending', // Manager approve করার আগ পর্যন্ত pending থাকবে
    createdAt: Date.now(),
  };
}