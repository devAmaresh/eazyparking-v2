import express from 'express';
import Stripe from 'stripe';
import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

const router = express.Router({
  caseSensitive: true,
  strict: true,
});

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const BACKEND_URL = process.env.BACKEND_URL;

router.post(
  '/',
  express.raw({ type: 'application/json' }), // Must be raw!
  async (req, res) => {
    const sig = req.headers['stripe-signature'];
    let event;

    try {
      event = stripe.webhooks.constructEvent(
        req.body, // raw body
        sig,
        process.env.STRIPE_WEBHOOK_SECRET
      );
    } catch (err) {
      console.error('❌ Signature verification failed:', err.message);
      return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    // Handle successful payment
    if (event.type === 'checkout.session.completed') {
      const session = event.data.object;

      const {
        token,
        userId,
        registrationNumber,
        vehicleCategory,
        parkingLotId,
        vehicleCompanyName,
        inTime,
      } = session.metadata;
      const paymentId  = session.payment_intent;

      try {
        await axios.post(`${BACKEND_URL}/api/user/book`, {
          userId,
          registrationNumber,
          vehicleCategory,
          parkingLotId,
          vehicleCompanyName,
          inTime,
          paymentId
        },
        {
            headers: {
              Authorization: `Bearer ${token}`,
            }});

      } catch (err) {
        console.error('❌ Booking failed after payment:', err.message);
      }
      res.sendStatus(200);
    }
    else{
        console.log(`Unhandled event type ${event.type}`);
        res.sendStatus(200); // Acknowledge receipt of the event
    }

  }
);

export default router;
