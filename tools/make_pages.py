#!/usr/bin/env python3
"""Generates about.html and resources.html (shared head/scripts)."""
import os
R=os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
HEAD='''<!doctype html>
<html lang="en" dir="ltr">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>%(title)s · Koot</title>
<meta name="description" content="%(desc)s">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Alexandria:wght@400;600;700&family=Fraunces:ital,opsz,wght@0,9..144,400..800;1,9..144,400..600&family=IBM+Plex+Sans+Arabic:wght@400;500;600&family=Instrument+Sans:wght@400;500;600;700&display=swap" rel="stylesheet">
<link rel="stylesheet" href="assets/koot.css">
<link rel="icon" href="assets/img/favicon.svg" type="image/svg+xml">
</head>
<body>
<main id="main">
'''
TAIL='''</main>
<script src="assets/products.js"></script>
<script src="assets/data.js"></script>
<script src="assets/art.js"></script>
<script src="assets/koot.js"></script>
<script src="assets/extras.js"></script>
<script>
%(js)s
</script>
</body>
</html>
'''
def page(name,title,desc,body,js):
    open(os.path.join(R,name),'w').write(HEAD%dict(title=title,desc=desc)+body+TAIL%dict(js=js))

# ---------------- about ----------------
a='''<section class="about-hero">
  <div class="wrap about-grid">
    <div>
      <p class="crumbs"><a href="index.html" data-ar="الرئيسية">Home</a> / <span data-ar="عن كوت">About Koot</span></p>
      <span class="brandmark"><b>Koot</b><i lang="ar" dir="rtl">كوت</i></span>
      <h1 style="color:var(--orange)" data-ar="طعام له معنى.">Food that matters.</h1>
      <p class="lead" style="margin-top:24px" data-ar="كوت علامة أغذية: بطاطس مقلية وخضروات وفواكه ولبّ ومأكولات بحرية وصلصات ومخللات. نخدم موزّعي خدمات الطعام والمستوردين وتجار الجملة، وتُدار العلامة من كوت إكسبرت للتجارة العامة في دبي.">Koot is a food brand: French fries, vegetables, fruits and pulps, seafood, sauces and pickles. We serve foodservice distributors, importers and wholesalers, and the brand is run by Koot Expert General Trading LLC in Dubai.</p>
    </div>
    <img class="farmer" src="assets/img/food/farmer-line.webp" alt="" loading="lazy">
  </div>
</section>
<section class="sec" id="quality">
  <div class="wrap">
    <div class="pillars">
      <article data-reveal><b>01</b><h3 data-ar="التوريد">Sourcing</h3><p data-ar="بطاطس وخضروات وفواكه ومأكولات بحرية نختارها من المصدر في مصر والهند وبلجيكا.">Potatoes, vegetables, fruit and seafood chosen at the source in Egypt, India and Belgium.</p></article>
      <article data-reveal="2"><b>02</b><h3 data-ar="التصنيع">Manufacturing</h3><p data-ar="تُقطّع وتُجمّد وتُعبّأ وفق مواصفات كوت، مع بطاطس مقلية بدرجات AA وA وAB وB.">Cut, frozen and packed to the Koot specification, with fries graded AA, A, AB and B.</p></article>
      <article data-reveal="3"><b>03</b><h3 data-ar="سلسلة الإمداد">Supply chain</h3><p data-ar="تُحفظ الأصناف المجمدة عند −18 °م وتُورَّد من دبي بالكرتون أو المنصة أو الحاوية.">Frozen lines are kept at −18 °C and supplied from Dubai by the carton, pallet or container.</p></article>
    </div>
  </div>
</section>
<section class="sec sec--green" id="contact">
  <div class="wrap contact-grid">
    <div data-reveal>
      <span class="eyebrow" data-ar="تواصل معنا">Contact</span>
      <h2 data-ar="لنتحدث عن <em>طلبك.</em>">Let's talk about <em>your order.</em></h2>
      <p class="lead" style="margin-top:20px" data-ar="أخبرنا بما تبحث عنه وسنعود إليك.">Tell us what you are looking for and we will come back to you.</p>
      <p class="addr" style="margin-top:26px"><strong>Koot Expert General Trading LLC</strong><br><span data-ar="دبي، الإمارات العربية المتحدة">Dubai, United Arab Emirates</span><br><a href="mailto:sales@koot.ae">sales@koot.ae</a></p>
      <p class="pill" style="margin-top:22px;display:inline-block" data-sel-summary></p>
    </div>
    <form class="cform" data-reveal="2">
      <label><span data-ar="الاسم">Name</span><input name="n" required autocomplete="name"></label>
      <label><span data-ar="الشركة">Company</span><input name="c" autocomplete="organization"></label>
      <label><span data-ar="البريد الإلكتروني">Email</span><input name="e" type="email" required autocomplete="email"></label>
      <label><span data-ar="الدولة">Country</span><input name="co" autocomplete="country-name"></label>
      <label><span data-ar="نوع نشاطك">Your business</span><select name="b"><option data-ar="موزّع خدمات الطعام">Foodservice distributor</option><option data-ar="مستورد / تاجر جملة">Importer / wholesaler</option></select></label>
      <label class="wide"><span data-ar="رسالتك">Message</span><textarea name="m" rows="4"></textarea></label>
      <button class="btn btn--orange wide" type="submit" data-ar="أرسل">Send</button>
      <p class="form-msg wide" role="alert"></p>
      <p class="form-note wide"><span data-ar="أو راسلنا مباشرة على">Or email us directly at</span> <a href="mailto:sales@koot.ae">sales@koot.ae</a></p>
    </form>
  </div>
</section>
'''
aj='''(function () {
  var K = KOOT;
  document.querySelector('.cform').addEventListener('submit', function (e) {
    e.preventDefault();
    var f = e.target, ar = KOOT.lang === 'ar', btn = f.querySelector('[type=submit]'), msg = f.querySelector('.form-msg');
    var items = JSON.parse(localStorage.getItem('koot-sel') || '[]').map(function (s) { var p = KOOT.products[s.id] || {}; return (p.en || s.id) + ' (' + s.id + '): ' + s.qty + ' ' + s.unit; });
    btn.disabled = true; msg.textContent = ar ? 'جارٍ الإرسال…' : 'Sending…';
    KOOT.send({ _subject: 'Koot website message from ' + (f.c.value || f.n.value), name: f.n.value, company: f.c.value, email: f.e.value, country: f.co.value, business: f.b.value, message: f.m.value, products: items.join('\\n') }).then(function () {
      f.innerHTML = '<div class="tray-done wide"><h3>' + (ar ? 'تم إرسال رسالتك.' : 'Your message is sent.') + '</h3><p>' + (ar ? 'سنرد عليك على ' : 'We will reply to ') + f.e.value.replace(/</g, '&lt;') + '.</p></div>';
    }).catch(function () {
      btn.disabled = false; msg.innerHTML = (ar ? 'تعذّر الإرسال من الموقع. راسلنا مباشرة على ' : 'We could not send this from the website. Please email us directly at ') + '<a href="mailto:sales@koot.ae">sales@koot.ae</a>.';
    });
  });
  K.boot();
})();'''
page('about.html','About Koot','Koot is a food brand: sourcing, manufacturing and supply chain for foodservice distributors, importers and wholesalers.',a,aj)

