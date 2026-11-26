import { createHash } from "node:crypto";
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

function getLine(): string {
  return "Section 8.3: The Company may, at its sole discretion, replace the User's morning alarm with a small brass band stationed outside the bedroom window, effective immediately and without compensation.";
}

function validateLine(line: string): void {
  if (line.length === 0) {
    throw new Error("Entry line must not be empty");
  }
  if (line.length > 200) {
    throw new Error(`Entry line exceeds 200 characters: ${line.length}`);
  }
  if (line.includes("\n") || line.includes("\r")) {
    throw new Error("Entry line must be a single line without newlines");
  }
  if (line.trim() !== line) {
    throw new Error("Entry line must not have leading or trailing whitespace");
  }
  if (!line.endsWith(".")) {
    throw new Error("Entry line must be a single sentence ending with a period");
  }
  if (/[^\x20-\x7E]/.test(line)) {
    throw new Error("Entry line must contain only printable ASCII characters");
  }
  const periodCount = (line.match(/\./g) ?? []).length;
  if (periodCount !== 2) {
    throw new Error(`Entry line must contain exactly two periods (section number and final period), found ${periodCount}`);
  }
}

function main(): void {
  const line = getLine();
  validateLine(line);

  const outputDir = process.env.MAKEFUN_OUTPUT_DIR ?? "out";
  mkdirSync(outputDir, { recursive: true });

  const outputPath = join(outputDir, "entry.txt");
  writeFileSync(outputPath, line, "utf8");

  const readBack = readFileSync(outputPath, "utf8");
  if (readBack !== line) {
    throw new Error("Read-back verification failed: written content does not match entry line");
  }

  const sha256 = createHash("sha256").update(readBack, "utf8").digest("hex");
  console.log(sha256);
}

main();
