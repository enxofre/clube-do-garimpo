// Shared CSV helpers used by the product builder and the admin panel.
export const norm = s => String(s).normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().replace(/[^a-z0-9]/g, "");

export function parseCsv(text) {
  text = text.replace(/^\uFEFF/, "");
  const first = text.split(/\r?\n/, 1)[0];
  const delim = [";", "\t", ","].map(d => [d, first.split(d).length]).sort((a, b) => b[1] - a[1])[0][0];
  const rows = [];
  let row = [], cell = "", q = false;
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (q) {
      if (c === '"' && text[i + 1] === '"') { cell += '"'; i++; }
      else if (c === '"') q = false;
      else cell += c;
    } else if (c === '"') q = true;
    else if (c === delim) { row.push(cell); cell = ""; }
    else if (c === "\n" || c === "\r") {
      if (c === "\r" && text[i + 1] === "\n") i++;
      row.push(cell); cell = "";
      if (row.some(x => x !== "")) rows.push(row);
      row = [];
    } else cell += c;
  }
  row.push(cell);
  if (row.some(x => x !== "")) rows.push(row);
  return rows;
}

export function parseMoney(v) {
  if (v == null) return NaN;
  let s = String(v).replace(/[^\d.,]/g, "");
  if (!s) return NaN;
  const lastComma = s.lastIndexOf(","), lastDot = s.lastIndexOf(".");
  s = lastComma > lastDot ? s.replace(/\./g, "").replace(",", ".") : s.replace(/,/g, "");
  return Number(s);
}

export const httpsOnly = u => {
  try { const x = new URL(u); return x.protocol === "https:" ? x.href : null; } catch { return null; }
};

export function findColumns(headerRow, aliases) {
  const headers = headerRow.map(norm);
  const col = {};
  for (const [field, names] of Object.entries(aliases)) {
    const idx = names.map(n => headers.indexOf(n)).find(i => i >= 0);
    if (idx !== undefined) col[field] = idx;
  }
  return col;
}
