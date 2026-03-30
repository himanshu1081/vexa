import Razorpay from "razorpay";
import { NextResponse } from "next/server";


const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET
});

export async function POST(req) {
  try {
    let { amount } = await req.json();
    if (amount < 0) {
      amount = 1
    }

    const options = {
      amount: amount* 100,
      currency: "INR",
      receipt: "rcpt_" + Date.now()
    };

    const order = await razorpay.orders.create(options);
    console.log(options)

    return NextResponse.json(order);

  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Order creation failed" },
      { status: 500 }
    );
  }
}

