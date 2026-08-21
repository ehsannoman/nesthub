export type UserRole = 'resident' | 'security' | 'manager' | 'maintenance';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
}