/* Koot extras: instant search, photo zoom, count-up numbers, hero parallax.
   Load after koot.js. */
(function () {
  var K = window.KOOT, doc = document;
  function T(en, ar) { return K.lang === 'ar' ? ar : en; }
  function nm(x) { return K.lang === 'ar' ? x.ar : x.en; }
  var calm = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- instant search ---------- */
  var so, input, res;
  function build() {
    doc.body.insertAdjacentHTML('beforeend', '<div class="so" role="dialog" aria-modal="true" aria-label="Search"><div class="so-box"><label class="so-in"><svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><circle cx="11" cy="11" r="7"/><path d="M16.5 16.5L21 21"/></svg><input type="search" autocomplete="off" spellcheck="false"><kbd>esc</kbd></label><div class="so-res"></div></div></div>');
    so = doc.querySelector('.so'); input = so.querySelector('input'); res = so.querySelector('.so-res');
    input.addEventListener('input', function () { draw(input.value.trim()); });
    so.addEventListener('click', function (e) { if (e.target === so) close(); });
    so.addEventListener('keydown', function (e) {
      var items = Array.prototype.slice.call(res.querySelectorAll('a')), i = items.indexOf(doc.activeElement);
      if (e.key === 'ArrowDown') { e.preventDefault(); (items[i + 1] || items[0] || input).focus(); }
      else if (e.key === 'ArrowUp') { e.preventDefault(); (i > 0 ? items[i - 1] : input).focus(); }
      else if (e.key === 'Enter' && doc.activeElement === input && items[0]) items[0].click();
    });
  }
  function hay(p) { return (p.en + ' ' + p.ar + ' ' + K.cat(p.cat).en + ' ' + K.cat(p.cat).ar + ' ' + p.variants.map(function (v) { return v.sku + ' ' + v.desc_en + ' ' + v.origin; }).join(' ')).toLowerCase(); }
  function draw(q) {
    input.placeholder = T('Search products or item codes', 'ابحث عن منتج أو رمز صنف');
    if (!q) {
      res.innerHTML = '<p class="so-h">' + T('Browse by category', 'تصفّح حسب الفئة') + '</p><div class="so-chips">' + K.cats.map(function (c) { return '<a class="chip" href="category.html?cat=' + c.id + '">' + nm(c) + '</a>'; }).join('') + '</div>' +
        '<p class="so-h">' + T('Shortcuts', 'اختصارات') + '</p><div class="so-chips"><a class="chip" href="finder.html">' + T('Product finder', 'اختر منتجك') + '</a><a class="chip" href="catalogue.html">' + T('Build a PDF catalogue', 'أنشئ كتالوج PDF') + '</a><a class="chip" href="resources.html">' + T('Downloads', 'التنزيلات') + '</a></div>';
      return;
    }
    var terms = q.toLowerCase().split(/\s+/), hits = K.list.filter(function (p) { var h = hay(p); return terms.every(function (t) { return h.indexOf(t) > -1; }); });
    res.innerHTML = hits.length ? hits.slice(0, 8).map(function (p) {
      return '<a class="so-item" href="product.html?p=' + p.id + '"><img src="' + K.src(p.image, 600) + '" alt=""><span><strong>' + nm(p) + '</strong><small>' + nm(K.cat(p.cat)) + ' · <bdi dir="ltr">' + K.packs(p).join(' · ') + '</bdi></small></span><span class="arr">→</span></a>';
    }).join('') + (hits.length > 8 ? '<p class="so-h">' + T('Showing 8 of ' + hits.length + '. Keep typing to narrow it down.', 'عرض 8 من ' + hits.length + '. تابع الكتابة للتضييق.') + '</p>' : '')
      : '<p class="so-none">' + T('No products match “' + q.replace(/</g, '&lt;') + '”.', 'لا توجد منتجات مطابقة.') + ' <a href="category.html">' + T('Browse all products', 'تصفّح كل المنتجات') + '</a></p>';
  }
  function open() { if (!so) build(); so.classList.add('on'); doc.body.classList.add('so-open'); input.value = ''; draw(''); input.focus(); }
  function close() { if (so) { so.classList.remove('on'); doc.body.classList.remove('so-open'); } }
  doc.addEventListener('click', function (e) {
    if (e.target.closest('.hdr .ico')) { e.preventDefault(); open(); }
    var ph = e.target.closest('.pdp-photo');
    if (ph) zoom(ph.querySelector('img'));
  });
  doc.addEventListener('keydown', function (e) {
    var typing = /INPUT|TEXTAREA|SELECT/.test((e.target.tagName || ''));
    if ((e.key === 'k' && (e.metaKey || e.ctrlKey)) || (e.key === '/' && !typing)) { e.preventDefault(); open(); }
    else if (e.key === 'Escape') close();
  });
  doc.addEventListener('koot:lang', function () { if (so && so.classList.contains('on')) draw(input.value.trim()); });

  /* ---------- photo zoom ---------- */
  function zoom(img) {
    if (!img || !img.src) return;
    var d = doc.querySelector('dialog.zoom');
    if (!d) { doc.body.insertAdjacentHTML('beforeend', '<dialog class="zoom" aria-label="Pack photo"><img alt=""></dialog>'); d = doc.querySelector('dialog.zoom'); d.addEventListener('click', function () { d.close(); }); }
    d.querySelector('img').src = img.src.replace('-600.webp', '-1200.webp');
    d.showModal();
  }

  /* ---------- count-up numbers ---------- */
  K.countUp = function (scope) {
    var els = Array.prototype.slice.call((scope || doc).querySelectorAll('[data-count-to]'));
    if (!els.length) return;
    function run(el) {
      var to = +el.dataset.countTo, t0 = null;
      if (calm) { el.textContent = to; return; }
      function step(t) { if (!t0) t0 = t; var p = Math.min(1, (t - t0) / 1100); el.textContent = Math.round(to * (1 - Math.pow(1 - p, 3))); if (p < 1) requestAnimationFrame(step); }
      requestAnimationFrame(step);
    }
    if (!('IntersectionObserver' in window)) { els.forEach(run); return; }
    var io = new IntersectionObserver(function (es) { es.forEach(function (en) { if (en.isIntersecting) { run(en.target); io.unobserve(en.target); } }); }, { threshold: .4 });
    els.forEach(function (el) { io.observe(el); });
  };

  /* ---------- hero parallax ---------- */
  var art = doc.querySelector('.hero-art');
  if (art && !calm) window.addEventListener('scroll', function () { if (window.scrollY < 1200) art.style.setProperty('--sy', window.scrollY); }, { passive: true });
})();

