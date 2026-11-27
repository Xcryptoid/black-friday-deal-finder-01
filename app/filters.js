// Search, filter and sort for the deal finder. One job only: given the full deal
// list and the shopper's choices, return the deals to show, in order.

import { percentOff, saved } from "./format.js";

export const SORTS = {
  discount: { label: "Biggest discount", run: (a, b) => percentOff(b) - percentOff(a) || saved(b) - saved(a) },
  saving: { label: "Biggest saving ($)", run: (a, b) => saved(b) - saved(a) || percentOff(b) - percentOff(a) },
  price: { label: "Lowest price", run: (a, b) => a.price - b.price || percentOff(b) - percentOff(a) },
  name: { label: "Name A–Z", run: (a, b) => a.title.localeCompare(b.title) },
};

export function applyFilters(deals, state) {
  const q = state.query.trim().toLowerCase();
  const shown = deals.filter((d) => {
    if (state.category !== "All" && d.category !== state.category) return false;
    if (state.store !== "All" && d.store !== state.store) return false;
    if (state.minDiscount > 0 && percentOff(d) < state.minDiscount) return false;
    if (state.verdict !== "All" && d.verdict !== state.verdict) return false;
    if (q !== "" && !(d.title + " " + d.store + " " + d.category).toLowerCase().includes(q)) return false;
    return true;
  });
  const sort = SORTS[state.sort] || SORTS.discount;
  return [...shown].sort(sort.run);
}

export function boardStats(deals) {
  const totalSaved = deals.reduce((sum, d) => sum + saved(d), 0);
  const maxOff = Math.max(...deals.map(percentOff));
  const newLows = deals.filter((d) => d.verdict === "new-low").length;
  const storeCount = new Set(deals.map((d) => d.store)).size;
  return { count: deals.length, totalSaved, maxOff, newLows, storeCount };
}

// The same product at another store, cheapest first. Used on the deal page so a
// shopper can see at a glance whether another store beats the price.
export function crossStore(deals, deal) {
  if (!deal.group) return [];
  return deals
    .filter((d) => d.group === deal.group && d.id !== deal.id)
    .sort((a, b) => a.price - b.price);
}
