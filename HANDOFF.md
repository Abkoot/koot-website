# UPDATE (latest redesign, supersedes conflicting notes below)

- Koot is positioned as a **brand**, not a trading company. Audiences: foodservice distributors, importers and wholesalers (the "distributor" ban in rule 8 is lifted; business page, finder and "how we work with you" are removed).
- **Selection tray is gone.** Visitors add whole categories (`data-addcat="<cat>"`) and trim products on `rfq.html`. Storage is still `koot-sel` (SKU list).
- **RFQ pipeline (to build):** `rfq.html` POSTs JSON via `K.send()` (type `rfq`, `reference`, `to`, `customer`, `lines[]` with `estimate: null`, plus `text`/`html` tables with a blank Estimate column). Needed: (1) set `K.config.enquiryEndpoint` and `K.config.rfqTo` to the team's mailing list; (2) the endpoint mails the team; (3) Emad fills the Estimate column; (4) a Zoho API step creates the estimate from `lines` and emails it. The Zoho step is not built yet.
- Home "field to plate" stage one uses the brand's farmer line art. Replace with a real potato-field photo (see PHOTO_BRIEF.md, `potato-field`).
- Product cards and the RFQ list are generated; `about.html`/`resources.html` still come from `tools/make_pages.py`.

# Koot website: guide for the next session

Read this whole file before changing anything. It replaces all earlier handoff notes.

## 1. What this is

A bilingual (English and Arabic) B2B website for **Koot Expert General Trading LLC**, Dubai. Static HTML, CSS and JavaScript, no build step and no framework. It presents the Koot-branded food range and lets buyers shortlist products and send one enquiry.

## 2. Rules set by the owner (do not break these)

1. **Trading only.** The site is about Koot-branded products. Do not add distribution, market-development or partner-brand content. Never mention Halo, Activus, Auga, More Than Noodles or Bangs.
2. **Real data only.** Product facts come from `src/Koot SKUs.xlsx` and the fries spec PDF. Do not invent specs, certifications, claims or contact details.
3. **Shelf life is 24 months for every product.**
4. **Photos are never tinted.** Pack photos have white backgrounds, so they sit on white panels. Do not use `mix-blend-mode` on them over coloured backgrounds.
5. **No cartoon illustrations.** Use real photography. `assets/art.js` holds old SVG illustrations and nothing visible should use it.
6. **Enquiries are sent from the website.** Do not redirect visitors to their mail app. A plain "or email us directly at sales@koot.ae" link beside the form is wanted.
7. Pack sizes: the 2.5 kg photo is the main image, and other sizes are listed as options. Grade B fries and strawberries use the transparent-bag photo.
8. Buyers are called "importers and wholesale buyers", not "distributors".

## 3. File map

| Path | What it is |
|---|---|
| `index.html` | Homepage: hero, range shelf (marquee and counters), category switcher, finder band, "field to plate" scroll story, business routes, serving scene with hotspots, quality, closing call to action |
| `category.html` | Catalogue. `?cat=fries` etc. Tabs, pack and origin filters, search box, compare up to 3 |
| `product.html` | Product page. `?p=<id>&v=<sku>`. Variant chips, specs, pack options table, fries grade guide, downloads |
| `finder.html` | Three-question product finder with reasons per result |
| `catalogue.html` | Builds a printable catalogue from the selection or the full range. "Save as PDF" uses the browser print dialog |
| `business.html`, `about.html`, `resources.html` | **Generated** by `tools/make_pages.py`. Edit the script and re-run it, never the HTML |
| `design-system.html` | Internal reference. Leave it off the live site |
| `assets/koot.css` | The only stylesheet: tokens (including the spacing scale `--s1` to `--s9`), components, features, motion and print styles |
| `assets/koot.js` | Header, footer, language switch, selection tray, enquiry sending (`K.send`), reveal |
| `assets/extras.js` | Search overlay, photo zoom, count-up, parallax, scroll progress, card tilt, pinned category scroll, add-to-selection flight, phone bottom navigation, headline word reveal |
| `assets/data.js` | Data layer over `products.js`: `K.list`, `K.byId`, `K.products[sku]`, `K.cats`, helpers |
| `assets/products.js` | **Generated** from the spreadsheet. Never edit by hand |
| `tools/build_data.py` | Spreadsheet to `products.js`. Product grouping and photo mapping live here |
| `tools/build_images.sh` | Raw pack photos to 600 and 1200 px WebP |
| `tools/DATA_REPORT.md` | Data gaps and open questions for Koot |
| `PHOTO_BRIEF.md` | Prompts for the photos the owner offered to create |
| `src/` | Source spreadsheet, raw images, extracted catalogue pages. Not part of the live site |

