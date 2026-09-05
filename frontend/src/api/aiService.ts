import { apiRequest } from './apiClient';

export async function askCommunityAI(question?: string) {
  return apiRequest('/ai/ask', { method: 'POST', body: { question } });
}

export async function generateNoticeFromDraft(draft: string) {
  return apiRequest('/ai/generate-notice', { method: 'POST', body: { draft } });
}