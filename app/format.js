// Money, discount and date formatting for the deal finder. One job only: turning
// numbers and timestamps into the strings the pages show.

export function usd(n) {
  return "$" + Number(n).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 }).replace(/\.00$/, "");
}

export function usdExact(n) {
  return "$" + Number(n).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

export function percentOff(d) {
  return Math.round((1 - d.price / d.was) * 100);
}

export function saved(d) {
  return Math.round((d.was - d.price) * 100) / 100;
}

export function checkedLabel(iso) {
  return new Date(iso).toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
    timeZone: "UTC",
  }) + " UTC";
}

export const VERDICTS = {
  "new-low": { label: "NEW LOW", note: "Lowest price the sources have seen" },
  strong: { label: "STRONG PRICE", note: "A deep cut on a real list price" },
  routine: { label: "ROUTINE SALE", note: "A real cut, but a modest one" },
};

export function verdictLabel(v) {
  return VERDICTS[v] ? VERDICTS[v].label : "CHECKED";
}

export function verdictNote(v) {
  return VERDICTS[v] ? VERDICTS[v].note : "";
}

export function escapeHtml(s) {
  return String(s).replace(/[&<>"']/g, (c) => "&#" + c.charCodeAt(0) + ";");
}
