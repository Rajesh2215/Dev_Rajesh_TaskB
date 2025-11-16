import express from "express";
import cors from "cors";
import { validateUrl } from "./utils/validateUrl.js";
import { fetchWithTimeout } from "./utils/timeout.js";
import { fetchPageData } from "./utils/fetchPageData.js";
import dotenv from "dotenv";
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.json());
app.use(cors());

app.get("/", (req, res) => {
  res.send("Hello from ESM + TypeScript!");
});

app.get("/api/scrape", async (req, res) => {
  try {
    const { url } = req.query;

    //Url validation
    const result = validateUrl(url);
    if (!result.valid) {
      return res.status(400).json({
        status: 400,
        error: result.message,
      });
    }

    // FETCH WITH TIMEOUT (20 seconds)
    const html = await fetchWithTimeout(fetchPageData(String(url)), 50000);

    if (!html) {
      return res.status(404).json({
        status: 404,
        error: "Unable to scrape content",
      });
    }

    return res.status(200).json({
      status: 200,
      html,
    });
  } catch (error: any) {
    console.log("❌ Scrape error:", error);

    // Timeout
    if (error?.message === "TIMEOUT") {
      return res.status(408).json({
        status: 408,
        error: "Scrape timed out after 20 seconds",
      });
    }

    return res.status(500).json({
      status: 500,
      error: error.message || "Internal server error",
    });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
