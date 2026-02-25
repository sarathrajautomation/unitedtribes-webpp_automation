import { test, expect } from "@playwright/test";
import { LoginPage } from "../pages/LoginPage";
import { log } from "node:console";
import { Feeds } from "../pages/Feeds";

test.describe("Feeds Module ", () => {
  test("Verify user can able to create a feed", async ({ page }) => {
    const loginPage = new LoginPage(page);
    const feeds = new Feeds(page);
    await loginPage.goto();
    await loginPage.login("will@mailinator.com", "P");
    await feeds.checkFeedCreation();
  });
});
