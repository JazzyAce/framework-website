import Stripe from "stripe";
import { NextResponse } from "next/server";
import { auth } from "../../../lib/auth/server";

export async function POST(request) {
  try {
    const session = await auth.getSession();

    if (!session?.data?.user && !session?.user) {
      return NextResponse.json(
        { error: "Please sign in first." },
        { status: 401 }
      );
    }

    const user = session?.data?.user || session?.user;

    if (!user?.id) {
      return NextResponse.json(
        { error: "Unable to identify your account." },
        { status: 401 }
      );
    }

    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

    const checkout = await stripe.checkout.sessions.create({
      mode: "payment",
      client_reference_id: user.id,
      metadata: {
        framework_user_id: user.id,
      },
      line_items: [
        {
          price: process.env.STRIPE_PRICE_ID,
          quantity: 1,
        },
      ],
      success_url:
        "https://framework-website-f5qu.vercel.app/dashboard?checkout=success",
      cancel_url:
        "https://framework-website-f5qu.vercel.app/dashboard?checkout=cancelled",
    });

    return NextResponse.json({ url: checkout.url });
  } catch (error) {
    console.error("Stripe checkout error:", error);

    return NextResponse.json(
      { error: "Unable to start checkout." },
      { status: 500 }
    );
  }
}
