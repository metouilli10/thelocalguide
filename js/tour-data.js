(function (root, factory) {
  const tours = factory();

  if (typeof module === "object" && module.exports) {
    module.exports = tours;
  }

  root.TOUR_DATA = tours;
})(typeof globalThis !== "undefined" ? globalThis : this, function () {
  return [
    {
      slug: "paradise-valley",
      name: "Paradise Valley Tour",
      pagePath: "/tours/tour-paradise-valley-agadir-new.html",
      price: 25,
      currency: "eur",
      duration: "4-5 hours",
      pickup: "Hotel pickup included",
      tagline: "Natural pools, mountain views, and an easy half-day format.",
      instantBooking: true
    },
    {
      slug: "quad-biking",
      name: "Agadir Quad Biking Tour",
      pagePath: "/tours/tour-agadir-half-quad-biking-adventure.html",
      price: 40,
      currency: "eur",
      duration: "3 hours",
      pickup: "Hotel pickup included",
      tagline: "Half-day desert quad biking adventure with hotel pickup from Agadir.",
      instantBooking: true
    },
    {
      slug: "surf-lessons",
      name: "Surf Lesson in Taghazout",
      pagePath: "/tours/tour-surf-lessons-agadir.html",
      price: 45,
      currency: "eur",
      duration: "2 hours",
      pickup: "Free hotel pickup",
      tagline: "Beginner-friendly surf lesson with gear, instructor, and transport.",
      instantBooking: true
    },
    {
      slug: "morning-camel-ride",
      name: "Morning Camel Ride",
      pagePath: "/tours/tour-morning-camel-ride-agadir.html",
      price: 40,
      currency: "eur",
      duration: "2 hours",
      pickup: "Hotel pickup included",
      tagline: "Simple fixed-price morning ride with easy logistics.",
      instantBooking: true
    },
    {
      slug: "sunset-camel-ride",
      name: "Sunset Camel Ride in Agadir",
      pagePath: "/tours/tour-agadir-sunset-camel-ride.html",
      price: 40,
      currency: "eur",
      duration: "2 hours",
      pickup: "Hotel pickup included",
      tagline: "Popular sunset slot with a clear per-person price.",
      instantBooking: true
    },
    {
      slug: "cooking-class",
      name: "Cooking Class in Agadir",
      pagePath: "/tours/tour-cooking-class-agadir.html",
      price: 50,
      currency: "eur",
      duration: "Half day",
      pickup: "Venue details sent after booking",
      tagline: "Hands-on cooking class with a straightforward full-payment booking.",
      instantBooking: true
    },
    {
      slug: "city-tour-cable-car",
      name: "Agadir Guided City Tour with Cable Car",
      pagePath: "/tours/tour-agadir-guided-city-tour-cable-car.html",
      price: 25,
      currency: "eur",
      duration: "Half day",
      pickup: "Hotel pickup included",
      tagline: "Low-friction city tour that fits instant booking well.",
      instantBooking: true
    },
    {
      slug: "half-day-boat-trip",
      name: "Agadir Half Day Boat Trip",
      pagePath: "/tours/tour-agadir-half-day-boat-trip.html",
      price: 48,
      currency: "eur",
      duration: "Half day",
      pickup: "Marina meeting point",
      tagline: "Fixed-price boat trip with simple availability handling.",
      instantBooking: true
    },
    {
      slug: "marrakech-day-trip",
      name: "Marrakech Day Trip from Agadir",
      pagePath: "/tours/day-trip-marrakech-from-agadir-new.html",
      aliases: ["/tours/day-trip-marrakech-from-agadir.html"],
      price: 38,
      currency: "eur"
    },
    {
      slug: "essaouira-day-trip",
      name: "Essaouira Day Trip from Agadir",
      pagePath: "/tours/day-trip-essaouira-from-agadir-new.html",
      price: 30,
      currency: "eur"
    },
    {
      slug: "taroudant-day-trip",
      name: "Taroudant Day Trip from Agadir",
      pagePath: "/tours/day-trip-taroudant-from-agadir-new.html",
      aliases: ["/tours/day-trip-taroudant-from-agadir.html"],
      price: 45,
      currency: "eur"
    },
    {
      slug: "horse-riding",
      name: "Beach Horse Riding Experience",
      pagePath: "/tours/tour-horse-riding-agadir.html",
      price: 45,
      currency: "eur"
    },
    {
      slug: "sandboarding",
      name: "Sandboarding Sahara Dunes",
      pagePath: "/tours/tour-sandboarding-agadir.html",
      price: 60,
      currency: "eur"
    },
    {
      slug: "souss-massa",
      name: "Souss Massa National Park Tour",
      pagePath: "/tours/tour-souss-massa-park-agadir.html",
      price: 60,
      currency: "eur"
    },
    {
      slug: "buggy-adventure",
      name: "Buggy Adventure Agadir",
      pagePath: "/tours/tour-buggy-adventure-agadir.html",
      price: 60,
      currency: "eur"
    },
    {
      slug: "jet-ski",
      name: "Jet Ski Agadir",
      pagePath: "/tours/tour-jet-ski-agadir-new.html",
      price: 60,
      currency: "eur"
    },
    {
      slug: "moroccan-hammam",
      name: "Traditional Hammam in Agadir",
      pagePath: "/tours/tour-moroccan-hammam-agadir.html",
      price: 45,
      currency: "eur"
    }
  ];
});
