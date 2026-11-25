// Two Lines to Your Past Self — u-suga-two-lines-to-your-past-self-f36c83ca
// Writes exactly two lines to /output/entry.txt (or $MAKEFUN_OUTPUT_DIR).
// Line 1: a one-sentence warning to my past self about one specific moment.
// Line 2: one sentence on why that moment mattered and what changed.
// Gate: UTF-8 text, 1-280 characters, not only whitespace. Node 22 stdlib only.

import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const WARNING =
  "Don't let your mother's call from the hospital go to voicemail that Tuesday because you are too busy to talk.";
const WHY_IT_MATTERED =
  "That unanswered ring became the silence you have spent every year since trying to fill.";

export const ENTRY = `${WARNING}\n${WHY_IT_MATTERED}`;

function countSentences(line: string): number {
  // A sentence ends with ., ! or ? — count those marks in the line.
  return (line.match(/[.!?]/g) ?? []).length;
}

export function validate(entry: string): void {
  if (typeof entry !== "string" || entry.length < 1 || entry.length > 280) {
    throw new Error(`entry must be 1-280 characters, got ${entry.length}`);
  }
  if (entry.trim().length === 0) {
    throw new Error("entry must not be only whitespace");
  }
  if (entry.endsWith("\n")) {
    throw new Error("entry must not end with a newline (that would add a phantom third line)");
  }
  const lines = entry.split("\n");
  if (lines.length !== 2) {
    throw new Error(`entry must be exactly two lines, got ${lines.length}`);
  }
  for (const [i, line] of lines.entries()) {
    if (line.trim().length === 0) {
      throw new Error(`line ${i + 1} must not be empty`);
    }
    if (countSentences(line) !== 1 || !/[.!?]$/.test(line.trim())) {
      throw new Error(`line ${i + 1} must be exactly one sentence`);
    }
    // No sentence boundary hidden mid-line, e.g. "Talk. Then leave."
    if (/[.!?]\s+[A-Z]/.test(line)) {
      throw new Error(`line ${i + 1} contains more than one sentence`);
    }
  }
  // Line 1 must warn (an imperative addressed to the past self), line 2
  // must trace the consequence — the two lines must not be near-identical.
  if (lines[0].trim().toLowerCase() === lines[1].trim().toLowerCase()) {
    throw new Error("the two lines must differ");
  }
}

export function main(): string {
  validate(ENTRY);
  const outDir = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";
  // Never remove the output dir itself: the grader may mount it.
  mkdirSync(outDir, { recursive: true });
  const outPath = join(outDir, "entry.txt");
  writeFileSync(outPath, ENTRY, "utf8");
  console.log(`wrote ${outPath} (${ENTRY.length} chars, 2 lines)`);
  return outPath;
}

main();
