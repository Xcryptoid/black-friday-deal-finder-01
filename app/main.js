// A deal finder: 24 checked deals and a page for each, on hash routes. The deals
// live in deals.js, so the site needs no network to show them; each deal links out
// to its store.
//
//   #/            the board, with search, filters and sorting
//   #/deal/<id>   one deal, with a cross-store comparison where one exists
//
// window.__shotReady is false while a page renders and true once it is on screen,
// so a screenshot script knows when to capture.

import { deals } from "./deals.js";
import { applyFilters } from "./filters.js";
import { deal, list, missing } from "./views.js";

const app = document.getElementById("app");

const state = {
  query: "",
  category: "All",
  store: "All",
  minDiscount: 0,
  verdict: "All",
  sort: "discount",
};

function stateFromHash() {
  // A filtered board is shareable: #/?category=Toys, #/?query=lego,
  // #/?store=Target&minDiscount=50 — the same filters the chips set.
  const m = location.hash.match(/^#\/\?(.+)/);
  if (!m) return;
  const params = new URLSearchParams(m[1]);
  const q = params.get("query");
  if (q !== null) state.query = q;
  const cat = params.get("category");
  if (cat !== null) state.category = cat;
  const store = params.get("store");
  if (store !== null) state.store = store;
  const min = Number(params.get("minDiscount"));
  if (Number.isFinite(min) && min > 0) state.minDiscount = min;
  const verdict = params.get("verdict");
  if (verdict !== null) state.verdict = verdict;
  const sort = params.get("sort");
  if (sort !== null) state.sort = sort;
}

function render() {
  window.__shotReady = false;
  const match = location.hash.match(/^#\/deal\/([^/?]+)/);
  if (match) {
    const found = deals.find((d) => d.id === decodeURIComponent(match[1]));
    document.title = `${found ? found.title : "Not found"} | DealSleuth`;
    app.innerHTML = found ? deal(found, deals) : missing();
  } else {
    stateFromHash();
    document.title = "DealSleuth — Black Friday 2026: 24 real deals, 4 stores";
    app.innerHTML = list(deals, applyFilters(deals, state), state);
    wireControls();
  }
  window.scrollTo(0, 0);
  window.__shotReady = true;
}

function rerenderList() {
  const shown = applyFilters(deals, state);
  const listHtml = list(deals, shown, state);
  // Rebuild only the changing parts: the count line and the deal rows, so the
  // search box keeps focus and its text while the shopper types.
  const temp = document.createElement("div");
  temp.innerHTML = listHtml;
  const newCount = temp.querySelector(".count");
  const newRows = temp.querySelector(".deals");
  const oldCount = app.querySelector(".count");
  const oldRows = app.querySelector(".deals");
  if (oldCount && newCount) oldCount.replaceWith(newCount);
  if (oldRows && newRows) oldRows.replaceWith(newRows);
  const chips = app.querySelectorAll("[data-filter]");
  chips.forEach((chip) => {
    const on = chip.dataset.value === String(state[chip.dataset.filter]);
    chip.classList.toggle("on", on);
    chip.setAttribute("aria-pressed", String(on));
  });
}

function wireControls() {
  const search = app.querySelector('input[name="query"]');
  search.addEventListener("input", () => {
    state.query = search.value;
    rerenderList();
  });
  const sort = app.querySelector('select[name="sort"]');
  sort.addEventListener("change", () => {
    state.sort = sort.value;
    rerenderList();
  });
  app.querySelectorAll("[data-filter]").forEach((chip) => {
    chip.addEventListener("click", () => {
      const key = chip.dataset.filter;
      state[key] = key === "minDiscount" ? Number(chip.dataset.value) : chip.dataset.value;
      rerenderList();
    });
  });
}

window.addEventListener("hashchange", render);
render();
