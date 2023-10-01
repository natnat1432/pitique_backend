import crypto from "crypto";
import fs from "fs";
import * as path from "path";
import dotenv from "dotenv";
dotenv.config();

export function capitalizeWords(str) {
  // Split the string into words based on spaces

  if (str === null) return null;

  const words = str.split(" ");

  // Capitalize the first letter of each word
  const capitalizedWords = words.map((word) => {
    if (word.length === 0) {
      return word; // Skip empty words
    }
    return word.charAt(0).toUpperCase() + word.slice(1);
  });

  // Join the capitalized words back together with spaces
  return capitalizedWords.join(" ").trim();
}

export function generateRandomPassword() {
  var length = 7;
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let randomString = "";

  for (let i = 0; i < length; i++) {
    const randomIndex = crypto.randomInt(0, characters.length);
    randomString += characters.charAt(randomIndex);
  }

  return randomString;
}

export function getImageFilenames(dir) {
  var files = [];
  const fileList = fs.readdirSync(dir);
  for (const file of fileList) {
    const name = file;
    files.push(name);
  }
  return files;
}

export async function generatePitiquerPortfolioFolder(email) {
  const pitiquerPath = path.join(process.env.PITIQUER_DIR, email, "portfolio");
  if (!fs.existsSync(pitiquerPath)) {
    fs.mkdirSync(pitiquerPath, { recursive: true });
  }
}
