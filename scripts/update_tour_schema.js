const fs = require("fs");
const path = require("path");

const ROOT = process.cwd();
const TOURS_DIR = path.join(ROOT, "tours");

const LOCAL_BUSINESS = {
  "@type": "LocalBusiness",
  "@id": "https://agadirlocalguide.com/#localbusiness",
  name: "Agadir Local Guide",
  alternateName: "The Local Guide Morocco",
  description:
    "Professional tour operator offering authentic experiences in Agadir, Morocco. From desert adventures to coastal explorations, we provide unforgettable tours across Morocco's stunning landscapes.",
  url: "https://agadirlocalguide.com",
  logo: "https://agadirlocalguide.com/img/alg%20logo.png",
  image: "https://agadirlocalguide.com/img/blog/top-10-things-to-do-agadir-2026-hero.webp",
  telephone: "+212700006462",
  email: "info@agadirlocalguide.com",
  address: {
    "@type": "PostalAddress",
    addressLocality: "Agadir",
    addressRegion: "Souss-Massa",
    addressCountry: "MA",
  },
  geo: {
    "@type": "GeoCoordinates",
    latitude: "30.4278",
    longitude: "-9.5981",
  },
  openingHoursSpecification: [
    {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: [
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
        "Sunday",
      ],
      opens: "08:00",
      closes: "20:00",
    },
  ],
  priceRange: "EUR",
  paymentAccepted: "Cash, Credit Card, PayPal, Bank Transfer",
  currenciesAccepted: "EUR, MAD, USD",
};

function getTag(html, tag, attrMatcher) {
  const re = new RegExp(`<${tag}[^>]*>`, "gi");
  const tags = html.match(re) || [];
  return tags.find((candidate) => new RegExp(attrMatcher, "i").test(candidate)) || "";
}

function matchAttr(html, tag, attrMatcher, valueAttr = "content") {
  const tagHtml = getTag(html, tag, attrMatcher);
  if (!tagHtml) return "";
  return (
    tagHtml.match(new RegExp(`${valueAttr}=["']([^"']+)["']`, "i"))?.[1] || ""
  );
}

function stripHtml(text) {
  return text
    .replace(/<svg[\s\S]*?<\/svg>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/\s+/g, " ")
    .trim();
}

function escapeRegex(text) {
  return text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function getExistingTourName(html) {
  const touristTrip = html.match(
    /"@type"\s*:\s*"TouristTrip"[\s\S]{0,800}?"name"\s*:\s*"([^"]+)"/
  );
  if (touristTrip) return touristTrip[1];

  const product = html.match(
    /"@type"\s*:\s*"Product"[\s\S]{0,800}?"name"\s*:\s*"([^"]+)"/
  );
  if (product) return product[1];

  const title = html.match(/<title>([^<]+)<\/title>/i)?.[1] || "";
  return title.split("|")[0].trim();
}

function getOfferPrice(html) {
  return html.match(/"price"\s*:\s*"([^"]+)"/)?.[1] || "";
}

