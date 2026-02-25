import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "./tests",

  /* Global timeout for each test */
  timeout: 100000,

  /* Run tests inside a file sequentially */
  fullyParallel: false,

  /* Fail build if test.only is left in code (CI protection) */
  forbidOnly: !!process.env.CI,

  /* Retry failed tests only in CI */
  retries: process.env.CI ? 2 : 0,

  /* Use single worker in CI for stability */
  workers: process.env.CI ? 1 : undefined,

  /* Test reporters */
  reporter: [
    ["list"],
    ["html", { open: "never" }]
  ],

  /* Shared settings for all projects */
  use: {
    /* Base URL (IMPORTANT: domain only) */
    baseURL: "https://unitedtribes.techcedence.net",

    /* Run in headless mode */
    headless: true,

    /* Collect trace on first retry */
    trace: "on-first-retry",

    /* Screenshot on failure */
    screenshot: "only-on-failure",

    /* Record video on failure */
    video: "retain-on-failure",

    /* Global action & navigation timeouts */
    actionTimeout: 100000,
    navigationTimeout: 100000,

    /* Geolocation setup */
    geolocation: {
      latitude: 37.7749,
      longitude: -122.4194,
    },

    /* Allow geolocation permission */
    permissions: ["geolocation"],
  },

  /* Browser projects */
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },

    // Uncomment if needed
    // {
    //   name: "firefox",
    //   use: { ...devices["Desktop Firefox"] },
    // },
    // {
    //   name: "webkit",
    //   use: { ...devices["Desktop Safari"] },
    // },
  ],

  /* Optional: Run dev server before tests */
  /*
  webServer: {
    command: "npm run start",
    url: "http://localhost:3000",
    reuseExistingServer: !process.env.CI,
  },
  */
});