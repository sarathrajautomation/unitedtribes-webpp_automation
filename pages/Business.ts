import { Page, expect } from "@playwright/test";
import path from "path";

export class Business {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  async redirecToAddBusiness() {
    // 1️⃣ Ensure page is loaded
    await this.page.waitForLoadState("domcontentloaded");

    // 2️⃣ Click visible profile image
    await this.page.locator("img.topbar-prof-img:visible").click();

    // 3️⃣ Click "My Businesses"
    await this.page.getByText("My Businesses", { exact: true }).click();

    // 4️⃣ Click Add Business button
    await this.page.locator("#addBusinessBtn").click();
  }

  async createBusiness() {
    const modal = this.page.locator("app-my-business-modal");
    await expect(modal).toBeVisible();

    await this.fillBasicInfo();
    await this.selectBusinessCategory();
    await this.selectBusinessType();
    await this.fillPhoneNumber();
    await this.selectTribe();
    await this.addMedia();
    await this.addBusinessDetails();
    await this.setupBusinessHours();
    await this.submitBusiness();
  }

  private async fillBasicInfo() {
    await this.page.getByLabel("Business Name").fill("Maria's Authentic Tacos");
    await this.page.getByLabel("Email").fill("maria@example.com");
    await this.page.getByLabel("Website").fill("https://www.mariastacos.com");
  }

  private async selectBusinessCategory() {
    const categorySelect = this.page.locator("ng-select[formcontrolname='businessCategory']");
    await categorySelect.click();
    await categorySelect.locator("input[type='text']").fill("Restaurant");
    await this.page.locator(".ng-option").filter({ hasText: "Restaurant" }).click();
  }

  private async selectBusinessType() {
    await this.page.locator("label[for='true']").click();
  }

  private async fillPhoneNumber() {
    await this.page.locator('#mobileNo').fill('(415) 555-0132');
  }

  private async selectTribe() {
    await this.page.keyboard.press("PageDown");
    const tribeSelect = this.page
      .locator("ng-select")
      .filter({ hasText: "Select Tribe" })
      .locator("#heroId");
    await tribeSelect.click();
    await this.page.locator("//span[normalize-space(text())='India']").click();
  }

  private async addMedia() {
    const mediaSection = this.page.locator(
      "//span[normalize-space(text())='Media and Additional Details']"
    );
    await expect(mediaSection).toBeVisible();
    await mediaSection.click();
this.page.waitForTimeout(3000); // Wait for media section to expand
    const image = this.page.locator(
      "//span[contains(@class,'avatar-icon rounded-circle')]"
    );
    await expect(image).toBeVisible();
    const filePath = path.join(__dirname, "..", "insurance~.png");
    await this.page.setInputFiles(
      "//span[contains(@class,'avatar-icon rounded-circle')]",
      filePath
    );
    await this.page.locator("//button[normalize-space(text())='Submit']").click();
  }

  private async addBusinessDetails() {
    const additional = this.page.locator(
      "//label[text()='Additional Details *']/following::textarea"
    );
    await expect(additional).toBeVisible();
    await additional.fill("Accounting Services");

    const price = this.page.locator("#priceTier");
    await expect(price).toBeVisible();
    await price.fill("$");
    await this.page.keyboard.press("Enter");
  }

  private async setupBusinessHours() {
    await this.page.getByRole("button", { name: "Add Business Hours" }).click();
    await this.page.locator("(//div[@class='ng-input']//input)[2]").click();
    await this.page.locator("#item-0").check();
    await this.page.locator('[id="24hr"]').check();
    await this.page.getByRole("button", { name: "Add Slot" }).click();
  }

  private async submitBusiness() {
    const saved = this.page.locator("//button[text()=' List My Business ']");
    await expect(saved).toBeVisible();
    await saved.click();
    await this.page.locator("(//img[@class='action-img'])[2]").click();
    await this.page.locator("//a[contains(@class,'btn ut-gold-bg-button')]").click();
  }
}