function getAggregateRating(html) {
  const ratingValue =
    html.match(/"ratingValue"\s*:\s*("?[\d.]+")/)?.[1]?.replace(/"/g, "") ||
    html.match(/<div class="score-number">\s*([\d.]+)\s*<\/div>/)?.[1] ||
    "";
  const reviewCount =
    html.match(/"reviewCount"\s*:\s*("?[\d,]+")/)?.[1]?.replace(/"/g, "") ||
    html.match(/>\s*([\d,]+)\s+reviews\s*</i)?.[1] ||
    "";

  if (!ratingValue || !reviewCount) return null;

  return {
    "@type": "AggregateRating",
    ratingValue,
    reviewCount: reviewCount.replace(/,/g, ""),
    bestRating: "5",
    worstRating: "1",
  };
}

function getFaqs(html) {
  const sectionMatch = html.match(
    /<section[^>]+id=["']faq["'][\s\S]*?<\/section>/i
  );
  if (!sectionMatch) return [];

  const faqs = [];
  const faqRegex =
    /<div class=["']faq-item["'][\s\S]*?<button class=["']faq-question["'][\s\S]*?>([\s\S]*?)<\/button>[\s\S]*?<div class=["']faq-answer-content["']>([\s\S]*?)<\/div>/gi;
  let match;
  while ((match = faqRegex.exec(sectionMatch[0]))) {
    const question = stripHtml(match[1]);
    const answer = stripHtml(match[2]);
    if (question && answer) {
      faqs.push({ question, answer });
    }
  }
  return faqs;
}

function getReviews(html) {
  const sectionMatch = html.match(
    /<section[^>]+id=["']reviews["'][\s\S]*?<\/section>/i
  );
  if (!sectionMatch) return [];

  const reviews = [];
  const reviewRegex =
    /<div class=["']review-card["'][\s\S]*?<h5>([\s\S]*?)<\/h5>[\s\S]*?<div class=["']reviewer-stars["']>([\s\S]*?)<\/div>[\s\S]*?<p[^>]*>([\s\S]*?)<\/p>/gi;
  let match;
  while ((match = reviewRegex.exec(sectionMatch[0]))) {
    const author = stripHtml(match[1]);
    const stars = stripHtml(match[2]).replace(/[^★]/g, "").length || 5;
    const body = stripHtml(match[3]);
    if (author && body) {
      reviews.push({ author, stars, body });
    }
  }
  return reviews;
}

function buildFaqSchema(pageUrl, faqs) {
  return {
    "@type": "FAQPage",
    "@id": `${pageUrl}#faq`,
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };
}

function getPrimaryReviewedType(html) {
  if (/"@type"\s*:\s*"Product"/.test(html)) return "Product";
  return "TouristTrip";
}

function buildReviewSchemas(pageUrl, tripName, reviews, reviewedType) {
  return reviews.map((review, index) => ({
    "@type": "Review",
    "@id": `${pageUrl}#review-${index + 1}`,
    author: {
      "@type": "Person",
      name: review.author,
    },
    itemReviewed: {
      "@type": reviewedType,
      name: tripName,
      url: pageUrl,
    },
    reviewRating: {
      "@type": "Rating",
      ratingValue: String(review.stars),
      bestRating: "5",
      worstRating: "1",
    },
    reviewBody: review.body,
    publisher: {
      "@id": "https://agadirlocalguide.com/#localbusiness",
    },
  }));
}

function buildTouristTrip(pageUrl, name, description, image, price, aggregateRating) {
  const touristTrip = {
    "@type": "TouristTrip",
    "@id": `${pageUrl}#tour`,
    name,
    description,
    image,
    url: pageUrl,
    tourBookingPage: pageUrl,
    provider: {
      "@id": "https://agadirlocalguide.com/#localbusiness",
    },
  };

  if (price) {
    touristTrip.offers = {
      "@type": "Offer",
      price,
      priceCurrency: "EUR",
      availability: "https://schema.org/InStock",
      url: pageUrl,
    };
  }

  if (aggregateRating) {
    touristTrip.aggregateRating = aggregateRating;
  }

  return touristTrip;
}

function buildProduct(pageUrl, name, description, image, price, aggregateRating) {
  const product = {
    "@type": "Product",
    "@id": `${pageUrl}#product`,
    name,
    description,
    image,
    brand: {
      "@type": "Brand",
      name: "Agadir Local Guide",
    },
    url: pageUrl,
  };

  if (price) {
    product.offers = {
      "@type": "Offer",
      price,
      priceCurrency: "EUR",
      availability: "https://schema.org/InStock",
      url: pageUrl,
    };
  }

  if (aggregateRating) {
    product.aggregateRating = aggregateRating;
  }

  return product;
}

function buildGraph(html, pageUrl) {
  const tripName = getExistingTourName(html);
  const description = matchAttr(html, "meta", 'name=["\']description["\']');
  const image = matchAttr(html, "meta", 'property=["\']og:image["\']');
  const price = getOfferPrice(html);
  const aggregateRating = getAggregateRating(html);
  const faqs = getFaqs(html);
  const reviews = getReviews(html);
  const graph = [{ ...LOCAL_BUSINESS }];
  const hasProduct = /"@type"\s*:\s*"Product"/.test(html);

  if (!/"@type"\s*:\s*"TouristTrip"/.test(html)) {
    graph.push(
      buildTouristTrip(pageUrl, tripName, description, image, price, aggregateRating)
    );
  }

  if (!hasProduct) {
    graph.push(
      buildProduct(pageUrl, tripName, description, image, price, aggregateRating)
    );
  }

  if (faqs.length) {
    graph.push(buildFaqSchema(pageUrl, faqs));
  }

  if (reviews.length) {
    graph.push(...buildReviewSchemas(pageUrl, tripName, reviews, "Product"));
  }

  return graph;
}

function updateFile(fileName) {
  const filePath = path.join(TOURS_DIR, fileName);
  const html = fs.readFileSync(filePath, "utf8");
  const pageUrl = matchAttr(html, "link", 'rel=["\']canonical["\']', "href");
  if (!pageUrl) {
    throw new Error(`Missing canonical URL in ${fileName}`);
  }

  const existingManagedBlock = html.match(
    /\n<script type="application\/ld\+json">\n\{\n  "@context": "https:\/\/schema\.org",\n  "@graph": \[[\s\S]*?\n\}\n<\/script>/
  )?.[0];
  const sourceHtml = existingManagedBlock ? html.replace(existingManagedBlock, "") : html;
  const graph = buildGraph(sourceHtml, pageUrl);
  if (!graph.length) {
    return { fileName, changed: false };
  }

  const schemaBlock = `\n<script type="application/ld+json">\n${JSON.stringify(
    { "@context": "https://schema.org", "@graph": graph },
    null,
    2
  )}\n</script>`;

  let nextHtml = html;
  if (existingManagedBlock) {
    nextHtml = html.replace(existingManagedBlock, schemaBlock);
  } else {
    const ldJsonBlocks = [...html.matchAll(/<script type="application\/ld\+json">[\s\S]*?<\/script>/g)];
    const anchor = ldJsonBlocks.length
      ? ldJsonBlocks[ldJsonBlocks.length - 1][0]
      : '<link rel="icon" href="../img/alg%20logo.png">';
    nextHtml = html.replace(anchor, `${anchor}${schemaBlock}`);
  }

  if (nextHtml !== html) {
    fs.writeFileSync(filePath, nextHtml);
    return { fileName, changed: true, graphCount: graph.length };
  }

  return { fileName, changed: false };
}

const files = fs
  .readdirSync(TOURS_DIR)
  .filter((file) => file.endsWith(".html"))
  .sort();

for (const file of files) {
  const result = updateFile(file);
  console.log(
    `${result.changed ? "updated" : "skipped"}\t${result.fileName}${
      result.graphCount ? `\t${result.graphCount} graph nodes` : ""
    }`
  );
}
