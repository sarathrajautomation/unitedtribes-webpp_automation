import { Locator, Page } from "playwright/test";

export class Common {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  async redirectToAddBusiness() {
    await this.page.locator(".topbar-prof-img").click();
    await this.page.getByText("My Businesses").click();
    await this.page.locator("#addBusinessBtn").click();
  }
}
