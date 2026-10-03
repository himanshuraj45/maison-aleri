import { NextResponse } from "next/server";
import crypto from "node:crypto";

const PRODUCTS:Record<number,{price:number}>={1:{price:1990},2:{price:2290},3:{price:990},4:{price:1690},5:{price:1890},6:{price:2490},7:{price:1790},8:{price:1490},9:{price:1590},10:{price:1290}};

export async function POST(request:Request){
  try{
    const {items}=await request.json();
    if(!Array.isArray(items)||!items.length) return NextResponse.json({error:"Your cart is empty."},{status:400});
    const subtotal=items.reduce((sum:{value:number},item:{id:number;quantity:number})=>sum,{value:0} as any);
    let amount=0;
    for(const item of items){const p=PRODUCTS[Number(item.id)];const q=Math.floor(Number(item.quantity));if(!p||q<1||q>20) return NextResponse.json({error:"Invalid cart item."},{status:400});amount+=p.price*q}
    amount+=amount>=1999?0:99;
    if(!process.env.RAZORPAY_KEY_ID||!process.env.RAZORPAY_KEY_SECRET) return NextResponse.json({error:"Razorpay is not configured yet. Add the Razorpay keys to your environment variables."},{status:503});
    const auth=Buffer.from(process.env.RAZORPAY_KEY_ID+":"+process.env.RAZORPAY_KEY_SECRET).toString("base64");
    const r=await fetch("https://api.razorpay.com/v1/orders",{method:"POST",headers:{Authorization:"Basic "+auth,"Content-Type":"application/json"},body:JSON.stringify({amount,currency:"INR",receipt:"MA-"+Date.now(),notes:{brand:"Maison Aleri"}})});
    const data=await r.json();
    if(!r.ok) return NextResponse.json({error:data.error?.description||"Razorpay order creation failed."},{status:502});
    return NextResponse.json({orderId:data.id,amount:data.amount,currency:data.currency,key:process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID});
  }catch{return NextResponse.json({error:"Unable to start payment."},{status:500})}
}