# ---------------- resources ----------------
r='''<section class="chero" style="--accent:#6DB04A">
  <div class="wrap">
    <p class="crumbs"><a href="index.html" data-ar="الرئيسية">Home</a> / <span data-ar="المصادر">Resources</span></p>
    <span class="eyebrow" data-ar="المصادر">Resources</span>
    <h1 data-ar="خذ المعلومات <em>معك.</em>">Take the details <em>with you.</em></h1>
    <p class="lead" style="margin-top:24px" data-ar="الكتالوج وأوراق المواصفات وقائمة كاملة بالأصناف، متاحة بدون تسجيل.">The catalogue, specification sheets and a full item list, available without registration.</p>
  </div>
</section>
<section class="sec">
  <div class="wrap res-grid">
    <a class="res" href="assets/docs/Koot_Catalogue.pdf" target="_blank" rel="noopener" data-reveal>
      <span class="res-type">PDF</span><h3 data-ar="كتالوج كوت">Koot product catalogue</h3><p data-ar="كل فئات كوت: بطاطس وخضروات وفواكه ومأكولات بحرية وصلصات ومخللات.">All six Koot categories: fries, vegetables, fruits, seafood, sauces and pickles.</p><span class="more"><span data-ar="افتح الكتالوج">Open the catalogue</span> <span class="arr">→</span></span>
    </a>
    <a class="res" href="assets/docs/KOOT_Product_Specification.pdf" target="_blank" rel="noopener" data-reveal="2">
      <span class="res-type">PDF · EN</span><h3 data-ar="ورقة مواصفات البطاطس المقلية">French fries specification sheet</h3><p data-ar="المكونات والعيوب المسموحة والتعبئة والتخزين وتعليمات القلي لدرجات AA وA وAB وB.">Ingredients, defect tolerances, packaging, storage and frying instructions for grades AA, A, AB and B.</p><span class="more"><span data-ar="افتح الورقة">Open the sheet</span> <span class="arr">→</span></span>
    </a>
    <button class="res" type="button" data-csv data-reveal="3">
      <span class="res-type">CSV</span><h3 data-ar="قائمة الأصناف الكاملة">Full item list</h3><p data-ar="كل الأصناف برمز الصنف والعبوة والمنشأ والتخزين ومدة الصلاحية وأوزان الكرتون. يُفتح في إكسل.">Every item with item code, pack, origin, storage, shelf life and carton weights. Opens in Excel.</p><span class="more"><span data-ar="تنزيل القائمة">Download the list</span> <span class="arr">↓</span></span>
    </button>
  </div>
  <div class="wrap" style="margin-top:clamp(40px,6vw,80px)">
    <div class="head" data-reveal><h2 data-ar="تحتاج إلى ورقة <em>مواصفات أخرى؟</em>">Need another <em>specification sheet?</em></h2><p class="lead" data-ar="أوراق المنتجات الأخرى متاحة عند الطلب.">Sheets for other products are available on request. Request it with your quotation and we will send it.</p></div>
    <div class="btns"><a class="btn" href="category.html" data-ar="تصفّح المنتجات">Browse products</a><a class="btn btn--ghost" href="rfq.html" data-ar="اطلب عرض سعر">Request a quotation</a></div>
  </div>
</section>
'''
rj='''(function () {
  var K = KOOT;
  document.addEventListener('click', function (e) {
    if (!e.target.closest('[data-csv]')) return;
    var rows = [['Item code', 'Product', 'Option', 'Pack', 'Category', 'Origin', 'Storage', 'Packaging', 'Shelf life (months)', 'Net weight per carton (kg)', 'Gross weight per carton (kg)']];
    K.list.forEach(function (p) { p.variants.forEach(function (v) { rows.push([v.sku, p.en, v.label, v.pack, K.cat(p.cat).en, v.origin, v.storage, v.packaging, p.shelf_life_months, v.net_carton_kg, v.gross_carton_kg]); }); });
    var csv = '\\ufeff' + rows.map(function (r) { return r.map(function (c) { return '"' + String(c).replace(/"/g, '""') + '"'; }).join(','); }).join('\\r\\n');
    var a = document.createElement('a'); a.href = URL.createObjectURL(new Blob([csv], { type: 'text/csv;charset=utf-8' })); a.download = 'Koot_Item_List.csv'; document.body.appendChild(a); a.click(); a.remove();
  });
  K.boot();
})();'''
page('resources.html','Resources','Koot catalogue, French fries specification sheet and a full item list.',r,rj)
print('ok')
