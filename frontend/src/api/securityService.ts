import { TodayVisitor, SecurityOverview, ExpectedVisitor, InsideVisitor, SecurityActivity, DeliveryItem, IncidentType } from '../types';

// ==========================================================================
// TODO (backend integration): এই ফাংশনগুলোর body বদলে আসল Express API endpoint
// এ fetch call বসিয়ে দিলেই কাজ হয়ে যাবে। এখন সব mock/in-memory data দিয়ে চলছে।
// ==========================================================================

let expectedVisitors: ExpectedVisitor[] = [
  { id: 'EV-1', name: 'Rahat Ahmed', flat: 'B-803', purpose: 'Personal', expectedTime: '04:30 PM' },
  { id: 'EV-2', name: 'Nusrat Jahan', flat: 'C-405', purpose: 'Guest', expectedTime: '05:00 PM' },
];

let insideVisitors: InsideVisitor[] = [
  { id: 'IV-1', name: 'Sakib Hasan', flat: 'A-502', entryTime: '02:15 PM' },
  { id: 'IV-2', name: 'Karim Rahman', flat: 'B-803', entryTime: '10:30 AM' },
];

const recentActivity: SecurityActivity[] = [
  { id: 'A-1', type: 'visitor_in', title: 'Visitor checked in', subtitle: 'Rahat Ahmed · Flat B-803', time: '12 min ago' },
  { id: 'A-2', type: 'vehicle_in', title: 'Vehicle entered', subtitle: 'Toyota Axio · Flat A-204', time: '25 min ago' },
  { id: 'A-3', type: 'delivery_in', title: 'Delivery received', subtitle: 'Pathao · Flat C-701', time: '41 min ago' },
];

let deliveries: DeliveryItem[] = [
  { id: 'D-1', flat: 'C-701', courier: 'Pathao', time: '41 min ago', status: 'received' },
  { id: 'D-2', flat: 'B-102', courier: 'Daraz', time: '1h ago', status: 'received' },
  { id: 'D-3', flat: 'A-303', courier: 'Sundarban', time: 'Yesterday', status: 'collected' },
];

const mockTodayVisitors: TodayVisitor[] = [
  { id: 'V-101', name: 'Karim Rahman', flat: 'B-803', time: '10:30 AM', status: 'entered' },
  { id: 'V-102', name: 'Fahim Islam', flat: 'A-201', time: '11:15 AM', status: 'entered' },
  { id: 'V-103', name: 'Nusrat Jahan', flat: 'C-405', time: '2:00 PM', status: 'expected' },
  { id: 'V-104', name: 'Delivery - Pathao', flat: 'B-102', time: '3:30 PM', status: 'expected' },
  { id: 'V-105', name: 'Rafiq Ahmed', flat: 'D-501', time: '9:00 AM', status: 'exited' },
];

export async function getSecurityOverview(): Promise<SecurityOverview> {
  await new Promise((r) => setTimeout(r, 200));
  return {
    visitorsToday: mockTodayVisitors.length,
    currentlyInside: insideVisitors.length,
    vehiclesInside: 15,
    deliveries: deliveries.length,
  };
}

export async function getExpectedVisitors(): Promise<ExpectedVisitor[]> {
  await new Promise((r) => setTimeout(r, 200));
  return expectedVisitors;
}

export async function getCurrentlyInside(): Promise<InsideVisitor[]> {
  await new Promise((r) => setTimeout(r, 200));
  return insideVisitors;
}

export async function getRecentActivity(): Promise<SecurityActivity[]> {
  await new Promise((r) => setTimeout(r, 200));
  return recentActivity;
}

export async function getDeliveries(): Promise<DeliveryItem[]> {
  await new Promise((r) => setTimeout(r, 200));
  return deliveries;
}

export async function getTodayVisitors(): Promise<TodayVisitor[]> {
  await new Promise((r) => setTimeout(r, 300));
  return mockTodayVisitors;
}

export async function approveExpectedVisitor(id: string): Promise<void> {
  await new Promise((r) => setTimeout(r, 400));
  const v = expectedVisitors.find((x) => x.id === id);
  if (v) {
    insideVisitors = [...insideVisitors, { id: `IV-${Date.now()}`, name: v.name, flat: v.flat, entryTime: v.expectedTime }];
    expectedVisitors = expectedVisitors.filter((x) => x.id !== id);
  }
}

export async function rejectExpectedVisitor(id: string): Promise<void> {
  await new Promise((r) => setTimeout(r, 400));
  expectedVisitors = expectedVisitors.filter((x) => x.id !== id);
}

export async function checkOutInsideVisitor(id: string): Promise<void> {
  await new Promise((r) => setTimeout(r, 400));
  insideVisitors = insideVisitors.filter((x) => x.id !== id);
}

export interface ParsedVisitorQR {
  id: string;
  name: string;
  phone: string;
  flat: string;
  visitDate: string;
  visitTime: string;
  vehicle?: string;
}

export function parseVisitorQR(raw: string): ParsedVisitorQR | null {
  try {
    const data = JSON.parse(raw);
    if (data.type === 'nesthub-visitor') return data as ParsedVisitorQR;
    return null;
  } catch {
    return null;
  }
}

export async function checkInVisitor(name: string, flat: string): Promise<void> {
  await new Promise((r) => setTimeout(r, 600));
  insideVisitors = [...insideVisitors, { id: `IV-${Date.now()}`, name, flat, entryTime: new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' }) }];
}

interface WalkInPayload {
  name: string;
  phone: string;
  reason: string;
  flat: string;
  idPhotoUri: string | null;
}

export async function registerWalkInVisitor(payload: WalkInPayload): Promise<void> {
  await new Promise((r) => setTimeout(r, 800));
}

interface PackagePayload {
  flat: string;
  courier: string;
  photoUri: string | null;
}

export async function registerPackage(payload: PackagePayload): Promise<void> {
  await new Promise((r) => setTimeout(r, 800));
  deliveries = [{ id: `D-${Date.now()}`, flat: payload.flat, courier: payload.courier, time: 'Just now', status: 'received' }, ...deliveries];
}

interface IncidentPayload {
  type: IncidentType;
  description: string;
}

// TODO (backend integration): replace করো — POST /api/incidents
export async function reportIncident(payload: IncidentPayload): Promise<void> {
  await new Promise((r) => setTimeout(r, 800));
}

// TODO (backend integration): replace করো — POST /api/emergency-alert (broadcasts to all residents + manager)
export async function sendEmergencyAlert(message: string): Promise<void> {
  await new Promise((r) => setTimeout(r, 800));
}