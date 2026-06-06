/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { runValidationSuite } from './tests';

console.log("=================================================");
console.log("  SWAYAM OFFLINE TEST & SANITY INTEGRITY SUITE   ");
console.log("=================================================");

const results = runValidationSuite();
let failed = false;

results.forEach((res) => {
  if (res.passed) {
    console.log(`[PASS] ${res.name}`);
  } else {
    console.error(`[FAIL] ${res.name}: ${res.error || "Unknown Failure"}`);
    failed = true;
  }
});

console.log("=================================================");
if (failed) {
  console.error("❌ Some validation checks failed. Please inspect code accuracy.");
  process.exit(1);
} else {
  console.log("✅ All checks passed successfully. Swayam business rules & security sanitization functions are completely sound!");
  process.exit(0);
}
