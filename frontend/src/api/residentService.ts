import { AppNotification, ActivityItem, FamilyMember, Vehicle } from '../types';

// ==========================================================================
// TODO (backend integration): এই ফাংশনগুলোর body বদলে আসল Express API endpoint
// এ fetch call বসিয়ে দিলেই কাজ হয়ে যাবে। এখন সব mock/in-memory data দিয়ে চলছে।
// ==========================================================================

const mockNoticesForResident = [
  { id: 'N-1', title: 'Water Supply Maintenance', body: 'Water supply will be interrupted on 12 Aug from 10:00 AM to 4:00 PM.', isEmergency: false, publishedAt: Date.now() - 7200000 },
  { id: 'N-2', title: 'Eid Celebration', body: 'Eid get together on 18 Aug at Community Hall.', isEmergency: false, publishedAt: Date.now() - 86400000 },
  { id: 'N-3', title: 'Fire Safety Inspection', body: 'All blocks will undergo a routine fire safety inspection on 28 Aug at 11:00 AM.', isEmergency: false, publishedAt: Date.now() - 172800000 },
];

export async function getNoticesForResident() {
  await new Promise((r) => setTimeout(r, 300));
  return mockNoticesForResident;
}

const mockNotifications: AppNotification[] = [
  { id: 'NT-1', title: 'Visitor Arrived', body: 'Karim Rahman has entered the premises.', type: 'visitor', read: false, time: '10 min ago' },
  { id: 'NT-2', title: 'Complaint Updated', body: 'Your complaint C-32 is now In Progress.', type: 'complaint', read: false, time: '1h ago' },
  { id: 'NT-3', title: 'Booking Approved', body: 'Your Community Hall booking for 30 Aug has been approved.', type: 'booking', read: false, time: '3h ago' },
  { id: 'NT-4', title: 'Bill Generated', body: 'Your August maintenance bill of ৳5,600 is ready.', type: 'bill', read: true, time: '1d ago' },
  { id: 'NT-5', title: 'Package Arrived', body: 'A package from Daraz has arrived for you.', type: 'package', read: true, time: '2d ago' },
];

export async function getNotifications(): Promise<AppNotification[]> {
  await new Promise((r) => setTimeout(r, 300));
  return mockNotifications;
}

const mockActivity: ActivityItem[] = [
  { id: 'A-1', type: 'visitor', title: 'Visitor checked in', subtitle: 'Karim Rahman', time: 'Today, 10:30 AM', icon: 'person-outline' },
  { id: 'A-2', type: 'complaint', title: 'Complaint status updated', subtitle: 'C-32 — In Progress', time: 'Today, 09:15 AM', icon: 'build-outline' },
  { id: 'A-3', type: 'booking', title: 'Facility booking requested', subtitle: 'Community Hall — 30 Aug', time: 'Yesterday', icon: 'calendar-outline' },
  { id: 'A-4', type: 'bill', title: 'Bill generated', subtitle: 'August 2025 — ৳5,600', time: '2 days ago', icon: 'receipt-outline' },
  { id: 'A-5', type: 'package', title: 'Package received', subtitle: 'From Daraz', time: '3 days ago', icon: 'cube-outline' },
];

export async function getActivity(): Promise<ActivityItem[]> {
  await new Promise((r) => setTimeout(r, 300));
  return mockActivity;
}

let mockFamilyMembers: FamilyMember[] = [
  { id: 'F-1', name: 'Ayesha Ahmed', relation: 'Spouse', phone: '01711111111' },
  { id: 'F-2', name: 'Zayan Ahmed', relation: 'Son', phone: '—' },
];

export async function getFamilyMembers(): Promise<FamilyMember[]> {
  await new Promise((r) => setTimeout(r, 300));
  return mockFamilyMembers;
}

export async function addFamilyMember(name: string, relation: string, phone: string): Promise<FamilyMember> {
  await new Promise((r) => setTimeout(r, 500));
  const member: FamilyMember = { id: `F-${Date.now()}`, name, relation, phone };
  mockFamilyMembers = [...mockFamilyMembers, member];
  return member;
}

export async function removeFamilyMember(id: string): Promise<void> {
  await new Promise((r) => setTimeout(r, 400));
  mockFamilyMembers = mockFamilyMembers.filter((m) => m.id !== id);
}

let mockVehicles: Vehicle[] = [
  { id: 'V-1', plateNumber: 'DHA-1234', type: 'Car', model: 'Toyota Axio' },
];

export async function getVehicles(): Promise<Vehicle[]> {
  await new Promise((r) => setTimeout(r, 300));
  return mockVehicles;
}

export async function addVehicle(plateNumber: string, type: Vehicle['type'], model: string): Promise<Vehicle> {
  await new Promise((r) => setTimeout(r, 500));
  const vehicle: Vehicle = { id: `V-${Date.now()}`, plateNumber, type, model };
  mockVehicles = [...mockVehicles, vehicle];
  return vehicle;
}

export async function removeVehicle(id: string): Promise<void> {
  await new Promise((r) => setTimeout(r, 400));
  mockVehicles = mockVehicles.filter((v) => v.id !== id);
}