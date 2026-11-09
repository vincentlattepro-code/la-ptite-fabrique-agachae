/* Moteur boutique partagé par les maquettes Signature et Lumière */
window.Shop = (function () {
  const { products, byId, variants, scents, colors, cats, src, eur, Cart } = AGA;
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
  const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  const catName = (id) => (cats.find((c) => c.id === id) || {}).name || '';
  let cfg = {};
  const state = { cat: 'all', price: 'all', color: '', scent: '', sort: 'featured', wish: new Set() };
  try { JSON.parse(sessionStorage.getItem('aga-wish') || '[]').forEach((x) => state.wish.add(x)); } catch (e) {}

  const ICON = {
    heart: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M12 20s-7.5-4.4-7.5-10A4.3 4.3 0 0 1 12 7.4 4.3 4.3 0 0 1 19.5 10c0 5.6-7.5 10-7.5 10Z"/></svg>',
    close: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M6 6l12 12M18 6 6 18"/></svg>',
    arrowL: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M15 5l-7 7 7 7"/></svg>',
    arrowR: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M9 5l7 7-7 7"/></svg>',
    plus: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M12 5v14M5 12h14"/></svg>',
    gift: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="4" y="10" width="16" height="10" rx="1.5"/><path d="M3 7h18v3H3zM12 7v13M12 7c-2-3.5-6-3.5-5.5-1S12 7 12 7Zm0 0c2-3.5 6-3.5 5.5-1S12 7 12 7Z"/></svg>',
  };

  /* ——— Cartes produit ——— */
  function card(p, opt = {}) {
    const chips = (p.badges || []).slice(0, 1).map((b) => `<span class="chip">${b}</span>`).join('') + (p.ill ? '<span class="chip chip-ill">Visuel provisoire</span>' : '');
    const extra = cfg.cardMedia ? cfg.cardMedia(p) : '';
    const meta = p.cat === 'bougies' ? `<span class="pmeta">${p.burn} · ${p.scentDefault}</span>`
      : p.variants ? `<span class="pmeta">${variants[p.variants].length} ${p.variants === 'creoles' ? 'finitions' : 'modèles'}</span>` : `<span class="pmeta">${catName(p.cat)}</span>`;
    const wished = state.wish.has(p.id);
    return `<article class="pcard ${opt.cls || ''}" data-id="${p.id}">
      <a class="pmedia" href="#produit-${p.id}" aria-label="${esc(p.name)}">${chips}<span class="pimg"><img src="${src(p.img)}" alt="${esc(p.name)}" loading="lazy" class="${p.flip ? 'flip' : ''}">${cfg.imgExtra ? cfg.imgExtra(p) : ''}</span>${extra}</a>
      <button class="wish" data-wish="${p.id}" aria-pressed="${wished}" aria-label="Ajouter ${esc(p.name)} aux favoris">${ICON.heart}</button>
      <div class="pbody">
        <div class="prow"><h3><a href="#produit-${p.id}">${p.name}</a></h3><span class="pprice price">${p.variants ? '<small>dès</small> ' : ''}${eur(p.price)}</span></div>
        ${meta}
        <button class="padd ${cfg.addCls ? cfg.addCls(p) : ''}" data-add="${p.id}">${p.variants ? 'Choisir mon modèle' : (cfg.addLabel ? cfg.addLabel(p) : 'Ajouter au panier')}</button>
      </div></article>`;
  }

  function fillRails() {
    $$('[data-rail]').forEach((el) => {
      const r = el.dataset.rail;
      const list = r.startsWith('ids:') ? r.slice(4).split(',').map((id) => byId[id]).filter(Boolean) : products.filter((p) => p.cat === r);
      el.innerHTML = list.map((p) => card(p)).join('');
    });
    $$('[data-rail-nav]').forEach((b) => b.addEventListener('click', () => {
      const rail = document.getElementById(b.dataset.railNav); rail.scrollBy({ left: (+b.dataset.dir) * rail.clientWidth * 0.8, behavior: 'smooth' });
    }));
  }

  /* ——— Boutique ——— */
  const priceBands = { all: 'Tous les prix', u15: 'Moins de 15 €', b25: '15 à 25 €', o25: 'Plus de 25 €' };
  function inBand(p, b) { return b === 'all' || (b === 'u15' && p.price < 15) || (b === 'b25' && p.price >= 15 && p.price <= 25) || (b === 'o25' && p.price > 25); }
  function renderShopFilters() {
    const el = $('#shopFilters'); if (!el) return;
    const catBtns = [{ id: 'all', name: 'Toutes les créations' }].concat(cats).map((c) => {
      const n = c.id === 'all' ? products.length : products.filter((p) => p.cat === c.id).length;
      return `<button class="fbtn" data-fcat="${c.id}" aria-pressed="${state.cat === c.id}">${c.name}<span>${n}</span></button>`;
    }).join('');
    const bandBtns = Object.entries(priceBands).map(([k, v]) => `<button class="fbtn" data-fprice="${k}" aria-pressed="${state.price === k}">${v}</button>`).join('');
    const showColors = state.cat === 'jesmonite' || state.cat === 'bougies';
    el.innerHTML = `<div class="fgroup"><h4>Collection</h4>${catBtns}</div>
      <div class="fgroup"><h4>Budget</h4>${bandBtns}</div>
      ${state.cat === 'bougies' ? `<div class="fgroup"><h4>Parfum</h4>${scents.map((s) => `<button class="fbtn" data-fscent="${s.name}" aria-pressed="${state.scent === s.name}">${s.name}</button>`).join('')}</div>` : ''}
      ${showColors ? `<div class="fgroup"><h4>Teinte de la jesmonite</h4><div class="swatches">${colors.map((c) => `<button class="sw" data-fcolor="${c.name}" aria-pressed="${state.color === c.name}" title="${c.name}" aria-label="${c.name}" style="background:${c.c}"></button>`).join('')}</div><p class="fnote">Toutes les pièces existent dans ces 6 teintes.</p></div>` : ''}`;
  }
  function renderShop() {
    const grid = $('#shopGrid'); if (!grid) return;
    let list = products.filter((p) => (state.cat === 'all' || p.cat === state.cat) && inBand(p, state.price) && (!state.scent || p.cat === 'bougies'));
    if (state.sort === 'asc') list = list.slice().sort((a, b) => a.price - b.price);
    if (state.sort === 'desc') list = list.slice().sort((a, b) => b.price - a.price);
    if (state.sort === 'az') list = list.slice().sort((a, b) => a.name.localeCompare(b.name, 'fr'));
    grid.innerHTML = list.length ? list.map((p) => card(p)).join('') : '<p class="noresult">Aucune création ne correspond. Essayez un autre budget.</p>';
    $('#shopCount').textContent = `${list.length} création${list.length > 1 ? 's' : ''}`;
    $('#shopTitle').textContent = state.cat === 'all' ? 'La boutique' : catName(state.cat);
    const crumbs = $('#shopCrumb'); if (crumbs) crumbs.innerHTML = `<a href="#accueil">Accueil</a> / ${state.cat === 'all' ? 'Boutique' : `<a href="#boutique">Boutique</a> / ${catName(state.cat)}`}`;
    renderShopFilters();
    cfg.afterRender && cfg.afterRender('boutique');
    observe();
  }

  /* ——— Fiche produit ——— */
  function gallery(p) {
    const vl = p.variants && variants[p.variants][0].img ? variants[p.variants] : null;
    const pics = vl ? vl.slice(0, 6).map((v) => v.img) : [p.img, p.img + '#zoom', p.box && byId[p.box] ? byId[p.box].img + '#box' : null].filter(Boolean);
    return { main: p.img, pics };
  }
  function renderProduct(id) {
    const p = byId[id]; const m = $('#productMount'); if (!p || !m) return;
    const g = gallery(p);
    const vl = p.variants ? variants[p.variants] : null;
    let options = '';
    if (p.cat === 'bougies') {
      options += `<fieldset class="opt"><legend>Parfum <span id="scentNote">${scents.find((s) => s.name === p.scentDefault).note}</span></legend><div class="chips-row">${scents.map((s) => `<label class="ochip"><input type="radio" name="scent" value="${s.name}" ${s.name === p.scentDefault ? 'checked' : ''}><span>${s.name}</span></label>`).join('')}</div></fieldset>`;
    }
    if (p.cat === 'bougies' || p.cat === 'jesmonite') {
      options += `<fieldset class="opt"><legend>Teinte <span id="colorName">Beige marbré</span></legend><div class="swatches">${colors.map((c, i) => `<label class="sw-l" title="${c.name}"><input type="radio" name="color" value="${c.name}" ${i === 1 ? 'checked' : ''}><span class="sw" style="background:${c.c}"></span><span class="sr-only">${c.name}</span></label>`).join('')}</div></fieldset>`;
    }
    if (vl && vl[0].img) {
      options += `<fieldset class="opt"><legend>Modèle <span id="variantName">${vl[0].name}</span></legend><div class="vgrid">${vl.map((v, i) => `<label class="vopt" title="${v.name}"><input type="radio" name="variant" value="${v.name}" data-img="${v.img}" ${i === 0 ? 'checked' : ''}><img src="${src(v.img)}" alt=""><span class="sr-only">${v.name}</span></label>`).join('')}</div></fieldset>`;
    }
    if (p.variants === 'creoles' || p.id === 'creoles-pampilles') {
      options = `<fieldset class="opt"><legend>Finition <span id="finishName">Doré</span></legend><div class="chips-row">${variants.creoles.map((v, i) => `<label class="ochip"><input type="radio" name="finish" value="${v.name}" ${i === 0 ? 'checked' : ''}><span><i style="background:${v.swatch}"></i>${v.name}</span></label>`).join('')}</div></fieldset>
        <fieldset class="opt"><legend>Forme</legend><div class="chips-row">${['Ovale', 'Torsadée', 'Ronde', 'Martelée', 'Mixte lisse-martelée'].map((v, i) => `<label class="ochip"><input type="radio" name="shape" value="${v}" ${i === 0 ? 'checked' : ''}><span>${v}</span></label>`).join('')}</div></fieldset>` + (p.id === 'creoles-pampilles' ? options : '');
    }
    const care = p.cat === 'bougies'
      ? '<li>Lors du premier allumage, laissez fondre toute la surface de la cire.</li><li>Recoupez la mèche à environ 5 mm avant chaque utilisation.</li><li>Ne laissez jamais une bougie allumée sans surveillance.</li>'
      : p.cat === 'jesmonite' ? '<li>Dépoussiérez avec un chiffon doux et sec.</li><li>Évitez le contact prolongé avec l’eau.</li><li>Les marbrures et petites bulles sont la signature du fait main.</li>'
      : '<li>Évitez l’eau, le parfum et les produits cosmétiques.</li><li>Rangez vos bijoux à l’abri de la lumière.</li><li>Finition résine UV : brillance et protection.</li>';
    const pair = p.box && byId[p.box] ? [byId[p.box], byId['petit-coeur']] : products.filter((x) => x.cat === p.cat && x.id !== p.id).slice(0, 4);
    m.innerHTML = `
      <nav class="crumb" aria-label="Fil d’Ariane"><a href="#accueil">Accueil</a> / <a href="#boutique-${p.cat}">${catName(p.cat)}</a> / <span>${p.name}</span></nav>
      <div class="pdp">
        <div class="pgal">
          <div class="pmain" id="pmain"><span class="pimg-wrap" id="pimgWrap"><img id="mainImg" src="${src(g.main)}" alt="${esc(p.name)}" class="${p.flip ? 'flip' : ''}">${cfg.imgExtra ? cfg.imgExtra(p, true) : ''}</span>${cfg.cardMedia ? cfg.cardMedia(p, true) : ''}${p.ill ? '<span class="chip chip-ill">Visuel provisoire</span>' : ''}</div>
          <div class="pthumbs">${g.pics.map((x, i) => { const [f, mod] = x.split('#'); return `<button class="pthumb ${i === 0 ? 'on' : ''}" data-pic="${f}" data-mod="${mod || ''}" aria-label="Photo ${i + 1}"><img src="${src(f)}" alt="" class="${mod === 'zoom' ? 'zoom' : ''} ${p.flip ? 'flip' : ''}"></button>`; }).join('')}</div>
        </div>
        <div class="pinfo">
          <div class="pbadges">${(p.badges || []).map((b) => `<span class="chip static">${b}</span>`).join('')}<span class="chip static soft">Fait main</span></div>
          <h1>${p.name}</h1>
          <p class="pprice-big price" id="ppPrice">${eur(p.price)}</p>
          <p class="plead">${p.desc}</p>
          ${p.burn ? `<ul class="facts"><li><strong>${p.burn}</strong><span>de combustion</span></li><li><strong>Grasse</strong><span>fragrance</span></li><li><strong>Jesmonite</strong><span>contenant réutilisable</span></li></ul>` : ''}
          <form class="pform" id="pform">${options}
            <div class="buyrow"><div class="qty"><button type="button" data-q="-1" aria-label="Diminuer la quantité">−</button><output id="pqty">1</output><button type="button" data-q="1" aria-label="Augmenter la quantité">+</button></div>
            <button type="submit" class="btn btn-buy" id="buyBtn">${cfg.buyLabel ? cfg.buyLabel(p) : 'Ajouter au panier'}</button>
            <button type="button" class="wish wish-inline" data-wish="${p.id}" aria-pressed="${state.wish.has(p.id)}" aria-label="Ajouter aux favoris">${ICON.heart}</button></div>
          </form>
          <ul class="assure"><li>${ICON.gift}<span>Emballage soigné, prêt à offrir · petit mot possible</span></li><li><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M3 7h11v9H3zM14 10h4l3 3v3h-7z"/><circle cx="7" cy="17.5" r="1.6"/><circle cx="17" cy="17.5" r="1.6"/></svg><span>Livraison à domicile ou en point relais</span></li><li><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M12 3c3 4 4 6.5 0 9-4-2.5-3-5 0-9Z"/><path d="M5 21c1-4 4-6 7-6s6 2 7 6"/></svg><span>Pièce unique : de légères variations font son charme</span></li></ul>
          <div class="acc">
            <details open><summary>Description</summary><p>${p.desc}</p></details>
            ${p.cat === 'bougies' ? `<details><summary>Seconde vie du contenant</summary><p>Une fois la bougie terminée, nettoyez le contenant à l’eau chaude : il devient une boîte à bijoux, un vide-poche ou un objet déco.</p></details>` : ''}
            <details><summary>Conseils d’utilisation</summary><ul>${care}</ul></details>
            <details><summary>Livraison & retours</summary><p>Les modalités (tarifs, délais, retours) seront affichées ici depuis Shopify.</p></details>
          </div>
        </div>
      </div>
      <section class="pair"><div class="sec-head"><h2>${p.box ? 'À assortir' : 'Vous aimerez aussi'}</h2></div><div class="rail">${pair.map((x) => card(x)).join('')}</div></section>`;
    // interactions
    let qty = 1;
    const f = $('#pform');
    $$('[data-q]', f).forEach((b) => b.addEventListener('click', () => { qty = Math.max(1, qty + +b.dataset.q); $('#pqty').textContent = qty; $('#ppPrice').textContent = eur(qty * p.price); }));
    f.addEventListener('change', (e) => {
      const t = e.target;
      if (t.name === 'scent') $('#scentNote').textContent = scents.find((s) => s.name === t.value).note;
      if (t.name === 'color') $('#colorName').textContent = t.value;
      if (t.name === 'finish') { $('#finishName').textContent = t.value; }
      if (t.name === 'variant') { $('#variantName').textContent = t.value; setMain(t.dataset.img); }
    });
    function setMain(img, mod) {
      const mi = $('#mainImg'); mi.src = src(img); mi.className = (mod === 'zoom' ? 'zoom ' : '') + (p.flip ? 'flip' : '');
      $$('.pthumb').forEach((b) => b.classList.toggle('on', b.dataset.pic === img && (b.dataset.mod || '') === (mod || '')));
      cfg.onMainChange && cfg.onMainChange(p, img);
    }
    $$('.pthumb').forEach((b) => b.addEventListener('click', () => setMain(b.dataset.pic, b.dataset.mod)));
    f.addEventListener('submit', (e) => {
      e.preventDefault();
      const fd = new FormData(f);
      const variant = [fd.get('finish'), fd.get('shape'), fd.get('variant') ? 'Pampille ' + fd.get('variant') : null, fd.get('color')].filter(Boolean).join(' · ').replace('Pampille ', p.id === 'creoles-pampilles' ? 'Pampille ' : '');
      const vimg = fd.get('variant') ? (variants[p.variants].find((v) => v.name === fd.get('variant')) || {}).img : null;
      add(p.id, { qty, scent: fd.get('scent') || '', variant: p.variants === 'pampilles' && p.id === 'pampilles' ? fd.get('variant') : variant, img: vimg && p.id !== 'creoles-pampilles' ? vimg : p.img }, $('#buyBtn'));
    });
    // barre d'achat fixe
    const sticky = $('#stickyBuy');
    if (sticky) {
      sticky.innerHTML = `<img src="${src(p.img)}" alt=""><div><strong>${p.name}</strong><span class="price">${eur(p.price)}</span></div><button class="btn" id="stickyAdd">${cfg.buyLabel ? cfg.buyLabel(p) : 'Ajouter au panier'}</button>`;
      $('#stickyAdd').addEventListener('click', () => f.requestSubmit());
      const io = new IntersectionObserver(([en]) => sticky.classList.toggle('on', !en.isIntersecting && en.boundingClientRect.top < 0), { threshold: 0 });
      io.observe($('#buyBtn'));
      renderProduct._io && renderProduct._io.disconnect(); renderProduct._io = io;
    }
    document.title = `${p.name} · ${cfg.titleSuffix || 'La P’tite Fabrique d’Agachaé'}`;
    cfg.afterRender && cfg.afterRender('produit', p);
    observe();
  }

  /* ——— Idées cadeaux ——— */
  const giftTabs = [
    { id: 'u15', name: 'Moins de 15 €', f: (p) => p.price < 15 },
    { id: 'b25', name: '15 à 25 €', f: (p) => p.price >= 15 && p.price <= 25 },
    { id: 'o25', name: 'Plus de 25 €', f: (p) => p.price > 25 },
    { id: 'noel', name: 'Pour Noël', f: (p) => (p.badges || []).includes('Noël') || /noel|avent/.test(p.id) },
    { id: 'kids', name: 'Pour les enfants', f: (p) => ['petite-pince', 'puces-d-oreilles', 'pampilles', 'petit-coeur'].includes(p.id) },
  ];
  function renderGifts(tab) {
    const m = $('#giftMount'); if (!m) return;
    const t = giftTabs.find((x) => x.id === tab) || giftTabs[0];
    m.innerHTML = `<div class="tabs" role="tablist">${giftTabs.map((x) => `<button role="tab" class="tab" data-gift="${x.id}" aria-selected="${x.id === t.id}">${x.name}</button>`).join('')}</div>
      <div class="grid4">${products.filter(t.f).map((p) => card(p)).join('')}</div>`;
    $$('[data-gift]', m).forEach((b) => b.addEventListener('click', () => renderGifts(b.dataset.gift)));
    cfg.afterRender && cfg.afterRender('cadeaux');
    observe();
  }

  /* ——— Composer ses créoles ——— */
  function renderComposer() {
    const m = $('#composer'); if (!m) return;
    const pv = variants.pampilles; let sel = pv[6], finish = 'Doré';
    const hoop = (id) => `<svg class="hoop" viewBox="0 0 120 150" aria-hidden="true"><defs><linearGradient id="${id}" x1="0" y1="0" x2="1" y2="1"><stop offset="0" class="h1"/><stop offset=".5" class="h2"/><stop offset="1" class="h3"/></linearGradient></defs><ellipse cx="60" cy="75" rx="52" ry="68" fill="none" stroke="url(#${id})" stroke-width="7"/></svg>`;
    m.innerHTML = `<div class="cmp-stage" data-finish="Doré"><div class="hoops">${hoop('hg1')}${hoop('hg2')}</div><img id="cmpImg" src="${src(sel.img)}" alt="Pampille ${sel.name}"></div>
      <div class="cmp-panel">
        <p class="eyebrow">Créoles + pampilles · 18 €</p>
        <h2>Composez vos boucles</h2>
        <p>Les pampilles se clipsent sur les créoles : changez de style selon vos envies et les saisons.</p>
        <fieldset class="opt"><legend>Finition des créoles <span id="cmpFinish">Doré</span></legend><div class="chips-row">${variants.creoles.map((v, i) => `<label class="ochip"><input type="radio" name="cfinish" value="${v.name}" ${i === 0 ? 'checked' : ''}><span><i style="background:${v.swatch}"></i>${v.name}</span></label>`).join('')}</div></fieldset>
        <fieldset class="opt"><legend>Pampilles <span id="cmpName">${sel.name}</span></legend><div class="vgrid">${pv.map((v) => `<label class="vopt" title="${v.name}"><input type="radio" name="cpamp" value="${v.name}" ${v === sel ? 'checked' : ''}><img src="${src(v.img)}" alt="" loading="lazy"><span class="sr-only">${v.name}</span></label>`).join('')}</div></fieldset>
        <div class="cmp-buy"><button class="btn" id="cmpAdd">Ajouter cette paire · 18 €</button><a class="link" href="#produit-pampilles">Pampilles seules · 8 €</a></div>
      </div>`;
    m.addEventListener('change', (e) => {
      if (e.target.name === 'cpamp') { sel = pv.find((v) => v.name === e.target.value); const im = $('#cmpImg'); im.classList.remove('swap'); void im.offsetWidth; im.classList.add('swap'); im.src = src(sel.img); im.alt = 'Pampille ' + sel.name; $('#cmpName').textContent = sel.name; }
      if (e.target.name === 'cfinish') { finish = e.target.value; $('#cmpFinish').textContent = finish; $('.cmp-stage', m).dataset.finish = finish; }
    });
    $('#cmpAdd').addEventListener('click', (e) => add('creoles-pampilles', { variant: `${finish} · Pampille ${sel.name}`, img: 'creoles-pampilles' }, e.currentTarget));
  }

  /* ——— Recherche ——— */
  function initSearch() {
    const layer = $('#searchLayer'); if (!layer) return;
    const input = $('#searchInput'), res = $('#searchResults');
    const norm = (s) => s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().replace(/œ/g, 'oe');
    function run() {
      const q = norm(input.value.trim());
      const list = q ? products.filter((p) => norm(p.name + ' ' + p.cat + ' ' + p.desc + ' ' + (p.scentDefault || '')).includes(q)) : products.filter((p) => p.badges.length).slice(0, 6);
      res.innerHTML = (q ? `<p class="sr-meta">${list.length} résultat${list.length > 1 ? 's' : ''}</p>` : '<p class="sr-meta">Suggestions</p>') +
        list.slice(0, 8).map((p) => `<a class="sr-item" href="#produit-${p.id}"><span class="sr-th"><img src="${src(p.img)}" alt="" class="${p.flip ? 'flip' : ''}"></span><span><strong>${p.name}</strong><small>${catName(p.cat)}</small></span><span class="price">${eur(p.price)}</span></a>`).join('') +
        (q && !list.length ? '<p class="sr-empty">Aucun résultat. Essayez « bougie », « cœur » ou « pampille ».</p>' : '');
    }
    const open = () => { layer.classList.add('on'); input.value = ''; run(); setTimeout(() => input.focus(), 50); };
    const close = () => layer.classList.remove('on');
    $$('[data-search-open]').forEach((b) => b.addEventListener('click', open));
    $$('[data-search-close]').forEach((b) => b.addEventListener('click', close));
    input.addEventListener('input', run);
    res.addEventListener('click', (e) => { if (e.target.closest('a')) close(); });
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape') close(); });
  }

  /* ——— Panier ——— */
  function add(id, opts, srcEl) {
    const p = byId[id];
    Cart.add(id, opts || {});
    if (cfg.onAdd) cfg.onAdd(p, opts || {}, srcEl); else { toast(`${p.name} ajouté au panier`); openCart(); }
  }
  function openCart() { $('#cartDrawer').classList.add('on'); $('#cartOverlay').classList.add('on'); $('#cartDrawer').setAttribute('aria-hidden', 'false'); }
  function closeCart() { $('#cartDrawer').classList.remove('on'); $('#cartOverlay').classList.remove('on'); $('#cartDrawer').setAttribute('aria-hidden', 'true'); }
  let giftWrap = false;
  function renderCart() {
    const items = Cart.items(), n = Cart.count(), tot = Cart.total();
    $$('[data-cart-count]').forEach((el) => { el.textContent = n; el.dataset.n = n; });
    const free = cfg.freeShip || 45, left = Math.max(0, free - tot), pct = Math.min(100, (tot / free) * 100);
    $('#shipBar').innerHTML = cfg.shipBar ? cfg.shipBar(left, pct, free) : `<p>${left > 0 ? `Plus que <strong>${eur(left)}</strong> pour la livraison offerte` : '<strong>Livraison offerte</strong> sur votre commande'}</p><div class="bar"><span style="width:${pct}%"></span></div>`;
    const upsell = ['petite-pince', 'petit-coeur', 'pampilles'].filter((id) => !items.some((l) => l.id === id)).slice(0, 2).map((id) => byId[id]);
    $('#cartBody').innerHTML = items.length ? items.map((l) => `
      <div class="cline" data-key="${esc(l.key)}"><a class="cth" href="#produit-${l.id}"><img src="${src(l.img)}" alt="">${cfg.lineExtra ? cfg.lineExtra(l) : ''}</a>
        <div class="cinfo"><h3>${l.name}</h3><small>${[l.scent, l.variant].filter(Boolean).join(' · ') || catName(l.cat)}</small>
          <div class="qty sm"><button data-lq="${esc(l.key)}" data-d="-1" aria-label="Retirer un">−</button><output>${l.qty}</output><button data-lq="${esc(l.key)}" data-d="1" aria-label="Ajouter un">+</button></div></div>
        <div class="cprice"><span class="price">${eur(l.qty * l.price)}</span><button class="rm" data-rm="${esc(l.key)}">Retirer</button></div></div>`).join('') +
      (upsell.length ? `<div class="upsell"><h4>Les petites attentions</h4>${upsell.map((p) => `<div class="up"><img src="${src(p.img)}" alt=""><span>${p.name}<small class="price">${eur(p.price)}</small></span><button class="btn-mini" data-up="${p.id}" aria-label="Ajouter ${esc(p.name)}">${ICON.plus}</button></div>`).join('')}</div>` : '')
      : `<div class="cempty">${cfg.emptyArt || ''}<p>Votre panier est vide.</p><a class="btn ghost" href="#boutique" data-close-cart>Découvrir la boutique</a></div>`;
    $('#cartFoot').innerHTML = items.length ? `
      <label class="giftopt"><input type="checkbox" id="giftWrap" ${giftWrap ? 'checked' : ''}><span>${ICON.gift} Emballage cadeau avec petit mot <em>+ 2 €</em></span></label>
      ${giftWrap ? '<textarea id="giftMsg" rows="2" placeholder="Votre petit mot (facultatif)"></textarea>' : ''}
      <div class="ctot"><span>Sous-total</span><strong class="price">${eur(tot + (giftWrap ? 2 : 0))}</strong></div>
      <button class="btn btn-buy" id="checkout">Passer commande</button>
      <p class="cpay">Paiement sécurisé · CB · Apple Pay · Google Pay · PayPal</p>` : '';
    const gw = $('#giftWrap'); if (gw) gw.addEventListener('change', () => { giftWrap = gw.checked; renderCart(); });
    const co = $('#checkout'); if (co) co.addEventListener('click', () => toast('Maquette : ici s’ouvre le paiement sécurisé Shopify'));
    cfg.afterCart && cfg.afterCart(items);
  }

  /* ——— Favoris ——— */
  function toggleWish(id, btn) {
    state.wish.has(id) ? state.wish.delete(id) : state.wish.add(id);
    try { sessionStorage.setItem('aga-wish', JSON.stringify([...state.wish])); } catch (e) {}
    $$(`[data-wish="${id}"]`).forEach((b) => b.setAttribute('aria-pressed', state.wish.has(id)));
    $$('[data-wish-count]').forEach((el) => { el.textContent = state.wish.size; el.dataset.n = state.wish.size; });
    toast(state.wish.has(id) ? `${byId[id].name} ajouté à vos favoris` : 'Retiré de vos favoris');
  }

  /* ——— Routeur ——— */
  function route() {
    const h = decodeURIComponent(location.hash.slice(1));
    let view = 'accueil';
    if (h.startsWith('produit-') && byId[h.slice(8)]) view = 'produit';
    else if (h === 'boutique' || h.startsWith('boutique-')) view = 'boutique';
    else if (h === 'atelier' || h === 'cadeaux') view = h;
    else if (h && h !== 'accueil' && document.getElementById(h)) { show('accueil', false); document.getElementById(h).scrollIntoView({ behavior: 'smooth' }); return; }
    show(view, true);
    if (view === 'boutique') { state.cat = h.startsWith('boutique-') ? h.slice(9) : 'all'; state.scent = ''; state.color = ''; renderShop(); }
    if (view === 'produit') renderProduct(h.slice(8));
    if (view === 'cadeaux') renderGifts('u15');
    if (view !== 'produit') { document.title = cfg.title; const s = $('#stickyBuy'); if (s) s.classList.remove('on'); }
  }
  function show(view, top) {
    $$('main [data-view]').forEach((v) => { v.hidden = v.dataset.view !== view; });
    $$('[data-nav]').forEach((a) => a.classList.toggle('active', a.dataset.nav === view));
    document.body.dataset.page = view;
    if (top) window.scrollTo({ top: 0, behavior: 'instant' });
    cfg.onView && cfg.onView(view);
    observe();
  }

  /* ——— Apparitions au défilement ——— */
  let io;
  function observe() {
    if (!('IntersectionObserver' in window)) { $$('.rv').forEach((e) => e.classList.add('in')); return; }
    io = io || new IntersectionObserver((ens) => ens.forEach((en) => { if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); } }), { rootMargin: '0px 0px -8% 0px' });
    $$('.rv:not(.in)').forEach((e) => io.observe(e));
  }

  let tt;
  function toast(m) { const t = $('#toast'); if (!t) return; t.innerHTML = m; t.classList.add('show'); clearTimeout(tt); tt = setTimeout(() => t.classList.remove('show'), 2600); }

  function init(c) {
    cfg = c || {}; cfg.title = document.title;
    document.documentElement.classList.add('js');
    fillRails(); renderComposer(); initSearch();
    document.addEventListener('click', (e) => {
      const a = e.target.closest('[data-add]');
      if (a) { e.preventDefault(); const p = byId[a.dataset.add]; if (p.variants) location.hash = 'produit-' + p.id; else add(p.id, { scent: p.scentDefault || '' }, a); return; }
      const w = e.target.closest('[data-wish]'); if (w) { e.preventDefault(); toggleWish(w.dataset.wish, w); return; }
      const fc = e.target.closest('[data-fcat]'); if (fc) { location.hash = fc.dataset.fcat === 'all' ? 'boutique' : 'boutique-' + fc.dataset.fcat; return; }
      const fp = e.target.closest('[data-fprice]'); if (fp) { state.price = fp.dataset.fprice; renderShop(); return; }
      const fs = e.target.closest('[data-fscent]'); if (fs) { state.scent = state.scent === fs.dataset.fscent ? '' : fs.dataset.fscent; renderShop(); toast(state.scent ? `Toutes les bougies existent en ${state.scent}` : 'Filtre parfum retiré'); return; }
      const fcol = e.target.closest('[data-fcolor]'); if (fcol) { state.color = state.color === fcol.dataset.fcolor ? '' : fcol.dataset.fcolor; renderShopFilters(); toast(state.color ? `Teinte ${state.color} : à choisir sur chaque fiche` : 'Filtre teinte retiré'); return; }
      const up = e.target.closest('[data-up]'); if (up) { Cart.add(up.dataset.up); return; }
      const lq = e.target.closest('[data-lq]'); if (lq) { const l = Cart.items().find((x) => x.key === lq.dataset.lq); if (l) Cart.setQty(l.key, l.qty + +lq.dataset.d); return; }
      const rm = e.target.closest('[data-rm]'); if (rm) { Cart.remove(rm.dataset.rm); return; }
      if (e.target.closest('[data-cart-open]')) { openCart(); return; }
      if (e.target.closest('[data-close-cart]') || e.target.id === 'cartOverlay') { closeCart(); }
    });
    const sortSel = $('#sortSel'); if (sortSel) sortSel.addEventListener('change', () => { state.sort = sortSel.value; renderShop(); });
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeCart(); });
    $$('[data-wish-count]').forEach((el) => { el.textContent = state.wish.size; el.dataset.n = state.wish.size; });
    Cart.on(renderCart); renderCart();
    window.addEventListener('hashchange', route); route();
  }
  return { init, card, toast, openCart, closeCart, add, observe, ICON, renderCart };
})();
