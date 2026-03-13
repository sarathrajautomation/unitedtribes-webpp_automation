import { Page, expect } from "@playwright/test";

import path from "path/win32";

export class Feeds {
  constructor(private page: Page) {}

  async redirectToAddFeed() {
    await this.page.waitForLoadState("domcontentloaded");

    // 2️⃣ Click visible profile image
    await this.page.locator("img.topbar-prof-img:visible").click();

    // 3️⃣ Click "My Businesses"
    await this.page.getByText("My Pulse", { exact: true }).click();

    const myPulse = this.page.getByText("My Pulse", { exact: true });
    await expect(myPulse).toBeVisible();
    await myPulse.click();
  }

  async checkFeedCreation() {
    await this.redirectToAddFeed();
    await this.page.goto("https://unitedtribes.techcedence.net/pulse", {
      waitUntil: "domcontentloaded",
    });
    await this.page.getByText("What's on your mind?").click();
    await this.page
      .locator('textarea[formcontrolname="textData"]')
      .fill("My automated feed post");
    const postBtn = this.page.locator(
      'button.feed-tribe-filter-btn:has-text("Post")',
    );

    await expect(postBtn).toBeVisible();
    await expect(postBtn).toBeEnabled();
    await postBtn.click();
    await this.templateFeedCreation();
  }

  async templateFeedCreation() {
    await this.redirectToAddFeed();
    await this.page.goto("https://unitedtribes.techcedence.net/pulse", {
      waitUntil: "domcontentloaded",
    });
    await this.page.getByText("What's on your mind?").click();
    await this.page.getByRole("img").nth(2).click();
    await this.page
      .locator('textarea[formcontrolname="description"]')
      .fill("My image feed caption");

    const postBtn = this.page.locator(
      'button.feed-tribe-filter-btn:has-text("Post")',
    );

    await expect(postBtn).toBeVisible();
    await expect(postBtn).toBeEnabled();
    await postBtn.click();
    await this.checkMediaUploadInFeeds();
  }

  async checkMediaUploadInFeeds() {
    await this.page.goto("https://unitedtribes.techcedence.net/pulse", {
      waitUntil: "domcontentloaded",
    });
    const filePath = path.join(__dirname, "..", "insurance~.png");
    await this.page.getByText("What's on your mind?").click();
    await this.page.locator("(//b[text()=' Upload Media '])[2]").click();
    await this.page.setInputFiles('input[type="file"]', filePath);

    await this.page.locator("//button[text()=' Post ']").click();
    await this.deleteFivePosts();
    // Implement like and comment steps
  }

  async deleteFivePosts() {
    await this.page.goto(
      "https://unitedtribes.techcedence.net/profile/my-pulse",
      { waitUntil: "domcontentloaded" },
    );

    for (let i = 0; i < 5; i++) {
      await this.page
        .locator("app-feed-card")
        .first()
        .locator(".fa-ellipsis-vertical")
        .click();

      await this.page.locator("i.bx-trash").locator("..").click();

      await this.page.getByRole("button", { name: "Delete" }).click();

      await this.page.waitForTimeout(1000);
    }
  }
}
