import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

import dotenv from 'dotenv';
dotenv.config({ path: path.resolve(process.cwd(), '.env') });

// Get current directory name in ES Module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Paths relative to project root
const templatePath = path.resolve(
  __dirname,
  "../public/firebase-messaging-sw.template.js"
);
const outputPath = path.resolve(
  __dirname,
  "../public/firebase-messaging-sw.js"
);

try {
  console.log("Starting service worker config injection...");

  // Read environment variables
  const envKeys = [
    "VITE_API_KEY",
    "VITE_AUTH_DOMAIN",
    "VITE_PROJECT_ID",
    "VITE_STORAGE_BUCKET",
    "VITE_MESSAGING_SENDER_ID",
    "VITE_APP_ID",
    "VITE_MEASUREMENT_ID",
  ];

  const env = {};
  for (const key of envKeys) {
    env[key] = process.env[key] || `MISSING_${key}`;
    console.log(`Loaded ${key} (${env[key].substring(0, 5)}...)`);
  }

  // Read template
  const template = fs.readFileSync(templatePath, "utf8");

  // Replace placeholders
  const output = template.replace(
    /%%(.+?)%%/g,
    (_, key) => env[key.trim()] || `MISSING_${key}`
  );

  // Write output
  fs.writeFileSync(outputPath, output);
  console.log("✅ Service worker config injected successfully!");
} catch (error) {
  console.error("❌ Error in inject-firebase-config.js:");
  console.error(error);
  process.exit(1);
}
