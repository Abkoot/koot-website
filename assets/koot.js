/* Koot shared behaviour: chrome, language, selection tray, motion. */
(function () {
  var K = window.KOOT, doc = document, root = doc.documentElement;
  root.classList.add('js');
  var store = {
    get: function (k, d) { try { var v = localStorage.getItem(k); return v ? JSON.parse(v) : d; } catch (e) { return d; } },
    set: function (k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) {} }
  };
  var $ = function (s, r) { return (r || doc).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || doc).querySelectorAll(s)); };

  /* ---------- language ---------- */
  K.lang = 'en';   /* English only: the Arabic version was removed */
  K.L = function (en, ar) { return '<span data-ar="' + ar + '">' + en + '</span>'; };
  K.t = function (o) { return K.lang === 'ar' ? o.ar : o.en; };
  K.applyLang = function (scope) {
    root.lang = K.lang; root.dir = K.lang === 'ar' ? 'rtl' : 'ltr';
    $$('[data-ar]', scope).forEach(function (el) {
      if (el.dataset.en === undefined) { el.dataset.en = el.innerHTML; el.dataset.lng = 'en'; }
      if (el.dataset.lng === K.lang) return;   /* only rewrite when the language really changes */
      el.innerHTML = K.lang === 'ar' ? el.dataset.ar : el.dataset.en; el.dataset.lng = K.lang;
    });
    $$('[data-ar-ph]', scope).forEach(function (el) {
      if (el.dataset.enPh === undefined) el.dataset.enPh = el.placeholder;
      el.placeholder = K.lang === 'ar' ? el.dataset.arPh : el.dataset.enPh;
    });
    var lb = $('.lang'); if (lb) lb.textContent = K.lang === 'ar' ? 'English' : 'العربية';
  };

  /* ---------- chrome ---------- */
  var L = K.L;
  var nav = [['about.html', 'About Koot', 'عن كوت'], ['category.html', 'Products', 'المنتجات'], ['rfq.html', 'Trade enquiry', 'استفسار تجاري'], ['resources.html', 'Resources', 'المصادر']];
  doc.body.insertAdjacentHTML('afterbegin',
    '<a class="skip" href="#main">Skip to content</a><header class="hdr"><a class="logo" href="index.html" aria-label="Koot home"><img src="assets/img/koot-logo.webp" alt="Koot, food that matters" width="112" height="48"></a>' +
    '<nav class="nav" id="nav" aria-label="Main">' + nav.map(function (n) { return '<a href="' + n[0] + '" data-ar="' + n[2] + '">' + n[1] + '</a>'; }).join('') + '</nav>' +
    '<div class="tools"><a class="ico" href="category.html#search" aria-label="Search products"><svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="11" cy="11" r="7"/><path d="M16.5 16.5L21 21"/></svg></a>' +
        '<a class="selbtn" href="rfq.html">' + L('Contact sales', 'تواصل مع المبيعات') + '</a>' +
    '<button class="burger" type="button" aria-label="Menu" aria-expanded="false" aria-controls="nav"><i></i><i></i></button></div></header>');
  doc.body.insertAdjacentHTML('beforeend',
    '<footer class="ftr"><div class="wrap ftr-grid"><div><span class="logo"><img src="assets/img/koot-logo.webp" alt="Koot" width="168" height="72"></span><p class="ftr-line" data-ar="طعام له معنى.">Food that matters.</p><p data-ar="كوت · علامة أغذية من كوت إكسبرت للتجارة العامة ذ.م.م · دبي، الإمارات العربية المتحدة">Koot · a food brand of Koot Expert General Trading LLC · Dubai, United Arab Emirates<br><a href="mailto:sales@koot.ae">sales@koot.ae</a></p></div>' +
    '<div><h4 data-ar="استكشف">Explore</h4><a href="about.html" data-ar="عن كوت">About Koot</a><a href="category.html" data-ar="المنتجات">Products</a><a href="rfq.html" data-ar="استفسار تجاري">Trade enquiry</a><a href="resources.html" data-ar="المصادر">Resources</a></div>' +
    '<div><h4 data-ar="كوت">Koot</h4><a href="about.html#contact" data-ar="تواصل معنا">Contact</a></div></div>' +
    '<div class="wrap ftr-note"><p data-ar="© 2026 كوت إكسبرت للتجارة العامة ذ.م.م. جميع الحقوق محفوظة.">© 2026 Koot Expert General Trading LLC. All rights reserved.</p><nav class="socials" aria-label="Social media"><a href="https://www.facebook.com/people/KootUAE/100092333833482/" target="_blank" rel="noopener">Facebook</a><a href="https://www.instagram.com/koot.uae/" target="_blank" rel="noopener">Instagram</a><a href="https://www.linkedin.com/company/koot-uae/" target="_blank" rel="noopener">LinkedIn</a><a href="https://www.tiktok.com/@koot.uae" target="_blank" rel="noopener">TikTok</a></nav></div></footer>' +
    '<div class="toast" role="status"></div>');

  /* ---------- request for quotation (RFQ) ----------
     The RFQ is a list of SKUs stored in localStorage 'koot-sel' as [{id: <sku>, qty, unit}].
     Visitors add whole categories, then trim products on rfq.html. */
  var sel = store.get('koot-sel', []);
  /* Requests are POSTed as JSON to enquiryEndpoint. While it is empty nothing is sent and the
     forms tell the visitor to email sales@koot.ae instead. rfqTo is the team mailing list. See HANDOFF.md. */
  K.config = { enquiryEndpoint: '', rfqTo: ['sales@koot.ae'] };
  K.send = function (data) {
    if (!K.config.enquiryEndpoint) return Promise.reject(new Error('not configured'));
    return fetch(K.config.enquiryEndpoint, { method: 'POST', headers: { 'Content-Type': 'application/json', Accept: 'application/json' }, body: JSON.stringify(data) }).then(function (r) { if (!r.ok) throw new Error('HTTP ' + r.status); return r; });
  };
  function skusOf(cat) { var o = []; K.list.forEach(function (p) { if (p.cat === cat) p.variants.forEach(function (v) { o.push(v.sku); }); }); return o; }
  function catOn(cat) { var ids = skusOf(cat); return ids.length && ids.every(function (id) { return sel.some(function (s) { return s.id === id; }); }); }
  function catAny(cat) { var ids = skusOf(cat); return ids.some(function (id) { return sel.some(function (s) { return s.id === id; }); }); }
  K.sel = function () { return sel; };
  K.catOn = catOn; K.catAny = catAny; K.skusOf = skusOf;
  function render() {
    var n = K.cats.filter(function (c) { return catAny(c.id); }).length;
    $$('[data-count]').forEach(function (b) { b.textContent = n; b.classList.toggle('on', n > 0); });
    $$('[data-addcat]').forEach(function (b) {
      var on = catOn(b.dataset.addcat);
      b.innerHTML = L('Enquire about this range', 'استفسر عن هذه الفئة');
    });
    $$('[data-sel-summary]').forEach(function (el) {
      el.innerHTML = n ? L(n + (n === 1 ? ' category' : ' categories') + ' in your RFQ', n + ' فئات في طلبك') : L('Your RFQ is empty. Add a category to start.', 'طلبك فارغ. أضف فئة للبدء.');
    });
    K.applyLang(doc);
  }
  function save() { store.set('koot-sel', sel); render(); doc.dispatchEvent(new CustomEvent('koot:sel')); }
  K.save = save;
  function toast(html) { var t = $('.toast'); t.innerHTML = html; t.classList.add('on'); clearTimeout(toast.t); toast.t = setTimeout(function () { t.classList.remove('on'); }, 3200); K.applyLang(t); }
  K.addCat = function (cat) { skusOf(cat).forEach(function (id) { if (!sel.some(function (s) { return s.id === id; })) sel.push({ id: id, qty: 1, unit: 'cartons' }); }); save(); };
  K.removeCat = function (cat) { var ids = skusOf(cat); sel = sel.filter(function (s) { return ids.indexOf(s.id) < 0; }); save(); };
  K.remove = function (id) { sel = sel.filter(function (s) { return s.id !== id; }); save(); };
  K.clear = function () { sel = []; save(); };

  doc.addEventListener('click', function (e) {
    var t = e.target.closest('button,a'); if (!t) return;
    if (t.dataset.addcat) {
      location.href = 'rfq.html#' + t.dataset.addcat;   /* trading site: no basket, the range is pre-ticked on the enquiry form */
    }
    else if (t.hasAttribute('data-tray-open')) location.href = 'rfq.html';
    else if (t.classList.contains('lang')) { K.lang = K.lang === 'ar' ? 'en' : 'ar'; store.set('koot-lang', K.lang); render(); doc.dispatchEvent(new CustomEvent('koot:lang')); }
    else if (t.classList.contains('burger')) { var o = doc.body.classList.toggle('nav-open'); t.setAttribute('aria-expanded', o); }
    else if (t.closest('.nav')) doc.body.classList.remove('nav-open');
  });
  doc.addEventListener('keydown', function (e) { if (e.key === 'Escape') doc.body.classList.remove('nav-open'); });

  /* ---------- motion ---------- */
  K.reveal = function (scope) {
    if (!('IntersectionObserver' in window)) { $$('[data-reveal]', scope).forEach(function (el) { el.classList.add('in'); }); return; }
    var io = K._io || (K._io = new IntersectionObserver(function (es) { es.forEach(function (en) { if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); } }); }, { rootMargin: '0px 0px -8% 0px' }));
    $$('[data-reveal]:not(.in)', scope).forEach(function (el) { io.observe(el); });
  };
  var hdr = $('.hdr'), p2p = $('.p2p'), tick = false;
  function onScroll() {
    tick = false;
    hdr.classList.toggle('scrolled', window.scrollY > 12);
    if (p2p) {
      var r = p2p.getBoundingClientRect(), p = Math.min(1, Math.max(0, -r.top / (r.height - window.innerHeight)));
      p2p.dataset.stage = Math.min(2, Math.floor(p * 3)); p2p.style.setProperty('--p', p.toFixed(3));
    }
  }
  window.addEventListener('scroll', function () { if (!tick) { tick = true; requestAnimationFrame(onScroll); } }, { passive: true });

  K.refresh = render;
  K.boot = function () { K.paint(); render(); K.reveal(); onScroll(); };
})();
