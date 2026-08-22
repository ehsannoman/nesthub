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