import { Page, expect } from "@playwright/test";
import path from "path";

export class Event {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  async redirectToAddEvent() {
    // 1️⃣ Ensure page is loaded
    await this.page.waitForLoadState("domcontentloaded");

    // 2️⃣ Click visible profile image
    await this.page.locator("img.topbar-prof-img:visible").click();

    // 3️⃣ Click "My Events"
    await this.page.getByText("My Events", { exact: true }).click();

    // 4️⃣ Click Add Event button
    await this.page.locator("#addEventsBtn").click();
  }

  async createEvent() {
    const modal = this.page.locator("app-my-event-modal");
    await expect(modal).toBeVisible();

    // Wait for form to be visible
    await this.page.locator("form").first().waitFor({ state: "visible" });

    await this.fillBasicInfo();
    await this.selectEventCategory();
    await this.fillEventDate();
    await this.fillEventTime();
    await this.fillEventLocation();
    await this.addMedia();

    await this.selectTribe();
    // await this.addEventDetails();
    await this.submitEvent();
  }

  private async fillBasicInfo() {
    // Wait a bit more for form to fully render

    await this.page.waitForLoadState("domcontentloaded");
    // Select event type (Physical) - click the label instead of hidden radio
    const physicalLabel = this.page.locator("label[for='false']");
    await physicalLabel.click();
    await this.page.waitForTimeout(500);

    // Fill event name
    const nameInput = this.page.locator("#name");
    await nameInput.fill("Community Gathering");

    // Fill mobile number
    const mobileInput = this.page.locator("#mobileNo");
    await mobileInput.fill("(415) 555-0100");

    // Fill website
    const websiteInput = this.page.locator("#website");
    await websiteInput.fill("https://unitedtribes.techcedence.net/");

    // Fill ticket link
    const ticketLink = this.page.locator("#ticket_link");
    await ticketLink.fill("https://tickets.example.com");
  }

  private async selectEventCategory() {
    await this.page.waitForTimeout(500);
    const categorySelect = this.page.locator(
      "ng-select[formcontrolname='eventCategory']",
    );
    await categorySelect.click();

    // Wait for dropdown to open

    // const input = categorySelect.locator("input[role='combobox']");
    // await input.click();

    // Wait for options to appear
    await this.page.waitForLoadState("domcontentloaded");
    const option = this.page
      .locator(".ng-option")
      .filter({ hasText: "Business" });
    // Wait for option to be visible
    await option.waitFor({ state: "visible", timeout: 20000 });
    await option.click();
  }

  private async fillEventDate() {
    await this.page.waitForLoadState("domcontentloaded");

    // Fill timezone
    const tzSelect = this.page.locator("ng-select[formcontrolname='timezone']");
    if (await tzSelect.locator("input").first().isVisible()) {
      await tzSelect.click();
      await this.page.waitForTimeout(300);
      const tzInput = tzSelect.locator("input[role='combobox']");
      await tzInput.fill("PST");
      await this.page.keyboard.press("Enter");
      await this.page.waitForTimeout(300);
    }
  }

  async fillEventTime() {
    await this.page.waitForLoadState("domcontentloaded");
    const endTime = this.page.locator("input[placeholder='End Time']");

    await endTime.waitFor({ state: "visible" });
    await endTime.click();
    await endTime.fill(""); // clear existing value
    await endTime.type("10:00 PM"); // type like real user
    await endTime.press("Enter"); // confirm selection
  }

  private async fillEventLocation() {
    // Wait for Google Places Autocomplete input to be visible.
    await this.page.keyboard.press("PageDown");
    await this.page.keyboard.press("PageDown");
    await this.page.keyboard.press("PageDown");
    await this.page.waitForTimeout(3000);
    await this.page.waitForLoadState("domcontentloaded");
    await this.page
      .getByRole("textbox", { name: "Search location" })
      .fill("Los Angeles");
    await this.page.waitForLoadState("domcontentloaded");

    await this.page.keyboard.press("ArrowDown");
    await this.page.keyboard.press("Enter");
  }

  private async addMedia() {
    // The media step is the second step in the modal wizard
    // This will be handled after clicking Next from the basic info step
    // Media upload section headers are shown in the left menu
    await this.page.waitForLoadState("domcontentloaded");
  }

