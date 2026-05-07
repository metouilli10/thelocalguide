const path = require("path");

const toursPath = path.join(process.cwd(), "js", "tour-data.js");
const tours = require(toursPath);

function getTours(options = {}) {
  if (options.instantBookingOnly) {
    return tours.filter((tour) => tour.instantBooking);
  }

  return tours;
}

function getTourBySlug(slug, options = {}) {
  return getTours(options).find((tour) => tour.slug === slug) || null;
}

module.exports = {
  getTours,
  getTourBySlug
};
