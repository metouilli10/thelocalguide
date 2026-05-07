const Stripe = require("stripe");

let stripeClient;

function getStripe() {
  if (!process.env.STRIPE_SECRET_KEY) {
    throw new Error("Missing STRIPE_SECRET_KEY environment variable");
  }

  if (!stripeClient) {
    stripeClient = new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: "2026-02-25.clover"
    });
  }

  return stripeClient;
}

module.exports = {
  getStripe
};
