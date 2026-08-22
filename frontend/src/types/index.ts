export type UserRole = 'resident' | 'security' | 'manager' | 'maintenance';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
}
export type ComplaintCategory =
  | 'Electrical' | 'Plumbing' | 'Elevator' | 'Cleaning' | 'Security' | 'Internet' | 'Others';

export type ComplaintStatus = 'Open' | 'Assigned' | 'In Progress' | 'Resolved' | 'Closed';
export type ComplaintPriority = 'Low' | 'Medium' | 'High';

export interface Complaint {
  id: string;
  category: ComplaintCategory;
  description: string;
  photoUri: string | null;
  status: ComplaintStatus;
  priority: ComplaintPriority;
  flat: string;
  createdAt: number;
}
export type FacilityId = 'community-hall' | 'rooftop' | 'gym' | 'bbq-area';

export interface Facility {
  id: FacilityId;
  name: string;
  icon: string;
  description: string;
}

export type DayStatus = 'available' | 'booked' | 'pending';
export type BookingStatus = 'pending' | 'approved' | 'rejected';

export interface Booking {
  id: string;
  facilityId: FacilityId;
  facilityName: string;
  date: string;       // "2025-08-24"
  timeSlot: string;   // "6:00 PM - 9:00 PM"
  status: BookingStatus;
  createdAt: number;
}