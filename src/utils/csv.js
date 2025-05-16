import { mkConfig, generateCsv, asString } from "export-to-csv";
import { writeFile } from "node:fs/promises";
import { mkdir } from "node:fs/promises";
import { dirname } from "node:path";
import { Buffer } from "node:buffer";

/**
 * Converts an array of JavaScript objects to a CSV file
 * @param {Array<Object>} data - Array of objects to convert to CSV
 * @param {string} filePath - Path where the CSV file should be saved
 * @returns {Promise<void>} - Promise that resolves when the file is written
 */
export const objectToCsv = async (data, filePath) => {
  try {
    // Configure CSV generation with default options
    const csvConfig = mkConfig({ useKeysAsHeaders: true });
    
    // Generate CSV content
    const csv = generateCsv(csvConfig)(data);
    const csvBuffer = new Uint8Array(Buffer.from(asString(csv)));

    // Create directory if it doesn't exist
    await mkdir(dirname(filePath), { recursive: true });

    // Write the CSV file
    await writeFile(filePath, csvBuffer);
    console.log("CSV file saved: ", filePath);
  } catch (err) {
    console.error("Error saving CSV file:", err);
    throw err;
  }
};