import { Page, expect } from "@playwright/test";

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
    await this.page.locator('.color-theme-img').click();
    await this.page.locator('textarea[formcontrolname="description"]').fill("My image feed caption");
    
  }
  async checkLikeAndComment() {
    // Implement like and comment steps
  }

  async checkFeedDeletion() {
    // Implement deletion steps
  }
}
