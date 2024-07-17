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
    const sig = req.headers["stripe-signature"] as string;
    let event: Stripe.Event;

    try {
      event = stripe.webhooks.constructEvent(
        req.body,
        sig,
        process.env.STRIPE_WEBHOOK_SECRET!
      );
    } catch (err: any) {
      return res.status(400).send(`Webhook Error: ${err.message}`);
    }

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
  const customerData = await stripe.customers.retrieve(
    subscription.customer as string
  );

  if (customerData.deleted) {
    console.log(`Customer has been deleted: ${subscription.customer}`);
    return;
  }

  const customer = customerData as Stripe.Customer;
  const user = await User.findOne({ email: customer.email });

  if (!user) {
    console.log(`No user found with email: ${customer.email}`);
    return;
  }

  user.isPremium =
    subscription.status === "active" || subscription.status === "trialing";
  user.subscriptionStatus = subscription.status;
  user.subscriptionEndDate = new Date(subscription.current_period_end * 1000);
  user.cancelAtPeriodEnd = subscription.cancel_at_period_end;

  // Check if this is a renewal
  if (
    subscription.status === "active" &&
    user.subscriptionEndDate > new Date()
  ) {
    console.log(`Subscription renewed for user ${user.email}`);
  }

  await user.save();
  console.log(
    `Updated subscription status for user ${user.email}. New end date: ${user.subscriptionEndDate}`
  );
}

export default router;
