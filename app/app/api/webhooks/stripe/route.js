import Stripe from "stripe";
import { neon } from "@neondatabase/serverless";
import { NextResponse } from "next/server";

export const runtime = "nodejs";

export async function POST(request) {
  const signature = request.headers.get("stripe-signature");

  if (!signature || !process.env.STRIPE_WEBHOOK_SECRET) {
    return NextResponse.json(
      { error: "Webhook configuration missing" },
      { status: 400 }
    );
  }

  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

  let event;

  try {
    const body = await request.text();

    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (error) {
    console.error("Invalid Stripe webhook signature:", error.message);

    return NextResponse.json(
      { error: "Invalid webhook signature" },
      { status: 400 }
    );
  }

  if (event.type === "checkout.session.completed" || event.type === "checkout.session.async_payment_succeeded") {
    const checkout = event.data.object;

    if (checkout.payment_status !== "paid") {
      return NextResponse.json({ received: true });
    }

    const userId = checkout.client_reference_id;
    const metadataUserId = checkout.metadata?.framework_user_id;

    if (!userId || userId !== metadataUserId) {
      console.error("Missing or mismatched FRAMEWORK user ID");

      return NextResponse.json(
        { error: "Invalid user reference" },
        { status: 400 }
      );
    }

    try {
      const sql = neon(process.env.DATABASE_URL);

      await sql`
        INSERT INTO public.framework_subscriptions (
          user_id,
          stripe_checkout_session_id,
          stripe_payment_intent_id,
          plan,
          payment_status
        )
        VALUES (
          ${userId},
          ${checkout.id},
          ${checkout.payment_intent},
          'pro',
          'paid'
        )
        ON CONFLICT (user_id)
        DO UPDATE SET
          stripe_checkout_session_id = EXCLUDED.stripe_checkout_session_id,
          stripe_payment_intent_id = EXCLUDED.stripe_payment_intent_id,
          plan = 'pro',
          payment_status = 'paid',
          updated_at = NOW()
      `;
    } catch (error) {
      console.error("Unable to save Stripe payment:", error);

      return NextResponse.json(
        { error: "Database update failed" },
        { status: 500 }
      );
    }
  }

  return NextResponse.json({ received: true });
}
