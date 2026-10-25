import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const html = readFileSync(new URL("../index.html", import.meta.url), "utf8");
const themeMatch = html.match(/const THEMES = (\[[\s\S]*?\]);/);

function luminance(hex) {
  const channels = hex.match(/[a-f0-9]{2}/gi).map(channel => {
    const value = parseInt(channel, 16) / 255;
    return value <= 0.04045 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * channels[0] + 0.7152 * channels[1] + 0.0722 * channels[2];
}

test("all clock theme colors meet WCAG AA contrast against black", () => {
  assert.ok(themeMatch, "THEMES palette must be declared as a JSON-compatible array");
  const themes = JSON.parse(themeMatch[1]);
  assert.ok(themes.length > 0, "at least one theme must be defined");

  for (const [themeIndex, theme] of themes.entries()) {
    for (const [role, color] of Object.entries(theme)) {
      assert.match(color, /^#[a-f0-9]{6}$/i, `theme ${themeIndex} ${role} must be a six-digit hex color`);
      const ratio = (luminance(color) + 0.05) / 0.05;
      assert.ok(ratio >= 4.5, `theme ${themeIndex} ${role} (${color}) has contrast ${ratio.toFixed(2)}:1`);
    }
  }
});

test("the clock does not depend on an external font service", () => {
  assert.doesNotMatch(html, /fonts\.googleapis\.com|fonts\.gstatic\.com/i);
});
