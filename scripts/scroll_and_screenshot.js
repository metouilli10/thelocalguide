const puppeteer = require('puppeteer');

(async () => {
  const targetUrl = process.argv[2] || 'http://127.0.0.1:3000/tours/day-trip-marrakech-from-agadir.html';
  const outputPath = process.argv[3] || 'urgency-badge-styled.png';
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 800 });
  await page.goto(targetUrl, { waitUntil: 'load' });
  
  // Scroll to make the booking sidebar visible
  await page.evaluate(() => {
    window.scrollTo(0, 800);
  });
  
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  // Take screenshot of the booking sidebar
  const element = await page.$('.booking-sidebar');
  if (element) {
    await element.screenshot({ path: outputPath });
    console.log(`Screenshot saved as ${outputPath}!`);
  } else {
    console.log('Booking sidebar not found');
  }
  
  await browser.close();
})();
