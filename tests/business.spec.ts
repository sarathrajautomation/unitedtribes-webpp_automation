import { test, expect } from "@playwright/test";
import { LoginPage } from "../pages/LoginPage";
import { Business } from "../pages/Business";

test.describe("Business Tests", () => {
  test("Add Business", async ({ page }) => {
    const loginPage = new LoginPage(page);
    //const common = new Common(page);

    await loginPage.goto();
    await loginPage.login("will@mailinator.com", "P");

    const business = new Business(page);

    await business.redirecToAddBusiness();
    await business.createBusiness();
  });
});
