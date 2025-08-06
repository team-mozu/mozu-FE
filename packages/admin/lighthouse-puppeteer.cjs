require("dotenv").config();

module.exports = async browser => {
  const LOGIN_ID = process.env.TEST_ID;
  const LOGIN_PASSWORD = process.env.TEST_PW;
  const BASE_URL = "http://admin.localhost:3002";

  if (!LOGIN_ID || !LOGIN_PASSWORD) {
    console.error("Error: TEST_ID and TEST_PW environment variables must be set.");
    process.exit(1);
  }

  console.log("--- Puppeteer Login Script Started ---");
  const page = await browser.newPage();

  try {
    console.log(`Navigating to login page: ${BASE_URL}/signin`);
    await page.goto(`${BASE_URL}/signin`, {
      waitUntil: "networkidle2",
    });

    console.log("Entering credentials...");
    await page.type('input[type="text"], input[name="code"]', LOGIN_ID);
    await page.type('input[type="password"], input[name="password"]', LOGIN_PASSWORD);

    console.log("Submitting login form...");
    await Promise.all([
      page.waitForNavigation({
        waitUntil: "networkidle2",
      }),
      page.click('button[type="submit"], .css-1r3ybrf'),
    ]);

    const finalUrl = page.url();
    console.log(`Login successful. Redirected to: ${finalUrl}`);

    if (!finalUrl.includes("class-management")) {
      console.warn("Warning: Did not redirect to class-management page as expected.");
    }
  } catch (error) {
    console.error("Error during puppeteer login script:", error);
    // 스크립트가 실패해도 Lighthouse가 계속 진행하도록 오류를 다시 던지지 않을 수 있습니다.
    // 또는 throw error; 를 사용하여 전체 프로세스를 중단시킬 수 있습니다.
    throw error;
  } finally {
    console.log("--- Puppeteer Login Script Finished ---");
    // 페이지를 닫지 마세요! Lighthouse가 이어서 사용해야 합니다.
    // await page.close();
  }
};
