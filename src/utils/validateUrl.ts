export interface UrlValidationResult {
  valid: boolean;
  message?: string;
  url?: URL;
}

export function validateUrl(input: unknown): UrlValidationResult {
  if (!input || typeof input !== "string") {
    return {
      valid: false,
      message: "Missing or invalid 'url' query parameter.",
    };
  }

  let parsed: URL;
  try {
    parsed = new URL(input);
  } catch (err) {
    return {
      valid: false,
      message: "Invalid URL format.",
    };
  }

  if (!["http:", "https:"].includes(parsed.protocol)) {
    return {
      valid: false,
      message: "Invalid URL protocol. Only http and https are allowed.",
    };
  }

  return { valid: true, url: parsed };
}
