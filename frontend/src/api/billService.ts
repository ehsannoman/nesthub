import { Bill } from '../types';

// ==========================================================================
// TODO (backend integration): এই ফাইলের ফাংশনগুলোর body বদলে আসল Express API
// endpoint এ fetch call বসিয়ে দিলেই কাজ হয়ে যাবে। এখন সব mock data দিয়ে চলছে।
// ==========================================================================

const mockBills: Bill[] = [
  {
    id: 'BILL-2508',
    month: 'August 2025',
    dueDate: '10 Aug 2025',
    totalAmount: 5600,
    status: 'unpaid',
    items: [
      { label: 'Maintenance Fee', amount: 3500 },
      { label: 'Lift Charge', amount: 800 },
      { label: 'Generator Charge', amount: 600 },
      { label: 'Water Bill', amount: 700 },
    ],
  },
  {
    id: 'BILL-2507',
    month: 'July 2025',
    dueDate: '10 Jul 2025',
    totalAmount: 5400,
    status: 'paid',
    paidDate: '08 Jul 2025',
    items: [
      { label: 'Maintenance Fee', amount: 3500 },
      { label: 'Lift Charge', amount: 800 },
      { label: 'Generator Charge', amount: 500 },
      { label: 'Water Bill', amount: 600 },
    ],
  },
  {
    id: 'BILL-2506',
    month: 'June 2025',
    dueDate: '10 Jun 2025',
    totalAmount: 5450,
    status: 'paid',
    paidDate: '09 Jun 2025',
    items: [
      { label: 'Maintenance Fee', amount: 3500 },
      { label: 'Lift Charge', amount: 800 },
      { label: 'Generator Charge', amount: 550 },
      { label: 'Water Bill', amount: 600 },
    ],
  },
  {
    id: 'BILL-2505',
    month: 'May 2025',
    dueDate: '10 May 2025',
    totalAmount: 5300,
    status: 'paid',
    paidDate: '07 May 2025',
    items: [
      { label: 'Maintenance Fee', amount: 3500 },
      { label: 'Lift Charge', amount: 700 },
      { label: 'Generator Charge', amount: 500 },
      { label: 'Water Bill', amount: 600 },
    ],
  },
];

// TODO (backend integration): replace করো —
// const res = await fetch('https://your-api.com/api/bills', { headers: { Authorization: `Bearer ${token}` } });
// return res.json();
export async function getBills(): Promise<Bill[]> {
  await new Promise((r) => setTimeout(r, 400));
  return mockBills;
}

// TODO (backend integration): replace করো —
// const res = await fetch(`https://your-api.com/api/bills/${billId}/pay`, { method: 'POST', ... });
// return res.json();
export async function payBill(billId: string): Promise<Bill> {
  await new Promise((r) => setTimeout(r, 900));
  const bill = mockBills.find((b) => b.id === billId)!;
  bill.status = 'paid';
  bill.paidDate = new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
  return bill;
}