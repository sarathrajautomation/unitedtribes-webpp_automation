import { test, expect } from "@playwright/test";
import { Homepage } from "../pages/HomePage";
import { LoginPage } from "../pages/LoginPage";

test.describe("Homepage Tests", () => {
  test("Background Video Test", async ({ page }) => {
    const loginPage = new LoginPage(page);

    await loginPage.goto();
    await loginPage.login("will@mailinator.com", "P");

    //await expect(page).toHaveURL("https://unitedtribes.techcedence.net/");
    const homepage = new Homepage(page);
    await homepage.checkVideoPlaying();
  });
});