Rebuild data: `python3 tools/read_sheet.py "src/Koot SKUs.xlsx" src/skus.json && python3 tools/build_data.py`

## 4. How it works

- **Language.** English text is in the HTML. Arabic is in `data-ar` attributes and swapped by `K.applyLang()`. JS-rendered parts re-render on the `koot:lang` event. Layout uses logical CSS properties, so right-to-left needs no separate styles.
- **Selection tray.** Stored in `localStorage` key `koot-sel` as `[{id: <sku>, qty, unit}]`. Any button with `data-add="<sku>"` adds to it.
- **Brand tokens.** Dark green `#36644B`, light green `#6ABE8C`, logo green `#2FB67C`, cream `#F8F3E7`, orange `#E3914D`. Fonts: Fraunces and Instrument Sans; Arabic uses Alexandria and IBM Plex Sans Arabic.
- **Motion.** Three durations and one easing curve as tokens. Everything respects reduced motion. Page changes use cross-document view transitions, and pack photos morph between card and product page through `view-transition-name: pk-<product id>`.

## 5. Testing

- Serve the folder: `python3 -m http.server 4180` from the project root, in the Terminal panel. The app's preview server kept serving an old temporary folder, so do not rely on it.
- The browser caches hard. After editing CSS or JS, run `await fetch('<file>', {cache: 'reload'})` then reload, or hard-refresh.
- Check 1360 px and 375 px widths, in English and Arabic. Compare `document.documentElement.scrollWidth` with `innerWidth` to catch sideways scrolling.
- Check syntax without a browser: `node -e "new Function(require('fs').readFileSync('assets/koot.js','utf8'))"`.

## 6. Must do before launch (in this order)

### 6.1 Connect enquiry sending
`K.config.enquiryEndpoint` in `assets/koot.js` is empty, so both forms currently show "we could not send this, email sales@koot.ae". The tray form and the contact form POST JSON through `K.send()`.
- Ask the owner which service to use. The simplest is a form-to-email service that forwards to `sales@koot.ae`. If the site gets a host with serverless functions, write a small function instead.
- Set the endpoint, send a real test, and confirm the email arrives with products, quantities, comments and the visitor's email as reply-to.
- Add spam protection (a hidden honeypot field at minimum).

### 6.2 Replace low-resolution imagery
- Food photos in `assets/img/food/` come from the catalogue PDF at about 750 px. Swap in the owner's new photos from `PHOTO_BRIEF.md` using the same file names.
- The logo (`assets/img/koot-logo.*`) is 420 px wide. Ask for an SVG.
- "Field to plate" stage one is a crop of the printed fries bag. Replace it with the `raw-potatoes` photo.

### 6.3 Content still missing
- Phone number and street address (only the email and "Dubai, UAE" are shown).
- Spec sheets, ingredients and allergens for everything except fries.
- Certifications: the fries PDF lists BRCGS, HACCP, ISO 22000 and Halal. Do not show them until the owner confirms they apply and supplies certificates.
- Empty spreadsheet columns: barcodes, carton dimensions, pallet and container counts, HS codes.
- A native Arabic speaker must review all Arabic copy, including the slogan "طعام له معنى".

### 6.4 Technical
- Hosting and domain. The catalogue names `www.koot.ae`.
- SEO: per-page descriptions, Open Graph image, `sitemap.xml`, `robots.txt`, and Product structured data on product pages.
- Accessibility audit: focus order in the tray and search overlay, contrast of orange text on cream, screen-reader labels on hotspots.
- Test Safari and Firefox. View transitions and the `translate` property degrade silently, but confirm it.
- CSS is now one file. Still to do: delete unused rules (`.duo`, `.brands`, `.steps`, `.range-*`, illustration styles) and fold the override blocks into the original rules. `assets/art.js` still provides `K.paint`, so move that helper before deleting it.
- Do not reuse the class name `.split`: it is the product page two-column layout. The headline effect uses `.wsplit`.

