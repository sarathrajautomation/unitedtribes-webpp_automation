import { Page, Locator } from "@playwright/test";

export class LoginPage {
  readonly page: Page;
  readonly emailInput: Locator;
  readonly passwordInput: Locator;
  readonly loginButton: Locator;
  readonly invalidLoginMessage: Locator;

  constructor(page: Page) {
    this.page = page;
    this.emailInput = page.locator("#email");
    this.passwordInput = page.locator("#password");
    this.loginButton = page.getByRole("button", { name: "Login" });
    this.invalidLoginMessage = page.getByText("Invalid login credentials");
  }

  async goto() {
    await this.page.goto("https://unitedtribes.techcedence.net/login");
  }

  async login(email: string, password: string) {
    await this.emailInput.fill(email);
    await this.passwordInput.fill(password);
    await this.loginButton.click();
  }

  async getInvalidLoginMessage() {
    return await this.invalidLoginMessage.textContent();
  }
}
