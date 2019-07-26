const puppeteer = require('puppeteer');

(async () => {
  const host = 'https://insight-lab.zac.ai/insight-lab/';
  const url_logon = host + 'User/user_logon.asp';
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto(url_logon);
  await page.screenshot({path: 'screenshot.png'});

  await browser.close();
})();