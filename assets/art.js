/* Koot placeholder art.
   Stylised SVG stand-ins for the photography and pack renders that the
   real site will use. Every function here maps to a photo slot. */
(function () {
  var K = window.KOOT;
  function rng(s) { return function () { s |= 0; s = s + 0x6D2B79F5 | 0; var t = Math.imul(s ^ s >>> 15, 1 | s); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; }; }
  function scatter(n, r, seed, fn) {
    var R = rng(seed), o = '';
    for (var i = 0; i < n; i++) { var a = R() * 6.283, d = Math.sqrt(R()) * r; o += fn((200 + Math.cos(a) * d).toFixed(1), (200 + Math.sin(a) * d).toFixed(1), (R() * 360).toFixed(0), R(), i); }
    return o;
  }
  function at(x, y, rot, inner, s) { return '<g transform="translate(' + x + ' ' + y + ') rotate(' + rot + ')' + (s ? ' scale(' + s + ')' : '') + '">' + inner + '</g>'; }
  function plate(inner) {
    return '<circle cx="200" cy="210" r="180" fill="rgba(0,0,0,.13)"/><circle cx="200" cy="200" r="180" fill="#FFFDF7"/><circle cx="200" cy="200" r="134" fill="none" stroke="#EADFCB" stroke-width="2"/>' + inner;
  }
  function bowl(color) {
    return '<circle cy="7" r="74" fill="rgba(0,0,0,.13)"/><circle r="74" fill="#FFFDF7"/><circle r="58" fill="' + color + '"/><path d="M-30 0q15-22 30 0t30 0" stroke="rgba(255,255,255,.45)" stroke-width="6" fill="none" stroke-linecap="round"/>';
  }
  var food = {
    fries: function () {
      return scatter(22, 62, 7, function (x, y, rot, k) {
        return at(x, y, rot, '<rect x="-60" y="-9" width="120" height="18" rx="5" fill="' + (k > .5 ? '#F5B82E' : '#EDA41A') + '"/><rect x="-60" y="-9" width="120" height="6" rx="3" fill="#FCD875" opacity=".85"/>');
      });
    },
    vegetables: function () {
      return scatter(64, 108, 3, function (x, y, rot, k, i) {
        if (i % 3 === 0) return at(x, y, rot, '<rect x="-11" y="-11" width="22" height="22" rx="5" fill="#F0832A"/><rect x="-11" y="-11" width="22" height="8" rx="4" fill="#F7A65A"/>');
        if (i % 3 === 1) return at(x, y, 0, '<circle r="11" fill="#5FA644"/><circle cx="-3" cy="-4" r="4" fill="#8CCB6B"/>');
        return at(x, y, rot, '<ellipse rx="9" ry="12" fill="#F6CB3C"/><ellipse cx="-2" cy="-3" rx="3" ry="5" fill="#FBE38A"/>');
      });
    },
    fruits: function () {
      var berry = '<path d="M0-14C14-24 26-6 0 22C-26-6-14-24 0-14Z" fill="#D8334A"/><path d="M-9-15q9-9 18 0q-9 6-18 0Z" fill="#3E8E4A"/><g fill="#F9D36B"><circle cx="-6" cy="-2" r="1.4"/><circle cx="5" cy="-4" r="1.4"/><circle cx="0" cy="6" r="1.4"/><circle cx="8" cy="4" r="1.4"/><circle cx="-8" cy="6" r="1.4"/></g>';
      return scatter(9, 96, 21, function (x, y, rot) { return at(x, y, rot, '<rect x="-14" y="-14" width="28" height="28" rx="6" fill="#F6B12B"/><rect x="-14" y="-14" width="28" height="10" rx="5" fill="#FBD05F"/>'); }) +
        scatter(10, 92, 11, function (x, y, rot) { return at(x, y, rot - 180, berry, 2); });
    },
    seafood: function () {
      var shrimp = '<path d="M-20 10A22 22 0 1 1 20 10" fill="none" stroke="#F3956F" stroke-width="13" stroke-linecap="round"/><path d="M-20 10A22 22 0 1 1 20 10" fill="none" stroke="#FBC4A6" stroke-width="13" stroke-linecap="round" stroke-dasharray="3 11"/><path d="M20 10l12 4-8 10Z" fill="#E9744F"/>';
      return scatter(7, 86, 5, function (x, y, rot) { return at(x, y, rot, shrimp, 1.5); }) +
        at(292, 276, 20, '<path d="M-34 0A34 34 0 0 1 34 0Z" fill="#F7D94C"/><path d="M-26 0A26 26 0 0 1 26 0Z" fill="#FBEB9A"/>');
    },
    sauces: function () {
      return at(122, 138, 0, bowl('#C8372B'), .82) + at(282, 152, 40, bowl('#E3AC1E'), .82) + at(196, 286, 90, bowl('#F3E7C6'), .82);
    },
    pickles: function () {
      var slice = '<circle r="26" fill="#6E9434"/><circle r="21" fill="#C9DA82"/><g fill="#9DB65A"><ellipse cy="-9" rx="3" ry="5"/><ellipse cx="9" cy="3" rx="3" ry="5" transform="rotate(110 9 3)"/><ellipse cx="-9" cy="3" rx="3" ry="5" transform="rotate(-110 -9 3)"/></g>';
      return scatter(17, 98, 9, function (x, y, rot) { return at(x, y, rot, slice); });
    }
  };
  function svg(vb, cls, label, inner) { return '<svg class="art ' + cls + '" viewBox="' + vb + '" role="img" aria-label="' + label + '">' + inner + '</svg>'; }

  var art = {
    scene: function (id) {
      var inner = food[id]();
      return svg('0 0 400 400', 'art-scene', 'Prepared ' + id, id === 'sauces' ? inner : plate(inner));
    },
    pack: function (id, label) {
      var c = K.cat(id);
      return svg('0 0 300 400', 'art-pack', 'Koot ' + c.en + ' pack',
        '<defs><linearGradient id="pg" x1="0" x2="1"><stop offset="0" stop-color="#174A30"/><stop offset=".5" stop-color="#25704A"/><stop offset="1" stop-color="#174A30"/></linearGradient></defs>' +
        '<ellipse cx="150" cy="388" rx="118" ry="9" fill="rgba(0,0,0,.2)"/>' +
        '<path d="M24 22h252l-8 22 10 316q0 22-22 22H44q-22 0-22-22L32 44z" fill="url(#pg)"/>' +
        '<path d="M24 22h252l-8 22H32z" fill="#0F3523"/>' +
        '<rect x="46" y="66" width="208" height="150" rx="14" fill="#FAF5EA"/>' +
        '<text x="150" y="130" text-anchor="middle" font-family="Fraunces,Georgia,serif" font-weight="800" font-size="66" letter-spacing="-3" fill="#1E5A3C">koot</text>' +
        '<text x="150" y="156" text-anchor="middle" font-family="Instrument Sans,sans-serif" font-weight="700" font-size="11" letter-spacing="2.4" fill="#F0832A">FOOD THAT MATTERS</text>' +
        '<text x="150" y="194" text-anchor="middle" font-family="Instrument Sans,sans-serif" font-weight="600" font-size="17" fill="#15221B">' + (label || c.en) + '</text>' +
        '<circle cx="150" cy="294" r="64" fill="' + c.accent + '"/><circle cx="150" cy="294" r="52" fill="#FFFDF7"/>' +
        '<g transform="translate(150 294) scale(.26) translate(-200 -200)">' + food[id]() + '</g>');
    },
    potato: function () {
      function p(x, y, rot, s) {
        return at(x, y, rot, '<ellipse cy="10" rx="96" ry="66" fill="rgba(0,0,0,.25)"/><ellipse rx="96" ry="66" fill="#C99755"/><ellipse cx="-14" cy="-16" rx="70" ry="38" fill="#DDB273" opacity=".7"/><g fill="#A87A3E"><ellipse cx="-40" cy="14" rx="6" ry="3"/><ellipse cx="30" cy="-20" rx="5" ry="3"/><ellipse cx="46" cy="26" rx="6" ry="3"/><ellipse cx="-4" cy="38" rx="4" ry="2"/></g>', s);
      }
      return svg('0 0 400 400', 'art-scene', 'Potatoes', p(150, 170, -18, 1.15) + p(262, 262, 24, .95) + p(118, 292, 8, .6));
    },
    table: function () {
      return svg('0 0 800 500', 'art-table', 'A table with fries, sauce and vegetables',
        '<rect width="800" height="500" rx="36" fill="#E7D9BD"/><g stroke="#DCCBA8" stroke-width="2"><path d="M0 120h800M0 250h800M0 380h800"/></g>' +
        '<g transform="translate(90 50)">' + plate(food.fries()) + '</g>' +
        at(622, 150, 0, bowl('#C8372B')) +
        '<g transform="translate(630 362) scale(.46) translate(-200 -200)">' + plate(food.vegetables()) + '</g>');
    }
  };
  K.art = art;
  K.paint = function (scope) {
    (scope || document).querySelectorAll('[data-art]').forEach(function (el) {
      if (el.firstChild) return;
      var a = el.dataset.art.split(':');
      el.innerHTML = art[a[0]](a[1], a[2]);
    });
  };
})();
