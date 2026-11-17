#!/usr/bin/env python3
"""Build assets/products.js and tools/DATA_REPORT.md from src/skus.json.
Re-run after editing the spreadsheet:  python3 tools/read_sheet.py "src/Koot SKUs.xlsx" src/skus.json && python3 tools/build_data.py
"""
import json, re, os
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
rows = {r['Item #']: r for r in json.load(open(f'{ROOT}/src/skus.json')) if r.get('Item #')}
IMG = 'assets/img/products/'
have = {f.rsplit('-', 1)[0] for f in os.listdir(ROOT + '/' + IMG)}

CATS = [
 ('fries','French fries','بطاطس مقلية'),('vegetables','Vegetables','خضروات'),('fruits','Fruits & pulps','فواكه ولبّ'),
 ('seafood','Seafood','مأكولات بحرية'),('sauces','Sauces','صلصات'),('pickles','Pickles','مخللات')]
SHELF_MONTHS = 24   # confirmed by Koot for every product

# (id, cat, EN name, AR name, [(sku, photo-slug, extra-label-en, extra-label-ar)], blurb en, blurb ar)
P = []
def add(id, cat, en, ar, skus, note=None): P.append(dict(id=id, cat=cat, en=en, ar=ar, skus=skus, note=note))

add('fries-9','fries','French Fries 9 × 9 mm','بطاطس مقلية 9 × 9 مم',[
  ('KOO101','french-fries-9-mm-printed-2-5-kg','Grade A · printed bag','درجة A · كيس مطبوع'),
  ('KOO102','french-fries-9-mm-transparent-2-5-kg','Grade AB · transparent bag','درجة AB · كيس شفاف'),
  ('KOO103','french-fries-9-mm-transparent-2-5-kg','Grade B · transparent bag','درجة B · كيس شفاف')])
add('fries-7','fries','French Fries 7 × 7 mm','بطاطس مقلية 7 × 7 مم',[
  ('KOO107','french-fries-7-mm-printed-2-5-kg','Grade A · printed bag','درجة A · كيس مطبوع'),
  ('KOO108','french-fries-7-mm-transparent-2-5-kg','Grade AB · transparent bag','درجة AB · كيس شفاف')])
add('fries-coated','fries','Coated French Fries 7 × 7 mm','بطاطس مقلية مغلّفة 7 × 7 مم',[
  ('KOO104','coated-french-fries-2-5-kg','','')])
for key, en, ar, a, b in [('okra-extra-zero','Okra Extra Zero','بامية إكسترا زيرو','KOO1010','KOO109'),
    ('okra-zero','Okra Zero','بامية زيرو','KOO1012','KOO1011'),('okra-fine','Okra Fine','بامية فاين','KOO1014','KOO1013'),
    ('okra-one','Okra One','بامية ون','KOO1016','KOO1015')]:
    add(key,'vegetables',en,ar,[(a,key+'-2-5-kg','',''),(b,key+'-2-5-kg','','')])
for key,en,ar,a,b,ph in [
  ('broccoli','Broccoli Florets','زهيرات بروكلي','KOO1018','KOO1017','broccoli-2-5-kg'),
  ('green-peas','Green Peas','بازلاء خضراء','KOO1020','KOO1019','green-peas-2-5-kg'),
  ('carrots-peas','Carrots & Peas','جزر وبازلاء','KOO1022','KOO1021','carrots-and-peas-2-5-kg'),
  ('green-beans','Cut Green Beans','فاصوليا خضراء مقطعة','KOO1024','KOO1023','cut-green-beans-2-5-kg'),
  ('sweetcorn','Sweetcorn','ذرة حلوة','KOO1026','KOO1025','sweetcorn-2-5-kg'),
  ('corn-cob','Corn on the Cob','أكواز ذرة','KOO1028','KOO1027','corn-on-the-cob-2-5-kg'),
  ('veg-3way','3-Way Vegetable Mix','خليط خضار ثلاثي','KOO1030','KOO1029','mixed-vegetables-3-way-2-5-kg'),
  ('veg-4way','4-Way Vegetable Mix','خليط خضار رباعي','KOO1032','KOO1031','mixed-vegetables-4-way-2-5-kg')]:
    add(key,'vegetables',en,ar,[(a,ph,'',''),(b,ph,'','')])
add('spinach','vegetables','Spinach','سبانخ',[('KOO1033','spinach-400-g','','')])
add('moloukhia','vegetables','Moloukhia','ملوخية',[('KOO1034','moloukhia-400-g','','')])
add('mango-diced','fruits','Diced Mango','مكعبات مانجو',[('KOO1035','mango-diced-2-5-kg','','')])
add('mango-slices','fruits','Mango Slices','شرائح مانجو',[('KOO1036','mango-slices-2-5-kg','','')])
add('mango-pulp','fruits','Mango Pulp','لب مانجو',[('KOO1037','mango-pulp-1-kg','','')])
add('guava-pulp','fruits','Guava Pulp','لب جوافة',[('KOO1038','guava-pulp-1-kg','','')])
add('strawberries','fruits','Whole Strawberries','فراولة كاملة',[
  ('KOO105','strawberries-printed-2-5-kg','Grade A · printed bag','درجة A · كيس مطبوع'),
  ('KOO1039','strawberries-transparent-2-5-kg','Grade AB · transparent bag','درجة AB · كيس شفاف'),
  ('KOO106','strawberries-transparent-2-5-kg','Grade B · transparent bag','درجة B · كيس شفاف')])
