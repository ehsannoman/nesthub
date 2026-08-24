import { ManagedUser, AccountRole, AISummaryData } from '../types';
import { NoticeItem, BookingRequest, ManagerComplaint, GeneratedBill, ComplaintStatus, BillLineItem } from '../types';

// ==========================================================================
// TODO (backend integration): এই ফাংশনগুলোর body বদলে আসল Express API endpoint
// এ fetch call বসিয়ে দিলেই কাজ হয়ে যাবে। এখন সব mock data দিয়ে চলছে।
// TODO (AI integration): getAISummary এবং generateNotice এর ভেতরে backend এর
// Gemini/LLM endpoint কল হবে, যেটা real complaints/maintenance/visitor data
// analyse করে প্রাকৃতিক ভাষায় উত্তর দিবে।
// ==========================================================================

let mockUsers: ManagedUser[] = [
  { id: 'U-1', name: 'Rahat Ahmed', email: 'rahat@example.com', role: 'resident', status: 'active', flat: 'B-803' },
  { id: 'U-2', name: 'Mizanur Rahman', email: 'mizan.security@example.com', role: 'security', status: 'active' },
  { id: 'U-3', name: 'Sajid Khan', email: 'sajid.maintenance@example.com', role: 'maintenance', status: 'active' },
  { id: 'U-4', name: 'Nusrat Ahmed', email: 'nusrat@example.com', role: 'resident', status: 'inactive', flat: 'A-201' },
  { id: 'U-5', name: 'Ismail Hossain', email: 'ismail.security@example.com', role: 'security', status: 'active' },
];

export async function getUsers(): Promise<ManagedUser[]> {
  await new Promise((r) => setTimeout(r, 300));
  return mockUsers;
}

interface CreateUserPayload {
  name: string;
  email: string;
  role: AccountRole;
  flat?: string;
  phone?: string;
}

// TODO (backend integration): replace করো — POST /api/users
// backend এই ইউজারের জন্য login credentials generate করে email এ পাঠাবে
export async function createUser(payload: CreateUserPayload): Promise<ManagedUser> {
  await new Promise((r) => setTimeout(r, 700));
  const newUser: ManagedUser = {
    id: `U-${Date.now()}`,
    name: payload.name,
    email: payload.email,
    role: payload.role,
    status: 'active',
    flat: payload.flat,
  };
  mockUsers = [newUser, ...mockUsers];
  return newUser;
}

// TODO (AI integration): replace করো — POST /api/ai/community-summary
// backend সব complaints/maintenance/visitor/occupancy data দিয়ে Gemini কে prompt করবে
export async function getAISummary(): Promise<AISummaryData> {
  await new Promise((r) => setTimeout(r, 900));
  return {
    openComplaints: 8,
    pendingMaintenance: 5,
    todayVisitors: 24,
    occupancyRate: 86,
    insight: 'Water-leakage complaints have increased this week — consider inspecting Block A plumbing.',
  };
}

// TODO (AI integration): replace করো — POST /api/ai/notice-generator { draft }
// backend Gemini কে দিয়ে draft কে professional notice এ convert করবে
export async function generateNoticeFromDraft(draft: string): Promise<string> {
  await new Promise((r) => setTimeout(r, 900));
  return `Notice: ${draft.charAt(0).toUpperCase() + draft.slice(1)}\n\nResidents are kindly informed of the above. We appreciate your cooperation and apologize for any inconvenience caused. For questions, please contact the management office.`;
}

let mockNotices: NoticeItem[] = [
  { id: 'N-1', title: 'Water Supply Maintenance', body: 'Water supply will be interrupted on 12 Aug from 10:00 AM to 4:00 PM.', isEmergency: false, publishedAt: Date.now() - 7200000 },
  { id: 'N-2', title: 'Eid Celebration', body: 'Eid get together on 18 Aug at Community Hall.', isEmergency: false, publishedAt: Date.now() - 86400000 },
];

export async function getNotices(): Promise<NoticeItem[]> {
  await new Promise((r) => setTimeout(r, 300));
  return mockNotices;
}

export async function publishNotice(title: string, body: string, isEmergency: boolean): Promise<NoticeItem> {
  await new Promise((r) => setTimeout(r, 600));
  const notice: NoticeItem = { id: `N-${Date.now()}`, title, body, isEmergency, publishedAt: Date.now() };
  mockNotices = [notice, ...mockNotices];
  return notice;
}

