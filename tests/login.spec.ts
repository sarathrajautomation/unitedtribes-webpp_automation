import { test, expect } from "@playwright/test";
import { LoginPage } from "../pages/LoginPage";

test.describe("Login Tests", () => {
  test("Verify user can login successfully", async ({ page }) => {
    const loginPage = new LoginPage(page);

    await loginPage.goto();
    await loginPage.login("will@mailinator.com", "P");

    // await expect(page).toHaveURL("https://unitedtribes.techcedence.net/");
  });

  test("Verify user cannot login with invalid credentials", async ({
    page,
  }) => {
    const loginPage = new LoginPage(page);

    await loginPage.goto();
    await loginPage.login("will@mailinator.com", "invalidpassword");

    await expect(loginPage.invalidLoginMessage).toBeVisible();
  });
});
