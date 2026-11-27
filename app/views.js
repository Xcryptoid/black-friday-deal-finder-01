// HTML for each page, built from the deal data. Every value is escaped before it
// goes into the page. One job only: turning deals and filter state into markup.

import { checkedLabel, escapeHtml, percentOff, saved, usd, verdictLabel, verdictNote } from "./format.js";
import { boardStats, crossStore } from "./filters.js";
import { categories, stores } from "./deals.js";

function card(d) {
  const off = percentOff(d);
  return `<li class="card verdict-${d.verdict}">
  <a class="card-title" href="#/deal/${encodeURIComponent(d.id)}">${escapeHtml(d.title)}</a>
  <p class="card-meta"><span class="store">${escapeHtml(d.store)}</span> · <span>${escapeHtml(d.category)}</span></p>
  <p class="card-price"><strong>${usd(d.price)}</strong> <s>${usd(d.was)}</s> <span class="off">${off}% off</span></p>
  <p class="card-save">You save ${usd(saved(d))}</p>
  <p class="card-verdict"><span class="pill">${verdictLabel(d.verdict)}</span> ${escapeHtml(d.evidence)}</p>
  <p class="card-checked">Checked ${checkedLabel(d.checked)} · ${escapeHtml(d.source)}</p>
  <p class="card-links"><a href="${escapeHtml(d.url)}" rel="noopener" target="_blank">View at ${escapeHtml(d.store)} ↗</a> <a href="#/deal/${encodeURIComponent(d.id)}">Details</a></p>
</li>`;
}

function chipRow(label, name, options, current) {
  const buttons = options
    .map(
      (o) =>
        `<button type="button" data-filter="${name}" data-value="${escapeHtml(o)}" class="${o === current ? "on" : ""}" aria-pressed="${o === current}">${escapeHtml(o)}</button>`,
    )
    .join("");
  return `<fieldset><legend>${escapeHtml(label)}</legend>${buttons}</fieldset>`;
}

export function list(deals, shown, state) {
  const stats = boardStats(deals);
  const top = [...deals].sort((a, b) => percentOff(b) - percentOff(a)).slice(0, 3);
  const topHtml = top
    .map(
      (d, i) =>
        `<li><span class="rank">#${i + 1}</span> <a href="#/deal/${encodeURIComponent(d.id)}">${escapeHtml(d.title)}</a> — <strong>${usd(d.price)}</strong> <s>${usd(d.was)}</s> (${percentOff(d)}% off, ${escapeHtml(d.store)})</li>`,
    )
    .join("");
  const rows = shown.length === 0 ? '<li class="empty">No deal matches. Clear a filter or try another search.</li>' : shown.map(card).join("");
  return `<section class="hero">
  <h1>DealSleuth — Black Friday 2026</h1>
  <p class="tagline">Real deals, checked today. No inflated “was” prices, no invented bargains.</p>
  <p class="stats"><strong>${stats.count} deals</strong> · <strong>${stats.storeCount} stores</strong> · up to <strong>${stats.maxOff}% off</strong> · <strong>${usd(stats.totalSaved)}</strong> total savings · <strong>${stats.newLows} new lows</strong></p>
  <p class="checked-note">Every price checked Fri 27 Nov 2026, 06:45 UTC, at the store or in a deals source that names the store. Prices change — confirm at the store before you buy.</p>
</section>
<section class="top-picks">
  <h2>Biggest cuts on the board</h2>
  <ol>${topHtml}</ol>
</section>
<div class="board">
<div class="sidebar">
<form class="controls" id="controls">
  <p><label>Search <input type="search" name="query" value="${escapeHtml(state.query)}" placeholder="Try “lego”, “vacuum”, “headphones”…"></label></p>
  ${chipRow("Category", "category", ["All", ...categories], state.category)}
  ${chipRow("Store", "store", ["All", ...stores], state.store)}
  ${chipRow("At least", "minDiscount", ["0", "25", "40", "50"], String(state.minDiscount))}
  ${chipRow("Verdict", "verdict", ["All", "new-low", "strong", "routine"], state.verdict)}
  <p><label>Sort by <select name="sort">
    <option value="discount"${state.sort === "discount" ? " selected" : ""}>Biggest discount</option>
    <option value="saving"${state.sort === "saving" ? " selected" : ""}>Biggest saving ($)</option>
    <option value="price"${state.sort === "price" ? " selected" : ""}>Lowest price</option>
    <option value="name"${state.sort === "name" ? " selected" : ""}>Name A–Z</option>
  </select></label></p>
</form>
</div>
<div class="results">
<p class="count" role="status">Showing ${shown.length} of ${deals.length} deals</p>
<ul class="deals">${rows}</ul>
</div>
</div>
<section class="method">
  <h2>How we check a deal</h2>
  <p>Every deal on this board was read today, 27 November 2026, in a source that names the store — the store's own Black Friday ad, or a deals roundup that lists the store and the price. The “was” price is the store's list price. The verdict says what the cut really is: <strong>NEW LOW</strong> means the lowest price the sources have seen; <strong>STRONG PRICE</strong> means a deep cut on a real list price; <strong>ROUTINE SALE</strong> means a real cut, but a modest one, or a product that goes on sale often. Where the same product is on sale at two stores, the deal page shows both prices side by side.</p>
  <p>Sources: MacRumors, 9to5Toys, USA Today, the Target and Best Buy Black Friday ads, the Yahoo Shopping Black Friday roundup, MamaCheaps, DealNews.</p>
</section>`;
}