let mockComplaints: ManagerComplaint[] = [
  { id: 'C-32', category: 'Plumbing', description: 'Water leakage in Block A common bathroom', photoUri: null, status: 'Assigned', priority: 'High', flat: 'A-204', createdAt: Date.now() - 3600000, residentName: 'Farhan Ahmed', assignedTo: 'Sajid Khan' },
  { id: 'C-41', category: 'Electrical', description: 'Flickering lights in the lobby', photoUri: null, status: 'Open', priority: 'Medium', flat: 'Lobby', createdAt: Date.now() - 7200000, residentName: 'Nusrat Ahmed' },
  { id: 'C-45', category: 'Elevator', description: 'Elevator making loud noise', photoUri: null, status: 'In Progress', priority: 'High', flat: 'B-803', createdAt: Date.now() - 10800000, residentName: 'Rahat Ahmed', assignedTo: 'Sajid Khan' },
];

export async function getAllComplaints(): Promise<ManagerComplaint[]> {
  await new Promise((r) => setTimeout(r, 300));
  return mockComplaints;
}

export async function updateComplaintStatus(id: string, status: ComplaintStatus): Promise<void> {
  await new Promise((r) => setTimeout(r, 500));
  mockComplaints = mockComplaints.map((c) => (c.id === id ? { ...c, status } : c));
}

export async function assignComplaint(id: string, staffName: string): Promise<void> {
  await new Promise((r) => setTimeout(r, 500));
  mockComplaints = mockComplaints.map((c) =>
    c.id === id ? { ...c, assignedTo: staffName, status: c.status === 'Open' ? 'Assigned' : c.status } : c
  );
}

let mockBookingRequests: BookingRequest[] = [
  { id: 'BK-201', facilityName: 'Community Hall', residentName: 'Rahat Ahmed', flat: 'B-803', date: '2025-08-30', timeSlot: '6:00 PM - 9:00 PM', status: 'pending' },
  { id: 'BK-202', facilityName: 'Rooftop', residentName: 'Nusrat Ahmed', flat: 'A-201', date: '2025-09-02', timeSlot: '5:00 PM - 8:00 PM', status: 'pending' },
];

export async function getBookingRequests(): Promise<BookingRequest[]> {
  await new Promise((r) => setTimeout(r, 300));
  return mockBookingRequests;
}

export async function approveBookingRequest(id: string): Promise<void> {
  await new Promise((r) => setTimeout(r, 500));
  mockBookingRequests = mockBookingRequests.map((b) => (b.id === id ? { ...b, status: 'approved' } : b));
}

export async function rejectBookingRequest(id: string): Promise<void> {
  await new Promise((r) => setTimeout(r, 500));
  mockBookingRequests = mockBookingRequests.map((b) => (b.id === id ? { ...b, status: 'rejected' } : b));
}

let mockGeneratedBills: GeneratedBill[] = [];

export async function generateBill(flat: string, month: string, items: BillLineItem[]): Promise<GeneratedBill> {
  await new Promise((r) => setTimeout(r, 800));
  const bill: GeneratedBill = {
    id: `GB-${Date.now()}`,
    flat,
    month,
    totalAmount: items.reduce((sum, i) => sum + i.amount, 0),
    items,
    createdAt: Date.now(),
  };
  mockGeneratedBills = [bill, ...mockGeneratedBills];
  return bill;
}

export async function getGeneratedBills(): Promise<GeneratedBill[]> {
  await new Promise((r) => setTimeout(r, 300));
  return mockGeneratedBills;
}

interface VisitorLogEntry {
  id: string;
  name: string;
  flat: string;
  time: string;
  status: string;
}

const mockVisitorLog: VisitorLogEntry[] = [
  { id: 'V-101', name: 'Karim Rahman', flat: 'B-803', time: 'Today 10:30 AM', status: 'entered' },
  { id: 'V-102', name: 'Fahim Islam', flat: 'A-201', time: 'Today 11:15 AM', status: 'entered' },
  { id: 'V-105', name: 'Rafiq Ahmed', flat: 'D-501', time: 'Today 9:00 AM', status: 'exited' },
  { id: 'V-098', name: 'Delivery - Pathao', flat: 'C-701', time: 'Yesterday 3:20 PM', status: 'exited' },
];

export async function getVisitorLog(): Promise<VisitorLogEntry[]> {
  await new Promise((r) => setTimeout(r, 300));
  return mockVisitorLog;
}