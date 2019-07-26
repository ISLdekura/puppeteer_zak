const puppeteer = require('puppeteer');
const fs = require('fs');

(async () => {
  const user_name = fs.readFileSync("user_name.txt", {encoding: "utf-8"});
  const user_secret = fs.readFileSync("user_secret.txt", {encoding: "utf-8"});

  const host = 'https://insight-lab.zac.ai/insight-lab/';
  const url_logon = host + 'User/user_logon.asp';
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();

  // login screen
  {
    await page.goto(url_logon);
    await page.type('input[name="user_name"]', user_name);
    await page.type('input[name="password"]', user_secret);
    // await page.$eval('input[name="user_name"]', el => el.value = user_name);
    // await page.$eval('input[name="password"]', el => el.value = user_secret);
    await page.screenshot({path: 'screenshot_login.png'});
    await page.click('#submit1')
  }
  
  // menu screen
  {
    await page.waitFor('img[class="logo-image"]', {timeout: 120000});
    await page.screenshot({path: 'screenshot_main.png'});
  }

  // nippou screen
  {
    await page.goto(host + '/b/asp/Shinsei/Nippou');
    await page.waitFor('iframe[id="classic_window"]', {timeout: 120000});
    const frame = await page.frames().find(f => f.name() === 'classic_window');
    await frame.waitFor('select[name="time_in_hour"]', {timeout: 120000});
    await frame.select('select[name="time_in_hour"]', '9');
    await frame.select('select[name="time_out_hour"]', '18');
    await frame.select('select[name="time_break_input_hour"]', '1');
    await page.screenshot({path: 'screenshot_nippou.png'});
    await frame.click('#button5');
  }

  // save form
  {
    const frame = await page.frames().find(f => f.name() === 'classic_window');
    await frame.waitFor('select[name="time_in_hour"]', {timeout: 120000});
    await page.screenshot({path: 'screenshot_nippou_saved.png'});
  }

  await browser.close();
})();