  private async addEventDetails() {
    await this.page.waitForTimeout(500);
    // Select price type (Free) - use label to click
    const freeLabel = this.page.locator("label[for='price-1']");
    if (await freeLabel.isVisible()) {
      await freeLabel.click();
      await this.page.waitForTimeout(300);
    }

    // Note: Other advanced details like description, capacity, etc.
    // would be on subsequent steps/pages in the modal
  }

  private async selectTribe() {
    await this.page.waitForLoadState("domcontentloaded");
    await this.page.waitForTimeout(500);
    const tribeSelect = this.page.locator("ng-select[formcontrolname='tribe']");
    await tribeSelect.click();

    // Wait for dropdown to open
    await this.page.waitForTimeout(300);

    // Find and click the tribe option
    const tribeInput = tribeSelect.locator("input[role='combobox']");
    await tribeInput.fill("India");

    // Wait for option and click
    await this.page.waitForLoadState("domcontentloaded");
    const option = this.page.locator(".ng-option").filter({ hasText: "India" });
    await option.waitFor({ state: "visible", timeout: 5000 });
    await option.click();
  }

  private async submitEvent() {
    // Move to media step
    const nextBtn = this.page.getByRole("button", {
      name: "Next",
      exact: true,
    });
    if (await nextBtn.count()) {
      await expect(nextBtn.first()).toBeVisible();
      await nextBtn.first().click();
    }

    // Upload primary media file (prefer input[type=file])
    const filePath = path.join(__dirname, "..", "insurance~.png");
    const fileInput = this.page.locator('input[type="file"]');
    if ((await fileInput.count()) > 0) {
      await fileInput.first().setInputFiles(filePath);
    } else {
      // Fallback: click avatar element to reveal file input then set files
      const avatar = this.page.locator("span.avatar-icon.rounded-circle");
      if ((await avatar.count()) > 0) {
        await avatar.first().click();
        await this.page.waitForTimeout(300);
        const after = this.page.locator('input[type="file"]');
        if ((await after.count()) > 0)
          await after.first().setInputFiles(filePath);
      }
    }

    // Submit media if available
    const submitBtn = this.page.getByRole("button", { name: "Submit" });
    if ((await submitBtn.count()) && (await submitBtn.first().isVisible())) {
      await submitBtn.first().click();
    }

    // Advance to details step
    await this.page.waitForTimeout(500);
    if ((await nextBtn.count()) && (await nextBtn.first().isVisible()))
      await nextBtn.first().click();

    // Fill description fields (use resilient selectors)
    const descriptionText =
      "This is a test event description for the United Tribes platform.";
    const descLabel = this.page
      .locator('label:has-text("Event Description")')
      .first();
    if (await descLabel.count()) {
      const desc1 = descLabel.locator("xpath=following::textarea[1]");
      if ((await desc1.count()) > 0) await desc1.fill(descriptionText);
    }

    const textareas = this.page.locator("textarea");
    if ((await textareas.count()) >= 2) {
      await textareas
        .nth(1)
        .fill(descriptionText)
        .catch(() => {});
    }

    // Click Submit/save for final details
    if (await submitBtn.count()) {
      await expect(submitBtn.first()).toBeVisible();
      await submitBtn.first().click();
    }
    await this.page.waitForLoadState("domcontentloaded");
    // Post-save confirm (click action image then OK) if present
    const actionImgs = this.page.locator("img.action-img");
    // if ((await actionImgs.count()) >= 2) {
    //   await actionImgs.nth(1).click();
      const ok = this.page.getByRole("button", { name: "Ok" });
    //   if (await ok.count()) await ok.first().click();
    // }
    await this.page.waitForLoadState("domcontentloaded");

    // Fill address inputs if present (fallback behavior seen in tests)
    const addressInputs = this.page.locator("#address");
    if ((await addressInputs.count()) > 0) {
      await addressInputs
        .first()
        .fill("https://unitedtribes.com/profile/my-events");
      if ((await addressInputs.count()) > 1)
        await addressInputs
          .nth(1)
          .fill("https://unitedtribes.com/profile/my-events");
    }

    // Final submit if still present
    if (await submitBtn.count()) {
      await submitBtn
        .first()
        .click()
        .catch(() => {});
    }

    await this.page.waitForLoadState("domcontentloaded");
  }
}
