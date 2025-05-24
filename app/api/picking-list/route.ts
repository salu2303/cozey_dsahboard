import { NextResponse } from 'next/server';
import { generatePickingList } from '@/lib/processOrders';

// export async function GET(request: Request) {
//   const today = new Date();
//   today.setDate(today.getDate() - 1); 


//   const dateStr = today.toLocaleDateString('en-CA'); 

//   console.log("Date string for picking list:", dateStr);

//   const pickingList = generatePickingList(dateStr);

//   return NextResponse.json(pickingList);
// }

export async function POST(req: Request) {
  const { startDate, endDate } = await req.json();

  const pickingList = generatePickingList(startDate, endDate);
  return NextResponse.json(pickingList);
}
//The following post API is just created for refernce that how this application can be scalable
// export async function POST(request: Request) {
//   const body = await request.json();
//   const { date } = body;

//   console.log("Date string for picking list:", date);

//   const pickingList = generatePickingList(date);

//   return NextResponse.json(pickingList);
// }