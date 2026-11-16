/* Koot data layer. Real products come from products.js (generated from the SKU sheet).
   Load products.js BEFORE this file. */
(function () {
  var D = window.KOOT_DATA, K = window.KOOT = {};
  var look = {
    fries: { accent: '#F3B21F', line: { en: 'Golden, crisp and consistent, in the cut your menu needs.', ar: 'ذهبية ومقرمشة وثابتة الجودة، بالقطع الذي تحتاجه قائمتك.' } },
    vegetables: { accent: '#6DB04A', line: { en: 'Frozen at their best, ready for any kitchen.', ar: 'مجمدة في أفضل حالاتها وجاهزة لكل مطبخ.' } },
    fruits: { accent: '#E2485A', line: { en: 'Bright fruit and smooth pulps for drinks and desserts.', ar: 'فواكه زاهية ولبّ ناعم للمشروبات والحلويات.' } },
    seafood: { accent: '#4FA3B8', line: { en: 'Carefully selected seafood for retail and foodservice.', ar: 'مأكولات بحرية مختارة بعناية للتجزئة وخدمات الطعام.' } },
    sauces: { accent: '#E0603A', line: { en: 'The finishing touch for every plate.', ar: 'اللمسة الأخيرة لكل طبق.' } },
    pickles: { accent: '#A9B83C', line: { en: 'Crunch and tang, packed with character.', ar: 'قرمشة ونكهة لاذعة مليئة بالشخصية.' } }
  };
  K.cats = D.categories.map(function (c) { return { id: c.id, en: c.en, ar: c.ar, accent: look[c.id].accent, line: look[c.id].line }; });
  K.cat = function (id) { return K.cats.find(function (c) { return c.id === id; }); };

  K.list = D.products;
  K.byId = function (id) { return K.list.find(function (p) { return p.id === id; }); };

  /* every SKU is its own selectable item, so enquiries are exact */
  K.products = {};
  K.list.forEach(function (p) {
    p.variants.forEach(function (v) {
      var multi = p.variants.length > 1;
      K.products[v.sku] = {
        en: p.en + (multi ? ' · ' + (v.label || v.pack) : ''),
        ar: p.ar + (multi ? ' · ' + (v.label_ar || v.pack_ar) : ''),
        cat: p.cat, image: v.image, pid: p.id, note: v.pack + ' · ' + v.sku, gross: v.gross_carton_kg, net: v.net_carton_kg
      };
    });
  });

  var tr = {
    Egypt: 'مصر', India: 'الهند', Belgium: 'بلجيكا',
    Frozen: 'مجمد', Ambient: 'درجة حرارة الغرفة',
    'Printed bag': 'كيس مطبوع', 'Transparent bag': 'كيس شفاف', 'Handled plastic jar': 'جركن بلاستيك بمقبض', 'Transparent jar': 'برطمان شفاف'
  };
  K.tr = function (s) { return K.lang === 'ar' ? (tr[s] || s) : s; };
  K.src = function (img, w) { return img + '-' + (w || 600) + '.webp'; };
  K.shelf = function (p) { return K.lang === 'ar' ? p.shelf_life_months + ' شهراً' : p.shelf_life_months + ' months'; };
  K.packs = function (p) {
    var seen = [];
    p.variants.forEach(function (v) { var l = K.lang === 'ar' ? v.pack_ar : v.pack; if (seen.indexOf(l) < 0) seen.push(l); });
    return seen;
  };
  K.weights = function (p) {
    var seen = [];
    p.variants.forEach(function (v) { var w = v.unit_kg < 1 ? v.unit_kg * 1000 + ' g' : v.unit_kg + ' kg'; if (seen.indexOf(w) < 0) seen.push(w); });
    return seen;
  };
})();
