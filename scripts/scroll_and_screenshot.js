const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 800 });
  await page.goto('file:///Users/macbookair/Desktop/local%20guide/day-trip-marrakech-from-agadir.html', { waitUntil: 'load' });
  
  // Scroll to make the booking sidebar visible
  await page.evaluate(() => {
    window.scrollTo(0, 800);
  });
  
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  // Take screenshot of the booking sidebar
  const element = await page.$('.booking-sidebar');
  if (element) {
    await element.screenshot({ path: 'urgency-badge-styled.png' });
    console.log('Screenshot saved as urgency-badge-styled.png!');
  } else {
    console.log('Booking sidebar not found');
  }
  
  await browser.close();
})();