## 7. Ideas to implement next

Each idea says what it does and how it should look.

1. **Container and pallet planner.** In the tray, show how many pallets and what share of a 20 ft or 40 ft container the selection fills, as a horizontal fill bar under the totals line. Blocked until the pallet and container columns in the spreadsheet are filled. Do not estimate.
2. **Per-category hero photography.** Each `category.html?cat=` header gets its wide photo from the brief as a full-bleed image with the title over a soft dark gradient, replacing the pack fan.
3. **"Field to plate" for a second product.** Repeat the scroll story for mango: fruit, frozen pieces, dessert. Same sticky layout, pink accent.
4. **Recipe and serving ideas.** A "Serve it" strip on product pages: three photo cards with a dish name and the Koot products used, each product tappable to add to the selection. Needs content from Koot.
5. **Sample request.** A second action beside "Add to selection": "Request a sample". It flags the item in the tray with a small orange "Sample" tag and includes it in the enquiry.
6. **Saved and shareable selections.** Encode the selection in the URL so a buyer can send a link to a colleague. Add a "Copy link" button in the tray.
7. **WhatsApp contact.** A floating button, bottom corner, opening a chat with the selection pre-written. Needs Koot's business number.
8. **Recently viewed.** A row of the last four products at the bottom of product pages, from `localStorage`.
9. **Stronger PDF catalogue.** Add a category cover image per section and a QR code back to the product page. Keep the current print-based approach.
10. **Real product finder reasons.** Once spec data exists for all products, let the finder ask about application (frying, baking, smoothies) and filter on verified attributes.
11. **Arabic typography pass.** Tune Arabic heading sizes and line heights separately; they currently reuse the English scale.
12. **Analytics.** Privacy-friendly page and event tracking for: add to selection, enquiry sent, finder completed, catalogue saved. Needs the owner's consent and a cookie notice if required.

## 8. Look and feel to preserve

Warm cream pages, one strong idea per screen, large serif headlines with one italic gradient word, real food photography with rounded 28 px corners, white cards for packs, deep green sections for emphasis, orange only for the enquiry action and small accents. Motion is smooth and short: content rises in once, photos unveil from the bottom, pages cross-fade. Nothing bounces, flashes or loops except the pack shelf, which pauses on hover.

## 9. More ideas (added later, not yet agreed with the owner)

Buyer tools
- **Quick order sheet.** One table of all 54 items with a quantity box per row and "Add all to selection". Sticky header, category subheadings, search filter on top. For buyers who already know what they want.
- **Export selection to Excel.** A CSV download button in the tray, same columns as the Resources item list plus quantity and unit.
- **Repeat last enquiry.** Remember the last sent enquiry in `localStorage` and offer "Repeat it" in the empty tray.
- **Copy of the enquiry to the buyer.** After sending, email the buyer the same list (needs the sending service).
- **Buyer FAQ.** Minimum order, delivery areas, lead times, samples, payment terms. Accordion on `business.html`. Needs answers from Koot.

Storytelling
- **Origin map.** Stylised map with Egypt, India and Belgium linked to Dubai by animated route lines. Tapping a country lists its products. Goes on `about.html`.
- **Pack and contents slider.** On product pages, a drag handle that wipes between the pack photo and a close-up of the food inside. Needs one food photo per product.
- **Back-of-pack photos.** A second image per product showing the nutrition and ingredients panel. Solves the missing ingredient data for most products.
- **Short hero video.** A muted 6 to 8 second loop (fries, steam, salt) behind the hero, with the current photo as the poster and fallback.
- **New and featured ribbon.** A small "New" tag on cards, driven by a column in the spreadsheet.

Trust and growth
- **Certificates page.** Downloadable certificates with issue and expiry dates, only once Koot confirms and supplies them.
- **Supplier application form.** A "Supply to Koot" page for producers, sent through the same enquiry service.
- **QR codes on packs.** Each pack links to its product page, which then shows preparation and serving ideas.
- **Product assistant.** A chat box that answers questions only from `products.js` and the spec sheets, and can add items to the selection.
- **Market landing pages.** Short pages per export market for importers, in Arabic first where relevant.

