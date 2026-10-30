#!/usr/bin/env node
// Collects public coupons listed on https://www.promobit.com.br/cupons/ (allowed by its robots.txt)
// by reading the JSON the page itself loads. Writes data/promobit-coupons.json. Run on demand only.
import { chromium } from "playwright-core";
import { mkdirSync, writeFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const found = new Map();

const browser = await chromium.launch({ channel: "msedge", headless: true });
const page = await browser.newPage({ viewport: { width: 1200, height: 900 } });
page.on("response", async r => {
  if (!r.url().startsWith("https://api.promobit.com.br/coupon?")) return;
  try { for (const c of (await r.json()).coupons ?? []) found.set(c.coupon_id, c); } catch { /* ignore */ }
});
await page.goto("https://www.promobit.com.br/cupons/", { waitUntil: "networkidle", timeout: 60000 });
for (let i = 0; i < 4 && found.size < 60; i++) { await page.mouse.wheel(0, 4000); await page.waitForTimeout(1500); }
await browser.close();

mkdirSync(join(root, "data"), { recursive: true });
writeFileSync(join(root, "data", "promobit-coupons.json"), JSON.stringify([...found.values()], null, 1));
console.log(`${found.size} cupons coletados`);
