import { test, expect } from "@playwright/test";
import { LoginPage } from "../pages/LoginPage";
import { Event } from "../pages/Event";

test.describe("Event Modules", () => {
  test("Verify user can create and delete an event successfully", async ({
    page,
  }) => {
    const loginPage = new LoginPage(page);
    //const common = new Common(page);

    await loginPage.goto();
    await loginPage.login("will@mailinator.com", "P");

    const event = new Event(page);

    //  await event.redirectToAddEvent();
    await event.createEvent();
  });
});
