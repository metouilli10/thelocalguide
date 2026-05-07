const { getStripe } = require("./_lib/stripe");
const { readRequestBody } = require("./_lib/request");

async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    res.status(405).end("Method not allowed");
    return;
  }

  const signature = req.headers["stripe-signature"];
  if (!signature || !process.env.STRIPE_WEBHOOK_SECRET) {
    res.status(400).end("Missing webhook configuration");
    return;
  }

  try {
    const stripe = getStripe();
    const rawBody = await readRequestBody(req);
    const event = stripe.webhooks.constructEvent(
      rawBody,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET
    );

    if (event.type === "checkout.session.completed") {
      const session = event.data.object;

      console.log("Paid booking received", {
        sessionId: session.id,
        amountTotal: session.amount_total,
        currency: session.currency,
        customerEmail: session.customer_details && session.customer_details.email,
        metadata: session.metadata
      });
    }

    res.status(200).json({ received: true });
  } catch (error) {
    console.error("stripe-webhook failed", error);
    res.status(400).end(`Webhook error: ${error.message}`);
  }
}

module.exports = handler;
module.exports.config = {
  api: {
    bodyParser: false
  }
};