add('shrimp-tail-on','seafood','Raw Peeled Shrimp, Tail-On','روبيان نيئ مقشر بالذيل',[
  ('KOO1040','raw-peeled-shrimp-tail-on-medium-1-kg','Medium','متوسط'),
  ('KOO1041','raw-peeled-shrimp-tail-on-large-1-kg','Large','كبير'),
  ('KOO1042','raw-peeled-shrimp-tail-on-jumbo-1-kg','Jumbo','جامبو')])
add('shrimp-tail-off','seafood','Raw Peeled Shrimp, Tail-Off','روبيان نيئ مقشر بدون ذيل',[
  ('KOO1044','raw-peeled-shrimp-tail-off-medium-1-kg','Medium','متوسط'),
  ('KOO1045','raw-peeled-shrimp-tail-off-large-1-kg','Large','كبير'),
  ('KOO1046','raw-peeled-shrimp-tail-off-jumbo-1-kg','Jumbo','جامبو')])
add('shrimp-cooking','seafood','Cooking Shrimp','روبيان للطبخ',[('KOO1043','cooking-shrimp-1-kg','','')])
add('fish-fillets','seafood','White Fish Fillets','فيليه سمك أبيض',[
  ('KOO1048','white-fish-fillets','',''),('KOO1047','white-fish-fillets','','')])
add('ketchup','sauces','Ketchup','كاتشب',[('KOO1049','ketchup-5-kg','','')])
add('mustard','sauces','Mustard','خردل',[('KOO1050','mustard-5-kg','','')])
add('mayonnaise','sauces','Mayonnaise','مايونيز',[('KOO1051','mayo-5-kg','','')])
add('big-tasty','sauces','Big Tasty Sauce','صوص بيغ تايستي',[('KOO1052','big-tasty-sauce-5-kg','','')])
add('dill-pickles','pickles','Dill Pickle Slices','شرائح خيار مخلل بالشبت',[('KOO1053','dill-pickles-5-kg','','')])
add('arabic-mix','pickles','Arabic Mix Mokhallil','مخلل عربي مشكل',[('KOO1054','arabic-mix-mokhallil-5-kg','','')])

def num(s):
    f = float(s); return int(f) if f == int(f) else f
def kg(w): return (f'{w*1000:g} g' if w < 1 else f'{w:g} kg')
def kg_ar(w): return (f'{w*1000:g} جم' if w < 1 else f'{w:g} كجم')
used, report, products = set(), {'photo_missing': [], 'multi_origin': {}}, []
cat_map = {'fries':'French Fries','vegetables':'Vegetables','fruits':'Fruits','seafood':'Seafood','sauces':'Sauces','pickles':'Pickles'}
for p in P:
    vs = []
    for sku, photo, lab_en, lab_ar in p['skus']:
        r = rows[sku]; used.add(sku)
        if photo not in have: report['photo_missing'].append((sku, photo))
        w = num(r['Product Weight / Pcs']); n = num(r['Pac / Ctn'])
        vs.append(dict(sku=sku, pack=f'{n} × {kg(w)}', pack_ar=f'{n} × {kg_ar(w)}', unit_kg=w, per_carton=n,
            net_carton_kg=round(w*n,2), gross_carton_kg=num(r['Gross Weight / Ctn (kg)']),
            label=lab_en, label_ar=lab_ar, origin=r['Country Of Origin'], storage=r['STORAGE'],
            packaging=r['PRIMARY PACKAGING TYPE'], image=IMG + photo, desc_en=re.sub(r'\s*\n\s*',' · ',r['English Description']), desc_ar=r['Arabic Description']))
    origins = sorted({v['origin'] for v in vs})
    products.append(dict(id=p['id'], cat=p['cat'], en=p['en'], ar=p['ar'], image=vs[0]['image'], origin=origins, storage=vs[0]['storage'],
        shelf_life_months=SHELF_MONTHS, variants=vs))
unused = sorted(set(rows) - used)
assert not unused, unused
out = dict(categories=[dict(id=i,en=e,ar=a) for i,e,a in CATS], products=products)
open(f'{ROOT}/assets/products.js','w').write('/* GENERATED by tools/build_data.py from the Koot SKU sheet. Do not edit by hand. */\nwindow.KOOT_DATA = '+json.dumps(out,ensure_ascii=False,indent=1)+';\n')
print(len(products),'products,',sum(len(p['variants']) for p in products),'SKUs, photo missing:',report['photo_missing'])
from collections import Counter
print(Counter(p['cat'] for p in products))
print({p['id']:p['origin'] for p in products if p['origin']!=['Egypt']})