## 10. Design, motion and ease-of-use upgrades (ideas, not yet built)

Keep every effect short, optional under reduced motion, and smooth on a mid-range phone. Animate only `transform`, `opacity` and `clip-path`.

Motion
- **Headline line reveal.** Split h1 and h2 into lines; each line slides up from behind a mask, 80 ms apart. Replaces the current whole-block rise.
- **Smooth category switch.** On `category.html`, cards fade and shift 12 px when filters change instead of re-rendering instantly. Use the View Transitions API (`document.startViewTransition`) around `draw()`.
- **Pinned horizontal category scroll.** On the homepage, replace the range switcher with a section that pins and scrolls six full-height category panels sideways as the user scrolls down. On phones, use a swipe carousel with snap.
- **Scroll-linked "field to plate".** Drive the three stages by scroll position (scale and cross-fade tied to progress) instead of three discrete states. CSS scroll-driven animations where supported, current behaviour as fallback.
- **Number and bar animation.** Grade-guide bars and tray totals animate from zero when they enter view or change.
- **Add-to-selection flight.** When a product is added, a small copy of its photo flies to the header selection button, which pulses once.
- **Header that hides.** Header slides away on scroll down and returns on scroll up, to give content more room on phones.
- **Cursor-following glow** on dark green sections: a soft light that follows the pointer. Desktop only.

Look
- **Single clean stylesheet.** Merge `koot.css` and `extras.css`, remove overrides, and define a spacing scale (4, 8, 12, 16, 24, 32, 48, 72, 120) used everywhere.
- **Bento grid on the homepage.** Replace the three stacked "quality" cards and the business list with one asymmetric grid of rounded tiles mixing photos, numbers and short statements.
- **Bigger, calmer type.** Fewer sizes: one display size, one heading size, one body size, one label size. More white space between sections.
- **Category colour themes.** Each category page tints its header, chips and buttons with its accent, so the six categories feel distinct.
- **Skeleton loading.** Grey shimmer placeholders for product cards and photos while images load, so nothing jumps.
- **Icons.** One consistent line-icon set for storage, origin, shelf life and pack, used in spec tables and cards.
- **Dark mode.** Deep green background with cream text, following the device setting.

Ease of use
- **Sticky filter summary on phones.** A single "Filters" button opening a bottom sheet, with active filters shown as removable chips.
- **Bottom navigation on phones.** Four items: Products, Finder, Selection, Contact. Replaces the burger menu for the main actions.
- **Quantity straight from the card.** A small stepper appears on a card after "Add", so buyers set quantities without opening the tray.
- **Mega menu on desktop.** Hovering "Products" opens a panel with the six categories and their photos.
- **Breadcrumb and back that keep filters.** Returning from a product restores the category page's filters and scroll position.
- **Clear empty and error states.** Friendly illustrations-free messages with one obvious next action.
- **Keyboard and screen-reader pass.** Focus trap in the tray and search, visible focus rings, labels on hotspots.
- **Speed.** Serve AVIF with WebP fallback, add `width`/`height` to every image, preload the hero photo and fonts, and self-host the fonts.


## 11. Built from section 10

One stylesheet with a spacing scale, the pinned sideways category scroll on the homepage (a swipe carousel on phones and with reduced motion), the add-to-selection flight, the phone bottom navigation, and the headline word reveal. `applyLang` now rewrites translated text only when the language changes, so JS effects on headings survive re-renders.

## 12. Bug fixes (latest pass)

- Phone menu was transparent: the header's `backdrop-filter` made it the containing block for the fixed menu, collapsing the panel to 40 px. The panel now has an explicit height and solid background, and the page behind is locked.
- Menu switches to the burger below 1180 px (labels wrapped at 1040 px). Nav labels never wrap.
- Product page sticky enquiry bar never appeared after a fast scroll (IntersectionObserver missed it). Now checked on every scroll.
- Toast covered the sticky bar; it now lifts above it.
- Add-to-selection flight started from an off-screen photo; it now starts at the button when the photo is out of view.
- Phone filters wrapped into a tall block; each group is now one swipeable row.
- Compare table was too wide on phones; it now fits three products.
- Finder "Next" was below the fold on phones; it is now pinned above the bottom navigation.
