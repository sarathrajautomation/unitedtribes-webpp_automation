import { test, expect } from "@playwright/test";
import { LoginPage } from "../pages/LoginPage";

test.describe("Login Tests", () => {
  test("Valid Login", async ({ page }) => {
    const loginPage = new LoginPage(page);

    await loginPage.goto();
    await loginPage.login("will@mailinator.com", "P");

   // await expect(page).toHaveURL("https://unitedtribes.techcedence.net/");
  });

  test("Invalid Login", async ({ page }) => {
    const loginPage = new LoginPage(page);

    await loginPage.goto();
    await loginPage.login("will@mailinator.com", "invalidpassword");

    await expect(loginPage.invalidLoginMessage).toBeVisible();
  });
});