export function deal(d, deals) {
  const off = percentOff(d);
  const others = crossStore(deals, d);
  const compare =
    others.length === 0
      ? ""
      : `<section class="compare"><h2>Same product, other stores</h2><ul>${others
          .map(
            (o) =>
              `<li><strong>${escapeHtml(o.store)}</strong> — ${usd(o.price)} ${o.price < d.price ? `<span class="cheaper">cheaper by ${usd(d.price - o.price)}</span>` : o.price > d.price ? `<span class="dearer">costs ${usd(o.price - d.price)} more</span>` : `<span class="same">same price</span>`} <a href="${escapeHtml(o.url)}" rel="noopener" target="_blank">View at ${escapeHtml(o.store)} ↗</a></li>`,
          )
          .join("")}</ul></section>`;
  return `<p><a href="#/">&larr; All deals</a></p>
<article class="detail verdict-${d.verdict}">
  <h1>${escapeHtml(d.title)}</h1>
  <p class="card-meta"><span class="store">${escapeHtml(d.store)}</span> · <span>${escapeHtml(d.category)}</span></p>
  <p class="card-price big"><strong>${usd(d.price)}</strong> <s>${usd(d.was)}</s> <span class="off">${off}% off</span></p>
  <p class="card-save">You save ${usd(saved(d))}</p>
  <p class="card-verdict"><span class="pill">${verdictLabel(d.verdict)}</span> ${escapeHtml(d.evidence)}</p>
  <p class="verdict-note">${escapeHtml(verdictNote(d.verdict))}.</p>
  <dl>
    <dt>Store</dt><dd>${escapeHtml(d.store)}</dd>
    <dt>Category</dt><dd>${escapeHtml(d.category)}</dd>
    <dt>Checked</dt><dd>${checkedLabel(d.checked)}</dd>
    <dt>Read in</dt><dd>${escapeHtml(d.source)}</dd>
  </dl>
  <p><a class="buy" href="${escapeHtml(d.url)}" rel="noopener" target="_blank">View it at ${escapeHtml(d.store)} ↗</a></p>
  ${compare}
</article>`;
}

export function missing() {
  return `<h1>Not found</h1>
<p>There is no deal at this address. <a href="#/">See all deals</a>.</p>`;
}
