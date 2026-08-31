import { apiRequest } from './apiClient';
import { ManagedUser, AccountRole } from '../types';

export async function getUsers(): Promise<ManagedUser[]> {
  const data = await apiRequest('/users');
  // backend থেকে আসা _id কে id তে map করছি, frontend সব জায়গায় id ব্যবহার করে
  return data.map((u: any) => ({
    id: u._id,
    name: u.name,
    email: u.email,
    phone: u.phone,
    role: u.role,
    status: u.status,
    flat: u.flat,
    ownershipType: u.ownershipType,
    moveInDate: u.moveInDate,
    emergencyContactName: u.emergencyContact?.name,
    emergencyContactPhone: u.emergencyContact?.phone,
    emergencyContactRelation: u.emergencyContact?.relation,
    employeeId: u.employeeId,
    joiningDate: u.joiningDate,
  }));
}

interface CreateUserPayload {
  name: string;
  email: string;
  phone?: string;
  role: AccountRole;
  flat?: string;
  ownershipType?: 'Owner' | 'Tenant';
  moveInDate?: string;
  emergencyContactName?: string;
  emergencyContactPhone?: string;
  emergencyContactRelation?: string;
  employeeId?: string;
  joiningDate?: string;
}

export async function createUser(payload: CreateUserPayload): Promise<ManagedUser> {
  const body = {
    name: payload.name,
    email: payload.email,
    phone: payload.phone,
    role: payload.role,
    flat: payload.flat,
    ownershipType: payload.ownershipType,
    moveInDate: payload.moveInDate,
    emergencyContact:
      payload.emergencyContactName || payload.emergencyContactPhone
        ? {
            name: payload.emergencyContactName,
            phone: payload.emergencyContactPhone,
            relation: payload.emergencyContactRelation,
          }
        : undefined,
    employeeId: payload.employeeId,
    joiningDate: payload.joiningDate,
  };

  const data = await apiRequest('/users', { method: 'POST', body });

  return {
    id: data.id,
    name: data.name,
    email: data.email,
    role: data.role,
    status: data.status,
    flat: data.flat,
  };
}

export async function getBuildingFlats(): Promise<{ flat: string; residentName: string }[]> {
  return apiRequest('/users/flats');
}