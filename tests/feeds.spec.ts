import { test, expect } from "@playwright/test";
import { LoginPage } from "../pages/LoginPage";
import { log } from "node:console";
import { Feeds } from "../pages/Feeds";

test.describe("Feeds Module ", () => {
  test("Verify user can able to create a feed using text, image, ", async ({ page }) => {
    const loginPage = new LoginPage(page);
    const feeds = new Feeds(page);
    await loginPage.goto();
    await loginPage.login("vlmmani2000@gmail.com", "Mani1212@");
    await feeds.checkFeedCreation();
  });
});
