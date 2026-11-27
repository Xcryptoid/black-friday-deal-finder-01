[![make.fun · black-friday-deal-finder-01](https://make.fun/badge/black-friday-deal-finder-01.svg)](https://make.fun/bounty/black-friday-deal-finder-01?utm_source=github&utm_medium=readme&utm_campaign=black-friday-deal-finder-01)
[![make.fun · black-friday-deal-finder-01 · Xcryptoid/black-friday-deal-finder-01](https://make.fun/badge/black-friday-deal-finder-01/Xcryptoid/black-friday-deal-finder-01/rank.svg)](https://make.fun/bounty/black-friday-deal-finder-01?utm_source=github&utm_medium=readme&utm_campaign=black-friday-deal-finder-01)
[![make.fun · black-friday-deal-finder-01 · Xcryptoid/black-friday-deal-finder-01](https://make.fun/badge/black-friday-deal-finder-01/Xcryptoid/black-friday-deal-finder-01/reward.svg)](https://make.fun/bounty/black-friday-deal-finder-01?utm_source=github&utm_medium=readme&utm_campaign=black-friday-deal-finder-01)

# DealSleuth: 24 real Black Friday deals from 4 stores, up to 77% off — checked 27 Nov 2026

A static deal finder for Black Friday 2026. Every deal was found and checked on
Friday 27 November 2026 by reading the price in a deals source that names the
store — the store's own Black Friday ad, or a deals roundup that lists the store
and the price. Nothing here is invented: where two sources disagreed, the deal
was dropped.

- **24 deals** from **Amazon, Best Buy, Target and Walmart**
- **Up to 77% off** (Michael Kors crossbody, $65 from $278); **$4,321 total savings**
- **2 new lows** (AirPods Pro 3 at $149, Crock-Pot 7-qt at $32)
- Search plus filters by category, store, discount and verdict; sorting by
  biggest discount, biggest saving, lowest price or name
- Every deal shows its store, sale price, usual price, discount, store link,
  check time and source — plus an honest verdict (NEW LOW / STRONG PRICE /
  ROUTINE SALE) with the evidence behind it
- The same product at two stores is compared head to head (Dyson V9: Target
  $269.99 vs Walmart $270; Samsung The Frame 55": $899.99 at both)

## Run it

```sh
node serve.ts
# open http://localhost:8080
```

The site is plain static files under `app/` — no build step, no network loads.
`main.ts` (Node 22, standard library only) copies `app/` and `screenshots/` to
`/output` and writes `/output/dossier.json` with the vendored make.fun library:

```sh
mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts
```

## Sources

MacRumors, 9to5Toys, USA Today, the Target and Best Buy Black Friday ads, the
Yahoo Shopping Black Friday roundup, MamaCheaps, DealNews. Prices were checked
27 Nov 2026, 06:45 UTC and change — confirm at the store before you buy.
