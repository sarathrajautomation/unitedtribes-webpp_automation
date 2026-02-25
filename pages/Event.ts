import { Page, expect } from "@playwright/test";
import path from "path";

export class Event {
  constructor(private page: Page) {}

  // ==========================================================
  // Navigate to Add Event (Angular Safe Version)
  // ==========================================================
  async redirectToAddEvent() {
    // Click profile image
    const profileImg = this.page
      .locator("(//img[@class='topbar-prof-img'])[2]")
      .first();
    await profileImg.click();

    // Click My Events
    const myEvents = this.page.getByText("My Events", { exact: true });
    //  await expect(myEvents).toBeVisible();
    await myEvents.click();

    // Wait for Angular route OR container
    //  await this.page.waitForLoadState("networkidle");

    // Wait for My Events container
    const myEventsContainer = this.page.locator("app-my-events");
    await expect(myEventsContainer).toBeVisible();

    // Now wait for Add Event button inside container
    const addBtn = myEventsContainer.locator("#addEventsBtn");
    await expect(addBtn).toBeVisible();

    await addBtn.click();
  }

  // ==========================================================
  // Create Event Flow
  // ==========================================================
  async createEvent() {
    await this.redirectToAddEvent();

    // const modal = this.page.locator("app-my-event-modal");
    // await expect(modal).toBeVisible({ timeout: 15000 });
    await this.selectGoogleLocation("Los Angeles");
    await this.fillBasicInfo();
    await this.selectEventCategory();
    await this.selectTimezone();
    await this.fillEndTime();

    await this.selectTribe();
    await this.submitEvent();
  }

  // ==========================================================
  // Basic Info
  // ==========================================================
  private async fillBasicInfo() {
    await this.page.locator("//div[@class='remove-button']//img[1]").click(); // Clear location for next test run
    await this.page.locator("label[for='false']").click();

    await this.page.locator("#name").fill("Community Gathering");
    await this.page.locator("#mobileNo").fill("4155550100");
    await this.page
      .locator("#website")
      .fill("https://unitedtribes.techcedence.net/");
    await this.page.locator("#ticket_link").fill("https://tickets.example.com");
  }

  // ==========================================================
  // Event Category (ng-select Safe)
  // ==========================================================
  private async selectEventCategory() {
    const category = this.page.locator(
      "ng-select[formcontrolname='eventCategory']",
    );

    await category.click();

    const option = this.page.locator(".ng-option", {
      hasText: "Business",
    });

    await expect(option).toBeVisible();
    await option.click();
  }

  // ==========================================================
  // Timezone (ng-select Safe)
  // ==========================================================
  private async selectTimezone() {
    const timezone = this.page.locator("ng-select[formcontrolname='timezone']");

    await timezone.click();

    const input = timezone.locator("input[role='combobox']");
    await input.fill("PST");

    const option = this.page.locator(".ng-option", {
      hasText: "PST",
    });

    await expect(option).toBeVisible();
    await option.click();
  }

  // ==========================================================
  // End Time
  // ==========================================================
  private async fillEndTime() {
    const endTime = this.page.locator("input[placeholder='End Time']").first(); // avoid strict mode

    await endTime.waitFor({ state: "visible" });

    await endTime.click();
    await endTime.press("Control+A");
    await endTime.press("Delete");
    await endTime.type("10:00 PM");
    await endTime.press("Enter");
  }

  // ==========================================================
  // Google Location (Stable Angular Version)
  // ==========================================================
  private async selectGoogleLocation(location: string) {
    const input = this.page.getByPlaceholder("Search location").first();

    await expect(input).toBeVisible();

    await input.click();
    await input.fill(location);

    // Wait until Google suggestions are attached (NOT visible)
    await this.page.waitForFunction(() => {
      return document.querySelectorAll(".pac-item").length > 0;
    });

    // Select first suggestion via keyboard (MOST STABLE)
    await input.press("ArrowDown");
    await input.press("Enter");
  }

  // ==========================================================
  // Tribe Select
  // ==========================================================
  private async selectTribe() {
    const tribe = this.page.locator("ng-select[formcontrolname='tribe']");

    await tribe.click();

    const input = tribe.locator("input[role='combobox']");
    await input.fill("India");

    const option = this.page.locator(".ng-option", {
      hasText: "India",
    });

    await expect(option).toBeVisible();
    await option.click();
    await this.page.locator("//button[text()='Next']").click();
  }

  // ==========================================================
  // Submit Event
  // ==========================================================
  private async submitEvent() {
    //  await this.page.waitForTimeout(3000);

    // Upload Media
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

    await this.page.locator("//button[text()='Next']").click();

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

    await this.page.locator("//button[text()=' Submit ']").click();
    await this.deleteEvent();

    // const firstRow = this.page.locator("tbody tr").first();
    // await expect(firstRow).toBeVisible({ timeout: 20000 });

    // Wait until row disappears
    // await expect(firstRow).not.toBeVisible();
  }

  // ==========================================================
  // Delete Event
  // ==========================================================
  private async deleteEvent() {
    await this.sleep(3000);
    await this.page
      .locator("tbody tr")
      .first()
      .locator("img[src*='delete.svg']")
      .click();
    // Confirm delete
    const popup = this.page.locator("div.w-100");
    await popup.getByRole("button", { name: "Ok" }).click();
  }

  // ==========================================================
  // Sleep Helper
  // ==========================================================
  private sleep(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}
