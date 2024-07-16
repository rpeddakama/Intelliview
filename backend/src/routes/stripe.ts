import express, { Request, Response } from "express";
import Stripe from "stripe";
import User from "../models/User";
import { authenticateToken } from "../middleware/auth";

const router = express.Router();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

router.post(
  "/create-stripe-customer",
  authenticateToken,
  async (req: Request, res: Response) => {
    try {
      const user = (req as any).user;

      const existingCustomers = await stripe.customers.list({
        email: user.email,
        limit: 1,
      });
      let customer;

      if (existingCustomers.data.length > 0) {
        customer = existingCustomers.data[0];
        if (customer.metadata.userId !== user._id.toString()) {
          customer = await stripe.customers.update(customer.id, {
            metadata: { userId: user._id.toString() },
          });
        }
      } else {
        customer = await stripe.customers.create({
          email: user.email,
          metadata: { userId: user._id.toString() },
        });
      }

      console.log(
        `Associated Stripe Customer ${customer.id} with user ${user.email}`
      );
      res.json({ stripeCustomerId: customer.id });
    } catch (error) {
      console.error("Error managing Stripe customer:", error);
      res.status(500).json({ error: "Failed to manage Stripe customer" });
    }
  }
);

router.post(
  "/stripe-webhook",
  express.raw({ type: "application/json" }),
  async (req, res) => {
    const sig = req.headers["stripe-signature"];

    if (typeof sig !== "string") {
      return res.status(400).send("Invalid stripe signature");
    }

    let event: Stripe.Event;

    try {
      event = stripe.webhooks.constructEvent(
        req.body,
        sig,
        process.env.STRIPE_WEBHOOK_SECRET!
      );
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : "Unknown error";
      console.error("Webhook Error:", errorMessage);
      return res.status(400).send(`Webhook Error: ${errorMessage}`);
    }

    console.log("Received event:", event.type);

    switch (event.type) {
      case "customer.subscription.created":
      case "customer.subscription.updated":
      case "customer.subscription.deleted":
        const subscription = event.data.object as Stripe.Subscription;
        await handleSubscriptionChange(subscription);
        break;
      default:
        console.log(`Unhandled event type ${event.type}`);
    }

    res.json({ received: true });
  }
);

async function handleSubscriptionChange(subscription: Stripe.Subscription) {
  try {
    const customer = await stripe.customers.retrieve(
      subscription.customer as string
    );
    if ("deleted" in customer) {
      console.log("Customer has been deleted");
      return;
    }

    const isPremium =
      subscription.status === "active" || subscription.status === "trialing";

    console.log(
      `Updating user status for email ${customer.email} to premium: ${isPremium}`
    );

    const updatedUser = await User.findOneAndUpdate(
      { email: customer.email },
      { $set: { isPremium: isPremium } },
      { new: true }
    );

    if (updatedUser) {
      console.log(
        `Updated user ${updatedUser.email} premium status to ${isPremium}`
      );
    } else {
      console.log(`No user found with email: ${customer.email}`);
    }
  } catch (error) {
    console.error("Error updating user premium status:", error);
  }
}

export default router;
