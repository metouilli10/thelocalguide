const { getStripe } = require("./_lib/stripe");

function json(res, status, body) {
  res.status(status).setHeader("Content-Type", "application/json");
  res.end(JSON.stringify(body));
}

module.exports = async function handler(req, res) {
  if (req.method !== "GET") {
    res.setHeader("Allow", "GET");
    return json(res, 405, { error: "Method not allowed" });
  }

  const sessionId = req.query.session_id;
  if (!sessionId) {
    return json(res, 400, { error: "Missing session_id." });
  }

  try {
    const stripe = getStripe();
    const session = await stripe.checkout.sessions.retrieve(sessionId);

    return json(res, 200, {
      customerName: session.metadata.customer_name,
      customerEmail: session.customer_details && session.customer_details.email,
      bookingDate: session.metadata.booking_date,
      travelers: session.metadata.travelers,
      hotelName: session.metadata.hotel_name,
      notes: session.metadata.notes,
      tourName: session.metadata.tour_name,
      amountTotal: session.amount_total,
      currency: session.currency,
      paymentStatus: session.payment_status
    });
  } catch (error) {
    console.error("checkout-session lookup failed", error);
    return json(res, 500, { error: "Unable to load booking details." });
  }
};
