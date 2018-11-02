"use strict";

require("dotenv").config();

const pup = require("puppeteer");

const MIZRACHI_LOGIN_URL =
  "https://www.mizrahi-tefahot.co.il/he/bank/Pages/Default.aspx";
const MIZRACHI_PASSWORD_SELECTOR = "#ctl00_PlaceHolderLogin_ctl00_tbPassword";
const MIZRACHI_USERNAME_SELECTOR = "#ctl00_PlaceHolderLogin_ctl00_tbUserName";
const MIZRACHI_USERNAME = process.env.USERNAME;
const MIZRACHI_PASSWORD = process.env.PASSWORD;

const getMizrachiBalance = async () => {
  try {
    const browser = await pup.launch({
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
      headless: process.env.HEADLESS
    });
    const page = await browser.newPage();

    await page.goto(MIZRACHI_LOGIN_URL);
    await page.type(MIZRACHI_USERNAME_SELECTOR, MIZRACHI_USERNAME);
    await page.type(MIZRACHI_PASSWORD_SELECTOR, MIZRACHI_PASSWORD);
    await page.click("#ctl00_PlaceHolderLogin_ctl00_Enter");

    await page.waitForSelector(".sky-account-balance", {
      timeout: 500 * 1000
    });

    const balance = await page.evaluate(() =>
      document
        .querySelector(".sky-big3 .green")
        .getAttribute("miz-numeric-colorup")
    );

    console.log(`===== balance ${balance} =====`);

    await browser.close();

    return balance;
  } catch (error) {
    console.error(`mizrachi error ${error}`);
  }
};

getMizrachiBalance();
