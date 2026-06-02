import stripe from '../config/stripe.js';

export const createCheckoutSession = async ({
  lineItems,
  successUrl,
  cancelUrl,
  metadata,
  customerEmail,
}) => {
  return stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    mode: 'payment',
    line_items: lineItems,
    success_url: successUrl,
    cancel_url: cancelUrl,
    metadata,
    customer_email: customerEmail,
    currency: 'inr',
  });
};

export const createRefund = async (paymentIntentId, amount) => {
  return stripe.refunds.create({
    payment_intent: paymentIntentId,
    amount: amount ? Math.round(amount * 100) : undefined,
  });
};

export const constructWebhookEvent = (body, signature) => {
  return stripe.webhooks.constructEvent(
    body,
    signature,
    process.env.STRIPE_WEBHOOK_SECRET
  );
};