/* ---------- modern motion layer: scroll progress and card tilt ---------- */
(function () {
  var doc = document, hdr = doc.querySelector('.hdr'), t = false;
  function sp() { t = false; var h = doc.documentElement.scrollHeight - innerHeight; if (hdr) hdr.style.setProperty('--sp', h > 0 ? (scrollY / h).toFixed(4) : 0); }
  addEventListener('scroll', function () { if (!t) { t = true; requestAnimationFrame(sp); } }, { passive: true }); sp();
  if (!matchMedia('(hover:hover) and (pointer:fine)').matches || matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  doc.addEventListener('pointermove', function (e) {
    var a = e.target.closest && e.target.closest('.pcard-art'); if (!a) return;
    var r = a.getBoundingClientRect(), x = (e.clientX - r.left) / r.width - .5, y = (e.clientY - r.top) / r.height - .5;
    a.style.setProperty('--ry', (x * 10).toFixed(1) + 'deg'); a.style.setProperty('--rx', (-y * 8).toFixed(1) + 'deg');
  });
  doc.addEventListener('pointerout', function (e) { var a = e.target.closest && e.target.closest('.pcard-art'); if (a && !a.contains(e.relatedTarget)) { a.style.setProperty('--ry', '0deg'); a.style.setProperty('--rx', '0deg'); } });
})();

/* ---------- pinned sideways category scroll ---------- */
(function () {
  var K = window.KOOT, hs = document.querySelector('.hs'); if (!hs) return;
  var track = hs.querySelector('.hs-track'), mq = matchMedia('(max-width: 860px), (prefers-reduced-motion: reduce)'), tick = false;
  function mode() { hs.classList.toggle('static', mq.matches); hs.style.setProperty('--n', K.cats.length); update(); }
  function mark(i) {
    hs.querySelectorAll('.hs-panel').forEach(function (p, k) { p.classList.toggle('on', k === i); });
    hs.querySelectorAll('.hs-dots i').forEach(function (d, k) { d.classList.toggle('on', k === i); });
  }
  function update() {
    tick = false;
    var panels = hs.querySelectorAll('.hs-panel'); if (!panels.length) return;
    if (mq.matches) { track.style.transform = ''; var w = panels[0].offsetWidth + 24; mark(Math.round(Math.abs(track.scrollLeft) / w)); return; }
    var r = hs.getBoundingClientRect(), span = hs.offsetHeight - innerHeight, p = Math.min(1, Math.max(0, -r.top / span));
    var dist = track.scrollWidth - track.clientWidth, rtl = document.documentElement.dir === 'rtl';
    track.style.transform = 'translate3d(' + ((rtl ? 1 : -1) * p * dist).toFixed(1) + 'px,0,0)';
    mark(Math.min(panels.length - 1, Math.round(p * (panels.length - 1))));
  }
  K.hsUpdate = update;
  addEventListener('scroll', function () { if (!tick) { tick = true; requestAnimationFrame(update); } }, { passive: true });
  addEventListener('resize', update); track.addEventListener('scroll', update, { passive: true });
  if (mq.addEventListener) mq.addEventListener('change', mode);
  mode();
})();

/* ---------- add-to-selection flight ---------- */
(function () {
  var K = window.KOOT;
  K.fly = function (btn) {
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    var scope = btn.closest('.pcard, .scene-card, .pdp, .stick, .fd-stage, li') || document;
    var img = scope.querySelector('img') || document.querySelector('.p-img');
    var targets = [document.querySelector('.bnav [data-tray-open]'), document.querySelector('.selbtn')].filter(function (t) { return t && t.offsetParent; });
    var to = targets[0]; if (!img || !to) return;
    var a = img.getBoundingClientRect(), b = to.getBoundingClientRect(); if (!a.width) return;
    if (a.bottom < 0 || a.top > innerHeight) { var br = btn.getBoundingClientRect(); a = { left: br.left, top: br.top - 60, width: 70, height: 90 }; }
    var c = document.createElement('img'); c.src = img.currentSrc || img.src; c.className = 'fly';
    var w = Math.min(a.width, 140), h = w * (a.height / a.width) || w;
    c.style.cssText = 'left:' + (a.left + a.width / 2 - w / 2) + 'px;top:' + (a.top + a.height / 2 - h / 2) + 'px;width:' + w + 'px;height:' + h + 'px';
    document.body.appendChild(c);
    var dx = b.left + b.width / 2 - (a.left + a.width / 2), dy = b.top + b.height / 2 - (a.top + a.height / 2);
    c.animate([{ transform: 'translate(0,0) scale(1)', opacity: 1 }, { transform: 'translate(' + dx * .55 + 'px,' + (dy * .55 - 90) + 'px) scale(.55)', opacity: 1, offset: .55 }, { transform: 'translate(' + dx + 'px,' + dy + 'px) scale(.12)', opacity: .3 }], { duration: 750, easing: 'cubic-bezier(.5,0,.3,1)' }).onfinish = function () {
      c.remove(); to.classList.remove('bump'); void to.offsetWidth; to.classList.add('bump');
    };
  };
})();

/* ---------- phone bottom navigation ---------- */
(function () {
  var page = location.pathname.split('/').pop() || 'index.html';
  function ico(d) { return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + d + '</svg>'; }
  var items = [
    ['category.html', 'Products', 'المنتجات', '<rect x="3" y="3" width="7" height="7" rx="2"/><rect x="14" y="3" width="7" height="7" rx="2"/><rect x="3" y="14" width="7" height="7" rx="2"/><rect x="14" y="14" width="7" height="7" rx="2"/>'],
    ['finder.html', 'Finder', 'اختر منتجك', '<circle cx="11" cy="11" r="7"/><path d="M16.5 16.5 21 21M11 8v6M8 11h6"/>'],
    [null, 'Selection', 'اختياراتك', '<path d="M5 8h14l-1.2 11.2a2 2 0 0 1-2 1.8H8.2a2 2 0 0 1-2-1.8z"/><path d="M9 8V6a3 3 0 0 1 6 0v2"/>'],
    ['about.html#contact', 'Contact', 'تواصل', '<path d="M4 6h16v12H4z"/><path d="m4 7 8 6 8-6"/>']
  ];
  document.body.insertAdjacentHTML('beforeend', '<nav class="bnav" aria-label="Quick links">' + items.map(function (it) {
    var label = '<span data-ar="' + it[2] + '">' + it[1] + '</span>';
    if (!it[0]) return '<button type="button" data-tray-open>' + ico(it[3]) + label + '<b data-count>0</b></button>';
    var here = it[0].split('#')[0] === page;
    return '<a href="' + it[0] + '"' + (here ? ' class="here" aria-current="page"' : '') + '>' + ico(it[3]) + label + '</a>';
  }).join('') + '</nav>');
})();

/* ---------- headline word reveal ---------- */
(function () {
  var K = window.KOOT, calm = matchMedia('(prefers-reduced-motion: reduce)').matches;
  var SEL = '.hero h1, .sec h2, .chero h1, .about-hero h1, .shelf h2, .fb h2, .p2p h2';
  function wrapNode(node, i) {
    if (node.nodeType === 3) {
      var parts = node.textContent.split(/(\s+)/), frag = document.createDocumentFragment();
      parts.forEach(function (w) {
        if (!w) return;
        if (/^\s+$/.test(w)) { frag.appendChild(document.createTextNode(w)); return; }
        var o = document.createElement('span'); o.className = 'wr'; var n = document.createElement('span'); n.textContent = w; n.style.setProperty('--i', i.n++); o.appendChild(n); frag.appendChild(o);
      });
      node.parentNode.replaceChild(frag, node);
    } else if (node.nodeType === 1 && node.tagName === 'EM') {
      var o2 = document.createElement('span'); o2.className = 'wr'; node.parentNode.insertBefore(o2, node);
      var n2 = document.createElement('span'); n2.style.setProperty('--i', i.n++); o2.appendChild(n2); n2.appendChild(node);
    } else if (node.nodeType === 1) Array.prototype.slice.call(node.childNodes).forEach(function (c) { wrapNode(c, i); });
  }
  function split(scope) {
    if (calm) return;
    var io = split.io || (split.io = new IntersectionObserver(function (es) { es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } }); }, { rootMargin: '0px 0px -6% 0px' }));
    (scope || document).querySelectorAll(SEL).forEach(function (h) {
      if (h.querySelector('.wr') || h.closest('.hs-panel')) return;
      var seen = h.dataset.wrSeen === '1';
      Array.prototype.slice.call(h.childNodes).forEach(function (c) { wrapNode(c, { n: 0 }); });
      h.classList.add('wsplit'); h.dataset.wrSeen = '1';
      if (seen) h.classList.add('in'); else io.observe(h);
    });
  }
  var boot = K.boot;
  K.boot = function () { boot.apply(this, arguments); split(); };
  document.addEventListener('koot:lang', function () { setTimeout(split, 0); });
})();
