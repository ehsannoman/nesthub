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
export type BillStatus = 'paid' | 'unpaid';

export interface BillLineItem {
  label: string;
  amount: number;
}

export interface Bill {
  id: string;
  month: string;      // "August 2025"
  dueDate: string;     // "10 Aug 2025"
  totalAmount: number;
  status: BillStatus;
  paidDate?: string;
  items: BillLineItem[];
}
export interface TodayVisitor {
  id: string;
  name: string;
  flat: string;
  time: string;
  status: 'expected' | 'entered' | 'exited';
}
export interface SecurityOverview {
  visitorsToday: number;
  currentlyInside: number;
  vehiclesInside: number;
  deliveries: number;
}

export interface ExpectedVisitor {
  id: string;
  name: string;
  flat: string;
  purpose: string;
  expectedTime: string;
}

export interface InsideVisitor {
  id: string;
  name: string;
  flat: string;
  entryTime: string;
}

export interface SecurityActivity {
  id: string;
  type: 'visitor_in' | 'visitor_out' | 'vehicle_in' | 'delivery_in';
  title: string;
  subtitle: string;
  time: string;
}

export interface DeliveryItem {
  id: string;
  flat: string;
  courier: string;
  time: string;
  status: 'received' | 'collected';
}

export type IncidentType =
  | 'Security Issue' | 'Fire' | 'Medical Emergency' | 'Suspicious Activity' | 'Property Damage' | 'Other';

  export type AccountRole = 'resident' | 'security' | 'maintenance' | 'manager';
export type AccountStatus = 'active' | 'inactive';

export interface ManagedUser {
  id: string;
  name: string;
  email: string;
  role: AccountRole;
  status: AccountStatus;
  flat?: string;
}

export interface AISummaryData {
  openComplaints: number;
  pendingMaintenance: number;
  todayVisitors: number;
  occupancyRate: number;
  insight: string | null;
}