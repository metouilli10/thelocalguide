# Tour page v2 template

The Paradise Valley page at `tours/tour-paradise-valley-agadir-new.html` is the working example. Its layout is shared through `css/tour-page-v2.css` and `js/tour-page-v2.js`. `tour-page-v2-body.partial.html.txt` is the editable body pattern used to create it.

All 19 canonical tour pages now use this layout. The older Marrakech and Taroudant URLs are local redirect pages; Vercel also redirects those URLs to their canonical versions.

To make another tour page:

1. Copy the Paradise Valley HTML file to the new tour URL. Keep the shared stylesheet and script links.
2. Replace the title, description, canonical URL, Open Graph tags, and structured data in the `<head>` with facts for that tour.
3. Replace the visible title, subtitle, price, duration, rating, gallery, itinerary, inclusions, practical details, and FAQ in the body. Remove any rating or review count that cannot be verified.
4. Set `data-tour-name` and `data-whatsapp` on `<body>`. The date and guest controls will create a tour-specific WhatsApp availability request.
5. Use tour-specific images with descriptive alt text. The gallery buttons and lightbox are handled by the shared JavaScript.
6. Add or update the tour entry in `js/tour-data.js` so the shared price synchronizer stays accurate.
7. Review the page at desktop and mobile widths, and test the date, guest, gallery, menu, and WhatsApp actions.

For tours with multiple packages, add a `#tour-package` select to the booking form. Package cards can use `data-package-choice` links; the shared JavaScript includes the selected package in the WhatsApp request.

Keep the footer markup in the page and `tour-page-v2-body.partial.html.txt` aligned with the homepage footer. Tour-page footer links to homepage sections use `/#guides` and `/#reviews` so they work from `/tours/` URLs.

The pickup van thumbnail on the Paradise Valley page is an illustrative generated asset. Replace it with a real pickup photo before publishing if photographic accuracy matters.
