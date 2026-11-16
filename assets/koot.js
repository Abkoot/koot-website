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
  K.lang = store.get('koot-lang', 'en');
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
  var nav = [['category.html', 'Products', 'المنتجات'], ['finder.html', 'Product finder', 'اختر منتجك'], ['business.html', 'For Your Business', 'لأعمالك'], ['about.html', 'Our Story', 'قصتنا'], ['resources.html', 'Resources', 'المصادر']];
  doc.body.insertAdjacentHTML('afterbegin',
    '<a class="skip" href="#main">Skip to content</a><header class="hdr"><a class="logo" href="index.html" aria-label="Koot home"><img src="assets/img/koot-logo.webp" alt="Koot, food that matters" width="112" height="48"></a>' +
    '<nav class="nav" id="nav" aria-label="Main">' + nav.map(function (n) { return '<a href="' + n[0] + '" data-ar="' + n[2] + '">' + n[1] + '</a>'; }).join('') + '</nav>' +
    '<div class="tools"><a class="ico" href="category.html#search" aria-label="Search products"><svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="11" cy="11" r="7"/><path d="M16.5 16.5L21 21"/></svg></a>' +
    '<button class="lang" type="button" aria-label="Switch language"></button>' +
    '<button class="selbtn" type="button" data-tray-open>' + L('Your selection', 'اختياراتك') + '<b data-count>0</b></button>' +
    '<button class="burger" type="button" aria-label="Menu" aria-expanded="false" aria-controls="nav"><i></i><i></i></button></div></header>');
  doc.body.insertAdjacentHTML('beforeend',
    '<footer class="ftr"><div class="wrap ftr-grid"><div><span class="logo"><img src="assets/img/koot-logo.webp" alt="Koot" width="168" height="72"></span><p class="ftr-line" data-ar="طعام له معنى.">Food that matters.</p><p data-ar="كوت إكسبرت للتجارة العامة ذ.م.م · دبي، الإمارات العربية المتحدة">Koot Expert General Trading LLC · Dubai, United Arab Emirates<br><a href="mailto:sales@koot.ae">sales@koot.ae</a></p></div>' +
    '<div><h4 data-ar="استكشف">Explore</h4><a href="category.html" data-ar="المنتجات">Products</a><a href="business.html" data-ar="لأعمالك">For your business</a><a href="finder.html" data-ar="اختر منتجك">Product finder</a><a href="catalogue.html" data-ar="أنشئ كتالوجك">Build a catalogue</a><a href="resources.html" data-ar="المصادر">Resources</a></div>' +
    '<div><h4 data-ar="الشركة">Company</h4><a href="about.html" data-ar="قصتنا">Our story</a><a href="about.html#quality" data-ar="الجودة والمصادر">Quality and sourcing</a><a href="about.html#contact" data-ar="تواصل معنا">Contact</a></div></div>' +
    '<div class="wrap ftr-note"><p data-ar="© 2026 كوت إكسبرت للتجارة العامة ذ.م.م. جميع الحقوق محفوظة.">© 2026 Koot Expert General Trading LLC. All rights reserved.</p><nav class="socials" aria-label="Social media"><a href="https://www.facebook.com/people/KootUAE/100092333833482/" target="_blank" rel="noopener">Facebook</a><a href="https://www.instagram.com/koot.uae/" target="_blank" rel="noopener">Instagram</a><a href="https://www.linkedin.com/company/koot-uae/" target="_blank" rel="noopener">LinkedIn</a><a href="https://www.tiktok.com/@koot.uae" target="_blank" rel="noopener">TikTok</a></nav></div></footer>' +
    '<div class="scrim" data-tray-close></div><aside class="tray" aria-label="Your selection" aria-hidden="true"><header><h3 data-ar="اختياراتك">Your selection</h3><button type="button" class="x" data-tray-close aria-label="Close">×</button></header><div class="tray-body"></div></aside>' +
    '<div class="toast" role="status"></div>');

  /* ---------- selection ---------- */
  var sel = store.get('koot-sel', []);
  var draft = { email: '', company: '', dest: '', biz: 'Foodservice', msg: '' };
  function esc(s) { return String(s || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/"/g, '&quot;'); }
  /* Enquiries are POSTed as JSON to this address. While it is empty nothing can be sent
     and the forms tell the visitor to email sales@koot.ae instead. See HANDOFF.md. */
  K.config = { enquiryEndpoint: '' };
  K.send = function (data) {
    if (!K.config.enquiryEndpoint) return Promise.reject(new Error('not configured'));
    return fetch(K.config.enquiryEndpoint, { method: 'POST', headers: { 'Content-Type': 'application/json', Accept: 'application/json' }, body: JSON.stringify(data) }).then(function (r) { if (!r.ok) throw new Error('HTTP ' + r.status); return r; });
  };
  var units = [['cartons', 'Cartons', 'كراتين'], ['pallets', 'Pallets', 'منصات'], ['containers', 'Containers', 'حاويات']];
  function name(id) { var p = K.products[id]; return p ? K.t(p) : id; }
  function render() {
    var n = sel.length;
    $$('[data-count]').forEach(function (b) { b.textContent = n; b.classList.toggle('on', n > 0); });
    $$('[data-add]').forEach(function (b) {
      var on = sel.some(function (s) { return s.id === b.dataset.add; });
      b.classList.toggle('is-added', on);
      b.innerHTML = on ? L('Added ✓', 'تمت الإضافة ✓') : L('Add to selection', 'أضف إلى اختياراتك');
    });
    $$('[data-sel-summary]').forEach(function (el) {
      el.innerHTML = n ? L(n + (n === 1 ? ' product' : ' products') + ' in your selection', (n === 1 ? 'منتج واحد' : n === 2 ? 'منتجان' : n + (n <= 10 ? ' منتجات' : ' منتجاً')) + ' في اختياراتك') : L('Your selection is empty. Add products as you explore.', 'اختياراتك فارغة. أضف المنتجات أثناء تصفحك.');
    });
    var body = $('.tray-body');
    if (!n) {
      body.innerHTML = '<p class="tray-empty" data-ar="لم تضف أي منتج بعد. تصفّح المنتجات وأضف ما يهمّك، ثم أرسل طلباً واحداً منظماً.">Nothing here yet. Browse the range, add what interests you, then send one organised enquiry.</p><a class="btn" href="category.html" data-ar="تصفّح المنتجات">Browse products</a>';
    } else {
      body.innerHTML = '<ul class="tray-list">' + sel.map(function (s, i) {
        var p = K.products[s.id] || {};
        return '<li data-i="' + i + '"><div class="ti-art">' + (p.image ? '<img src="' + K.src(p.image, 600) + '" alt="" loading="lazy">' : '') + '</div><div class="ti-main"><strong>' + name(s.id) + '</strong><small><bdi dir="ltr">' + (p.note || s.note || '') + '</bdi></small>' +
          '<div class="ti-row"><span class="qty"><button type="button" data-q="-1" aria-label="Less">−</button><output>' + s.qty + '</output><button type="button" data-q="1" aria-label="More">+</button></span>' +
          '<select data-unit aria-label="Unit">' + units.map(function (u) { return '<option value="' + u[0] + '"' + (u[0] === s.unit ? ' selected' : '') + '>' + (K.lang === 'ar' ? u[2] : u[1]) + '</option>'; }).join('') + '</select>' +
          '<button type="button" class="rm" data-rm>' + L('Remove', 'إزالة') + '</button></div></div></li>';
      }).join('') + '</ul>' + (function () {
        var ctn = 0, gross = 0, other = 0;
        sel.forEach(function (s) { var p = K.products[s.id] || {}; if (s.unit === 'cartons') { ctn += s.qty; gross += s.qty * (p.gross || 0); } else other++; });
        return '<p class="tray-total">' + (ctn ? '<strong>' + L(ctn + (ctn === 1 ? ' carton' : ' cartons'), ctn + ' كرتون') + '</strong> · ' + L('about', 'حوالي') + ' <bdi dir="ltr">' + gross.toLocaleString('en') + ' kg</bdi> ' + L('gross', 'إجمالي') : '') + (other ? '<small>' + L(other + (other === 1 ? ' item' : ' items') + ' in pallets or containers: weight confirmed with your quotation.', other + ' أصناف بالمنصات أو الحاويات: يُؤكَّد الوزن مع عرض السعر.') + '</small>' : '') + '</p>';
      })() +
        '<form class="tray-form"><label>' + L('Your email', 'بريدك الإلكتروني') + '<input name="email" type="email" required autocomplete="email" value="' + esc(draft.email) + '"></label>' +
        '<label>' + L('Company (optional)', 'الشركة (اختياري)') + '<input name="company" autocomplete="organization" value="' + esc(draft.company) + '"></label>' +
        '<label>' + L('Delivery destination', 'وجهة التسليم') + '<input name="dest" data-ar-ph="المدينة، الدولة" placeholder="City, country" value="' + esc(draft.dest) + '"></label>' +
        '<label>' + L('Your business', 'نوع نشاطك') + '<select name="biz">' + [['Foodservice', 'خدمات الطعام'], ['Retail and quick-commerce', 'تجزئة وتجارة سريعة'], ['Import and wholesale', 'استيراد وتجارة جملة']].map(function (o) { return '<option value="' + o[0] + '"' + (draft.biz === o[0] ? ' selected' : '') + '>' + (K.lang === 'ar' ? o[1] : o[0]) + '</option>'; }).join('') + '</select></label>' +
        '<label>' + L('Comments (optional)', 'ملاحظات (اختياري)') + '<textarea name="msg" rows="3">' + esc(draft.msg) + '</textarea></label>' +
        '<button class="btn btn--orange" type="submit">' + L('Send enquiry', 'أرسل الطلب') + '</button><p class="form-msg" role="alert"></p>' +
        '<a class="btn btn--ghost" href="catalogue.html">' + L('Build a PDF catalogue', 'أنشئ كتالوج PDF') + '</a>' +
        '<p class="form-note">' + L('Or email us directly at', 'أو راسلنا مباشرة على') + ' <a href="mailto:sales@koot.ae">sales@koot.ae</a></p></form>';
    }
    K.paint(body); K.applyLang(doc);
  }
  function save() { store.set('koot-sel', sel); render(); }
  function toast(html) { var t = $('.toast'); t.innerHTML = html; t.classList.add('on'); clearTimeout(toast.t); toast.t = setTimeout(function () { t.classList.remove('on'); }, 3200); K.applyLang(t); }
  function tray(open) { doc.body.classList.toggle('tray-open', open); $('.tray').setAttribute('aria-hidden', !open); if (open) $('.tray .x').focus(); }
  K.add = function (id, note) {
    var f = sel.find(function (s) { return s.id === id; });
    if (f) { if (note) f.note = note; } else sel.push({ id: id, qty: 1, unit: 'cartons', note: note || '' });
    save(); toast(L('Added to your selection', 'أضيف إلى اختياراتك') + ' <button type="button" data-tray-open>' + L('View', 'عرض') + '</button>');
  };
  K.has = function (id) { return sel.some(function (s) { return s.id === id; }); };

  doc.addEventListener('click', function (e) {
    var t = e.target.closest('button,a,[data-tray-close]'); if (!t) return;
    if (t.dataset.add) { if (K.has(t.dataset.add)) tray(true); else { if (K.fly) K.fly(t); K.add(t.dataset.add, t.dataset.note); } }
    else if (t.hasAttribute('data-tray-open')) tray(true);
    else if (t.hasAttribute('data-tray-close')) tray(false);
    else if (t.classList.contains('lang')) { K.lang = K.lang === 'ar' ? 'en' : 'ar'; store.set('koot-lang', K.lang); render(); doc.dispatchEvent(new CustomEvent('koot:lang')); }
    else if (t.classList.contains('burger')) { var o = doc.body.classList.toggle('nav-open'); t.setAttribute('aria-expanded', o); }
    else if (t.closest('.nav')) doc.body.classList.remove('nav-open');
    else if (t.dataset.q) { var s = sel[t.closest('li').dataset.i]; s.qty = Math.max(1, s.qty + +t.dataset.q); save(); }
    else if (t.hasAttribute('data-rm')) { sel.splice(t.closest('li').dataset.i, 1); save(); }
    else if (t.hasAttribute('data-pdf')) toast(L('Concept: the launch build generates a branded PDF of these products.', 'نموذج: النسخة النهائية تنشئ كتالوج PDF لهذه المنتجات.'));
  });
  doc.addEventListener('change', function (e) { if (e.target.matches('[data-unit]')) { sel[e.target.closest('li').dataset.i].unit = e.target.value; save(); } });
  doc.addEventListener('input', function (e) { var f = e.target.closest && e.target.closest('.tray-form'); if (f && e.target.name) draft[e.target.name] = e.target.value; });
  doc.addEventListener('submit', function (e) {
    if (!e.target.matches('.tray-form')) return; e.preventDefault();
    var f = e.target, btn = f.querySelector('[type=submit]'), msg = f.querySelector('.form-msg'), mail = f.email.value;
    var lines = sel.map(function (s) { var p = K.products[s.id] || {}; return (p.en || s.id) + ' (' + s.id + '): ' + s.qty + ' ' + s.unit; });
    btn.disabled = true; msg.innerHTML = L('Sending…', 'جارٍ الإرسال…'); K.applyLang(msg);
    K.send({ _subject: 'Koot enquiry (' + sel.length + ' items)' + (f.company.value ? ' from ' + f.company.value : ''), email: mail, company: f.company.value, business: f.biz.value, destination: f.dest.value, comments: f.msg.value, products: lines.join('\n') }).then(function () {
      sel = []; draft.msg = ''; store.set('koot-sel', sel); render();
      $('.tray-body').innerHTML = '<div class="tray-done"><h3 data-ar="تم إرسال طلبك.">Your enquiry is sent.</h3><p>' + L('We will reply to', 'سنرد عليك على') + ' <bdi>' + esc(mail) + '</bdi>.</p><button class="btn" type="button" data-tray-close data-ar="متابعة التصفح">Keep exploring</button></div>';
      K.applyLang($('.tray-body'));
    }).catch(function () {
      btn.disabled = false; msg.innerHTML = L('We could not send this from the website. Please email us directly at', 'تعذّر الإرسال من الموقع. راسلنا مباشرة على') + ' <a href="mailto:sales@koot.ae">sales@koot.ae</a>.'; K.applyLang(msg);
    });
  });
  doc.addEventListener('keydown', function (e) { if (e.key === 'Escape') { tray(false); doc.body.classList.remove('nav-open'); } });

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
