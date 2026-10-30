#!/usr/bin/env node
// Reads the public Collshp storefront (the Shopee affiliate showcase) and writes feeds/collshp.csv.
// Each product already carries the affiliate short link of the storefront owner.
// Usage: node tools/fetch-collshp.mjs [storefront-url]
import { chromium } from "playwright-core";
import { mkdirSync, writeFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const url = process.argv[2] ?? "https://collshp.com/deborasmagnus644?view=storefront";
if (new URL(url).hostname !== "collshp.com") throw new Error("Somente URLs de collshp.com são aceitas.");

const CATEGORIES = [
  ["Eletrônicos", /torradeira|air ?fryer|fritadeira|liquidificador|batedeira|cafeteira|chaleira|microondas|aspirador|ventilador|ferro de passar|fone|bluetooth|smartwatch|carregador|cabo |celular|tablet|notebook|caixa de som|mouse|teclado|c[aâ]mera|lâmpada inteligente/i],
  ["Casa", /sof[aá]|cristaleira|panela|cama|lençol|colch|mesa|cadeira|banco|banquinho|cozinha|toalha|manta|decora|quadro|organizador|escorredor|lixeira|cabide|banheiro|saboneteira|dispenser|porta (caneta|l[aá]pis|treco)|luminária|plafon|prato|casinha|pergaminho|vaso|tapete|cortina|almofada|prateleira/i],
  ["Beleza", /s[eé]rum|creme|perfume|maquiagem|batom|shampoo|cabelo|skincare|hidratante/i],
  ["Moda", /t[eê]nis|camiseta|vestido|cal[cç]a|bolsa|mochila|sand[aá]lia|blusa|bermuda|jaqueta/i],
];
const categoryOf = title => CATEGORIES.find(([, re]) => re.test(title))?.[0] ?? "Outros";

const browser = await chromium.launch({ channel: "msedge", headless: true });
const page = await browser.newPage({ viewport: { width: 480, height: 900 } });
const items = new Map();

page.on("response", async r => {
  if (!r.url().includes("StorefrontProductListQuery")) return;
  try {
    const data = await r.json();
    for (const it of data?.data?.storefrontProductList?.itemList ?? []) items.set(it.itemId ?? it.linkId, it);
  } catch { /* ignore non-JSON bodies */ }
});

await page.goto(url, { waitUntil: "networkidle" });
let stable = 0, last = 0;
while (stable < 4 && items.size < 500) {
  await page.mouse.wheel(0, 3000);
  await page.waitForTimeout(1200);
  stable = items.size === last ? stable + 1 : 0;
  last = items.size;
}
await browser.close();

const money = v => (Number(v) / 100000).toFixed(2).replace(".", ",");
const esc = v => `"${String(v ?? "").replace(/"/g, '""').replace(/[\r\n]+/g, " ")}"`;
const rows = [...items.values()].map(it => {
  const d = it.itemCard?.itemData?.itemCardDisplayPrice ?? {};
  const price = it.itemCard?.itemCardDisplayedAsset?.displayPrice?.price ?? d.price;
  const old = d.strikethroughPrice ?? d.originalPrice;
  return [it.linkName, price ? money(price) : "", old ? money(old) : "", it.image, it.link, categoryOf(it.linkName ?? "")];
}).filter(r => r[0] && r[1] && r[4]);

mkdirSync(join(root, "feeds"), { recursive: true });
writeFileSync(join(root, "feeds", "collshp.csv"), "\uFEFFname;price;original_price;image_link;product_link;category\n" + rows.map(r => r.map(esc).join(";")).join("\n") + "\n");
console.log(`${rows.length} produtos salvos em feeds/collshp.csv`);
