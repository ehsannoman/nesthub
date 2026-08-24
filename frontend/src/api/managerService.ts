import { ManagedUser, AccountRole, AISummaryData } from '../types';

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