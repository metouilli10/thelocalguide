const { getStripe } = require("./_lib/stripe");
const { getTourBySlug } = require("./_lib/tours");
const { readJsonBody } = require("./_lib/request");

function json(res, status, body) {
  res.status(status).setHeader("Content-Type", "application/json");
  res.end(JSON.stringify(body));
}

module.exports = async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return json(res, 405, { error: "Method not allowed" });
  }

  try {
    const {
      tourSlug,
      bookingDate,
      travelers,
      customerName,
      customerEmail,
      customerPhone,
      hotelName,
      notes
    } = await readJsonBody(req);

    const tour = getTourBySlug(tourSlug, { instantBookingOnly: true });
    if (!tour) {
      return json(res, 400, { error: "Unknown tour selected." });
    }

    const travelerCount = Number.parseInt(travelers, 10);
    if (!Number.isInteger(travelerCount) || travelerCount < 1 || travelerCount > 12) {
      return json(res, 400, { error: "Traveler count must be between 1 and 12." });
    }

    if (!bookingDate || !customerName || !customerEmail || !customerPhone) {
      return json(res, 400, { error: "Missing required booking details." });
    }

    const origin = req.headers.origin || process.env.SITE_URL;
    if (!origin) {
      return json(res, 500, { error: "SITE_URL is not configured." });
    }

    const stripe = getStripe();
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      billing_address_collection: "auto",
      customer_email: customerEmail,
      success_url: `${origin}/booking-success.html?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/booking-cancelled.html?tour=${encodeURIComponent(tour.slug)}`,
      line_items: [
        {
          price_data: {
            currency: tour.currency,
            product_data: {
              name: tour.name,
              description: `${tour.duration} • ${tour.pickup}`
            },
            unit_amount: Math.round(tour.price * 100)
          },
          quantity: travelerCount
        }
      ],
      metadata: {
        tour_slug: tour.slug,
        tour_name: tour.name,
        booking_date: bookingDate,
        travelers: String(travelerCount),
        customer_name: customerName,
        customer_email: customerEmail,
        customer_phone: customerPhone,
        hotel_name: hotelName || "",
        notes: notes || ""
      },
      payment_intent_data: {
        metadata: {
          tour_slug: tour.slug,
          booking_date: bookingDate,
          travelers: String(travelerCount),
          customer_name: customerName,
          customer_phone: customerPhone
        }
      }
    });

    return json(res, 200, { url: session.url });
  } catch (error) {
    console.error("create-checkout-session failed", error);
    return json(res, 500, { error: "Unable to create checkout session." });
  }
};
