import { Locator, Page } from "playwright/test";

export class Homepage {
  readonly page: Page;
  readonly isVideoPlaying: Locator;

  constructor(page: Page) {
    this.page = page;
    this.isVideoPlaying = page.locator("#bg-video");
  }

  async checkVideoPlaying() {
    await this.isVideoPlaying.evaluate((video: HTMLVideoElement) => {
      return !video.paused && !video.ended;
    });
  }
}
