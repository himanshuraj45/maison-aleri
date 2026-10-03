import { NextResponse } from "next/server";
import crypto from "node:crypto";

export async function POST(request:Request){
 try{
  const {razorpay_order_id,razorpay_payment_id,razorpay_signature}=await request.json();
  if(!razorpay_order_id||!razorpay_payment_id||!razorpay_signature||!process.env.RAZORPAY_KEY_SECRET) return NextResponse.json({error:"Invalid payment response."},{status:400});
  const expected=crypto.createHmac("sha256",process.env.RAZORPAY_KEY_SECRET).update(razorpay_order_id+"|"+razorpay_payment_id).digest("hex");
  if(!crypto.timingSafeEqual(Buffer.from(expected),Buffer.from(razorpay_signature))) return NextResponse.json({error:"Payment verification failed."},{status:400});
  return NextResponse.json({verified:true,paymentId:razorpay_payment_id});
 }catch{return NextResponse.json({error:"Could not verify payment."},{status:500})}
}