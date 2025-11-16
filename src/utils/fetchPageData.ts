import { chromium } from "playwright";

export async function fetchPageData(url: string) {
  const browser = await chromium.launch({ headless: true });

  try {
    const page = await browser.newPage();

    await page.goto(url, {
      waitUntil: "networkidle",
      timeout: 15000,
    });

    // Extract data inside the page context
    const data = await page.evaluate(() => {
      return {
        title: document.title || "N/A",
        metaDescription:
          document
            .querySelector("meta[name='description']")
            ?.getAttribute("content") || "N/A",
        h1:
          (document.querySelector("h1")?.innerText || "")
            .replace(/\s+/g, " ")
            .trim() || "N/A",
      };
    });

    return data;
  } catch (error: any) {
    const msg = error.message || "";

    if (msg.includes("ERR_NAME_NOT_RESOLVED") || msg.includes("ENOTFOUND")) {
      throw new Error("INVALID_URL");
    }

    if (msg.includes("Timeout") || msg.includes("timed out")) {
      throw new Error("TIMEOUT");
    }

    throw new Error("SCRAPE_ERROR");
  } finally {
    await browser.close();
  }
}
