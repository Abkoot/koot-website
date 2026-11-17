# Koot product data report

Source: `src/Koot SKUs.xlsx` (54 SKUs), `Koot_Product_Images.zip` (39 photos), `KOOT_Product_Specification.pdf` (French fries only).
Result: 54 SKUs grouped into 32 products across 6 categories. Every product has a photo. Rebuild with `python3 tools/build_data.py`.

## Decisions applied (from Koot)

- Shelf life is 24 months for every product (confirmed by Koot).
- Where a product is sold as 2.5 kg and 1 kg, the 2.5 kg photo is the main image and the 1 kg pack shows as an extra pack size.
- Grade B fries and Grade B strawberries use the transparent-bag photo.
- Where there was only one photo for several sizes (white fish fillets, okra, vegetables), that photo is used and both sizes are listed.

## Origins in the sheet

| Origin | Products |
|---|---|
| Egypt | 51 SKUs: everything not listed below |
| India | Mango Pulp (KOO1037), Guava Pulp (KOO1038) |
| Belgium | Coated French Fries 7 × 7 mm (KOO104) |

## Still needs an answer

1. **Shelf life (resolved).** Koot confirmed 24 months for every product.
2. **Ambient products.** Sauces and pickles (6 SKUs) are ambient, not frozen. They show 24 months like everything else.
3. **Fries grade AA.** The specification PDF covers grades AA, A, AB and B. The sheet only has A, AB and B for fries. Add AA to the sheet if it is sold.
4. **Certifications.** The PDF lists BRCGS, HACCP, ISO 22000 and Halal. Confirm these apply to Koot products and to all categories, not only fries, before they appear on the site. Certificates must be supplied for the Resources page.
5. **Specification sheets for everything except fries.** The PDF is for fries only. Vegetables, fruits, seafood, sauces and pickles have no spec sheet, ingredients or allergen details yet.
6. **Cooking instructions.** Fries: deep fry at 170–180 °C for 3–5 minutes (PDF). Nothing supplied for other products.
7. **Strawberry naming.** The sheet has "Koot Strawberry" (grades A and B) and "Koot Whole Strawberries" (grade AB). The site groups them as one product, "Whole Strawberries", with three grades.
8. **Mayonnaise.** The photo file is named "Mayo". The site uses "Mayonnaise", as in the sheet.

## Empty columns in the sheet (all 54 SKUs)

Carton barcode, unit barcode, secondary packaging type, pack and carton dimensions, cartons per pallet, pallets per 20" and 40" container, HS code, cubic metres per pallet and per carton.
Importers will ask for pallet and container data, so these are worth filling in. Until then the site shows only what exists: pack size, carton weight, origin, storage and shelf life.

## Logo

The PDF logo is a low-resolution scan of a whole page, so it cannot be used. The pack photos show the real logo: a bold italic green "Koot" with a leaf arrow, "food that matters" in orange, and an Arabic "قوت" on the specification sheet. The current site wordmark does not match it. A vector or high-resolution logo file is needed.
