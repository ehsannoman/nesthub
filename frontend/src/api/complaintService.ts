import { Complaint, ComplaintCategory, ComplaintPriority } from '../types';

// ==========================================================================
// TODO (backend integration): এই ফাইলের ভেতরের ফাংশনগুলোর body বদলে
// আসল Express API endpoint এ fetch/axios call বসিয়ে দিলেই কাজ হয়ে যাবে।
// এখন সব local/mock ভাবে কাজ করছে যাতে UI test করা যায়।
// ==========================================================================

interface SubmitComplaintPayload {
  category: ComplaintCategory;
  description: string;
  photoUri: string | null;
  flat: string;
}

// TODO (AI integration): backend এ POST /complaints হিট করার সময়
// AI যদি category/priority suggest করে, response থেকে সেটা নিয়ে আসবে।
// আপাতত simple rule দিয়ে priority ঠিক করছি।
function suggestPriority(category: ComplaintCategory, description: string): ComplaintPriority {
  const urgentKeywords = ['leak', 'fire', 'spark', 'stuck', 'broken', 'no water', 'no power'];
  const text = description.toLowerCase();
  if (category === 'Elevator' || category === 'Security') return 'High';
  if (urgentKeywords.some((k) => text.includes(k))) return 'High';
  if (category === 'Electrical' || category === 'Plumbing') return 'Medium';
  return 'Low';
}

export async function submitComplaint(payload: SubmitComplaintPayload): Promise<Complaint> {
  // TODO (backend integration): replace করো এইভাবে —
  // const res = await fetch('https://your-api.com/api/complaints', {
  //   method: 'POST',
  //   headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
  //   body: JSON.stringify(payload),
  // });
  // return res.json();

  await new Promise((resolve) => setTimeout(resolve, 800)); // network delay simulate করছি

  const complaint: Complaint = {
    id: `C-${Math.floor(Math.random() * 900 + 100)}`,
    category: payload.category,
    description: payload.description,
    photoUri: payload.photoUri,
    status: 'Open',
    priority: suggestPriority(payload.category, payload.description),
    flat: payload.flat,
    createdAt: Date.now(),
  };

  return complaint;
}