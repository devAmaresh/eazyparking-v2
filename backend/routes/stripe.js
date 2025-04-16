import express from 'express';
import Stripe from 'stripe';
import dotenv from 'dotenv';
import auth from '../middlewares/auth.js';
import prisma from '../prisma/client.js';

dotenv.config();

const router = express.Router();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// createCheckoutSession.js
router.post('/create-checkout-session', auth , async (req, res) => {
    try{
        const token = req.headers.authorization.split(' ')[1];
        const userId = req.userId;
        const user = await prisma.user.findUnique({
            where: { id: userId },
            select: { firstName: true, lastName: true },
        });
        const { registrationNumber, vehicleCategory, parkingLotId, vehicleCompanyName, inTime } = req.body;
        const priceObj = await prisma.parkingLot.findUnique({
            where: { id: parkingLotId },
            select: { price: true,
                location: true,
             },
        });

        const price = priceObj.price;

        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            mode: 'payment',
            success_url: `${process.env.FRONTEND_URL}/bookings`,
            cancel_url: `${process.env.FRONTEND_URL}/bookings`,
            line_items: [
                {
                    price_data: {
                        currency: 'INR',
                        product_data: {
                            name: `Booking by ${user.firstName} ${user.lastName} for ${vehicleCompanyName} at ${priceObj.location}`,
                          },
                        unit_amount: price*100, // Stripe requires the amount to be in paisa
                    },
                    quantity: 1,
                },
            ],
            metadata: {
                token,
                userId,
                registrationNumber,
                vehicleCategory,
                parkingLotId,
                vehicleCompanyName,
                inTime,
            },
        });

      res.json({ id: session.id });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: error.message });
    }
  });

export default router;