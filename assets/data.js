/* La P'tite Fabrique d'Agachaé — données du catalogue Automne/Hiver 2026 (source : catalogue PDF de Lucie) */
if (window.name === 'apercu-mobile') document.documentElement.classList.add('in-frame');
window.AGA = (function () {
  const P = (o) => Object.assign({ variants: null, flip: false, ill: false, badges: [] }, o);
  const products = [
    // ——— Bougies ———
    P({ id: 'douceur-camelia', name: 'Douceur Camélia', cat: 'bougies', price: 22, img: 'bougie-camelia', burn: '20 h',
        short: 'La bougie signature de l’atelier.', badges: ['Signature'], box: 'boite-camelia', scentDefault: 'Fleur de coton',
        desc: 'La bougie signature de La P’tite Fabrique d’Agachaé. Une cire parfumée coulée à la main dans un contenant en jesmonite surmonté d’un camélia sculpté. Une fois la bougie terminée, le contenant devient une jolie boîte à bijoux.' }),
    P({ id: 'rose-illuminee', name: 'Rose Illuminée', cat: 'bougies', price: 29, img: 'bougie-rose', burn: '30 h',
        short: 'Une rose épanouie posée sur une bougie généreuse.', badges: ['Coup de cœur'], box: 'boite-grande-rose', scentDefault: 'Thé Chai Latte',
        wick: { x: 39.3, y: 31.8 },
        desc: 'Une bougie parfumée coulée dans un pot en jesmonite rose poudré, coiffée d’un couvercle rose sculpté à la main. Sa plus longue combustion de la collection.' }),
    P({ id: 'vague-de-lumiere', name: 'Vague de Lumière', cat: 'bougies', price: 16, img: 'ill-vague.svg', ill: true, burn: '12 h',
        short: 'Un petit pot ondulé, parfait à offrir.', scentDefault: 'Vanille',
        desc: 'Une petite bougie aux reliefs ondulés, pensée comme une attention à glisser dans un paquet cadeau ou à poser sur une table de nuit.' }),
    P({ id: 'eclat-d-automne', name: 'Éclat d’Automne', cat: 'bougies', price: 21, img: 'bougie-gland', burn: '14 h',
        short: 'Un gland sculpté aux couleurs de la saison.', badges: ['Automne'], box: 'boite-gland', scentDefault: 'Thé Chai Latte',
        desc: 'La bougie de saison : un contenant en forme de gland, chapeau sculpté feuille à feuille, pour une ambiance douce et chaleureuse.' }),
    P({ id: 'sapin-enchante', name: 'Sapin Enchanté', cat: 'bougies', price: 29, img: 'bougie-sapin', burn: '13 h',
        short: 'Un sapin de Noël qui cache une bougie.', badges: ['Noël'], box: 'boite-sapin-de-noel', scentDefault: 'Bois de Oud',
        desc: 'Un sapin en jesmonite qui s’ouvre sur une bougie parfumée. Une fois la bougie terminée, il reste une jolie boîte pour la décoration des fêtes.' }),
    P({ id: 'bulle-d-hiver', name: 'Bulle d’Hiver', cat: 'bougies', price: 26, img: 'bougie-boule', burn: '23 h',
        short: 'Une boule de Noël géante et parfumée.', badges: ['Noël'], box: 'boite-boule-de-noel', scentDefault: 'Vanille',
        desc: 'Une boule de Noël côtelée en jesmonite, attache dorée et bougie parfumée à l’intérieur. Le cadeau qui se garde après les fêtes.' }),
    // ——— Jesmonite ———
    P({ id: 'boite-camelia', name: 'Boîte Camélia', cat: 'jesmonite', price: 14, img: 'bougie-camelia', flip: true,
        short: 'Pour les bijoux et petits trésors.', desc: 'Une petite boîte décorative, parfaite pour les bijoux, petits trésors ou accessoires.' }),
    P({ id: 'vide-poche-ovale', name: 'Vide-poche ovale', cat: 'jesmonite', price: 13, img: 'vide-poche',
        short: 'Pour l’entrée, la cuisine ou le bureau.', desc: 'À placer dans l’entrée, dans la cuisine, sur une table de nuit ou sur un bureau.' }),
    P({ id: 'grand-coeur', name: 'Grand cœur', cat: 'jesmonite', price: 11, img: 'grand-coeur', badges: ['Marbré'],
        short: 'À offrir ou à poser dans votre déco.', desc: 'À offrir ou à poser dans votre décoration. Les marbrures sont réalisées à la main : chaque cœur est unique.' }),
    P({ id: 'boite-grande-rose', name: 'Boîte Grande Rose', cat: 'jesmonite', price: 19, img: 'boite-rose',
        short: 'Une boîte élégante et délicate.', desc: 'Une boîte élégante et délicate, idéale pour ranger bijoux, clés ou autres objets.' }),
    P({ id: 'boite-mesange', name: 'Boîte Mésange', cat: 'jesmonite', price: 13, img: 'boite-mesange',
        short: 'Une mésange posée sur un éventail.', desc: 'Une boîte originale et décorative, parfaite pour vos petits objets du quotidien.' }),
    P({ id: 'petit-coeur', name: 'Petit cœur', cat: 'jesmonite', price: 9, img: 'petit-coeur',
        short: 'Pour l’entrée ou le bureau.', desc: 'À placer dans l’entrée, sur un bureau… pour y déposer une bague ou des boucles d’oreilles.' }),
    P({ id: 'boite-gland', name: 'Boîte Gland', cat: 'jesmonite', price: 13, img: 'bougie-gland', flip: true,
        short: 'Pleine de charme pour l’automne-hiver.', desc: 'Une petite boîte pleine de charme, parfaite pour l’automne-hiver.' }),
    P({ id: 'boite-sapin-de-noel', name: 'Boîte Sapin de Noël', cat: 'jesmonite', price: 23, img: 'bougie-sapin', flip: true,
        short: 'Une touche de magie pour Noël.', desc: 'Une boîte parfaite pour apporter une touche de magie à votre décoration de Noël.' }),
    P({ id: 'boite-boule-de-noel', name: 'Boîte Boule de Noël', cat: 'jesmonite', price: 17, img: 'bougie-boule', flip: true,
        short: 'Une touche chaleureuse pour les fêtes.', desc: 'Une boîte pour apporter une touche chaleureuse à votre intérieur pendant les fêtes.' }),
    // ——— Bijoux & accessoires ———
    P({ id: 'pampilles', name: 'Pampilles', cat: 'bijoux', price: 8, img: 'pampille-flora', badges: ['15 modèles'],
        short: 'Une paire de pampilles à clipser sur vos créoles.', variants: 'pampilles',
        desc: 'Une paire de pampilles en pâte polymère, protégées par une finition en résine UV qui leur apporte brillance et protection. Elles se clipsent sur les créoles pour changer de style selon vos envies et les saisons.' }),
    P({ id: 'creoles-pampilles', name: 'Créoles + pampilles', cat: 'bijoux', price: 18, img: 'creoles-pampilles', badges: ['À composer'],
        short: 'La paire complète et coordonnée.', variants: 'pampilles',
        desc: 'L’ensemble pour composer une paire de boucles complète et coordonnée : des créoles en acier inoxydable et la paire de pampilles de votre choix.' }),
    P({ id: 'creoles-acier', name: 'Créoles acier inoxydable', cat: 'bijoux', price: 10, img: 'creoles',
        short: 'Doré ou argenté, sans nickel libéré.', variants: 'creoles',
        desc: 'Créoles en acier inoxydable, sans plomb, sans cadmium ni nickel libéré. Formes : ovale, torsadée, ronde, martelée ou mixte lisse-martelée. Finition dorée ou argentée.' }),
    P({ id: 'puces-d-oreilles', name: 'Puces d’oreilles', cat: 'bijoux', price: 12, img: 'puce-etoile', variants: 'puces',
        short: 'Délicates, pour les petits comme pour les grands.', desc: 'Délicates et faciles à porter, pour les petits comme pour les grands. Modèles cœur, fleur, étoile ou rond.' }),
    P({ id: 'pins', name: 'Pin’s', cat: 'bijoux', price: 19, img: 'ill-pins.svg', ill: true,
        short: 'Sur une veste, un sac ou une trousse.', desc: 'Un petit accessoire à porter sur une veste, un sac ou une trousse.' }),
    P({ id: 'petite-pince', name: 'Petite pince', cat: 'bijoux', price: 6, img: 'petite-pince-festons', variants: 'petites-pinces',
        short: 'Une pince crocodile pensée pour les enfants.', desc: 'Une petite pince crocodile pensée pour les enfants, pratique et colorée.' }),
    P({ id: 'grande-pince', name: 'Grande pince', cat: 'bijoux', price: 8, img: 'grande-pince-goutte', variants: 'grandes-pinces',
        short: 'Pour accessoiriser vos coiffures.', desc: 'Une grande pince parfaite pour accessoiriser vos coiffures.' }),
    // ——— Pochettes & coffrets ———
    P({ id: 'calendrier-avent', name: 'Calendrier de l’Avent', cat: 'pochettes', price: 95, img: 'ill-calendrier.svg', ill: true, badges: ['Quantité limitée'],
        short: '24 surprises jusqu’à Noël.', desc: 'Composé de 24 surprises, cet ensemble allie bijoux, décorations en jesmonite et petites attentions pour vous faire patienter jusqu’à Noël. Compositions et coloris aléatoires.' }),
    P({ id: 'pochette-automne-hiver', name: 'Pochette Automne-Hiver', cat: 'pochettes', price: 25, img: 'ill-pochette.svg', ill: true, badges: ['Surprise'],
        short: 'Une sélection surprise aux couleurs de la saison.', desc: 'Des créations surprises en pâte polymère (pampilles, puces d’oreilles, pin’s…) inspirées des couleurs de la saison. Compositions et coloris aléatoires.' }),
    P({ id: 'pochette-speciale', name: 'Pochette Spéciale', cat: 'pochettes', price: 30, img: 'ill-pochette-noel.svg', ill: true, badges: ['Noël'],
        short: 'Aux couleurs et à la magie de Noël.', desc: 'Une sélection surprise aux couleurs et à la magie de Noël. Proposée en quantité limitée, compositions et coloris aléatoires.' }),
  ];

  const variants = {
    pampilles: ['Sia', 'Néva', 'Liv', 'Éna', 'Nyla', 'Esmé', 'Luma', 'Ysé', 'Naé', 'Elé', 'Méli', 'Mya', 'Flora', 'Zéna', 'Mely']
      .map((n) => ({ name: n, img: 'pampille-' + n.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase() })),
    puces: [{ name: 'Cœur', img: 'puce-coeur' }, { name: 'Fleur', img: 'puce-fleur' }, { name: 'Étoile', img: 'puce-etoile' }, { name: 'Rond', img: 'puce-rond' }],
    'petites-pinces': [{ name: 'Festons fleuris', img: 'petite-pince-festons' }, { name: 'Liberty', img: 'petite-pince-fleurie' }, { name: 'Vague nacrée', img: 'petite-pince-vague' }],
    'grandes-pinces': [{ name: 'Goutte pêche', img: 'grande-pince-goutte' }, { name: 'Rose texturée', img: 'grande-pince-rose' }, { name: 'Terracotta', img: 'grande-pince-terracotta' }],
    creoles: [{ name: 'Doré', swatch: 'linear-gradient(135deg,#f3d58a,#b8913f)' }, { name: 'Argenté', swatch: 'linear-gradient(135deg,#f1f1f1,#9a9a9a)' }],
  };

  const scents = [
    { name: 'Fleur de coton', note: 'Linge propre, douceur poudrée', mood: 'doux' },
    { name: 'Vanille', note: 'Gourmande et enveloppante', mood: 'gourmand' },
    { name: 'Violette', note: 'Florale, délicate, un brin rétro', mood: 'floral' },
    { name: 'Thé Chai Latte', note: 'Épices chaudes et lait mousseux', mood: 'epice' },
    { name: 'Bois de Oud', note: 'Boisé, profond, réconfortant', mood: 'boise' },
  ];
  const colors = [
    { name: 'Blanc', c: '#f6f3ee' }, { name: 'Beige marbré', c: 'linear-gradient(135deg,#efe3d3 30%,#d8c2a6 50%,#efe3d3 70%)' },
    { name: 'Terracotta marbré', c: 'linear-gradient(135deg,#e8c3ae 30%,#c6856a 50%,#e8c3ae 70%)' },
    { name: 'Rose poudré marbré', c: 'linear-gradient(135deg,#f4e1dd 30%,#e2b8b0 50%,#f4e1dd 70%)' },
    { name: 'Rose marbré', c: 'linear-gradient(135deg,#f0c9c9 30%,#d98e96 50%,#f0c9c9 70%)' },
    { name: 'Violet marbré', c: 'linear-gradient(135deg,#e5dbea 30%,#a98fb8 50%,#e5dbea 70%)' },
  ];
  const cats = [
    { id: 'bougies', name: 'Bougies', img: 'bougie-camelia', line: 'Parfums de Grasse, contenants en jesmonite' },
    { id: 'jesmonite', name: 'Jesmonite', img: 'grand-coeur', line: 'Boîtes, cœurs et vide-poches marbrés' },
    { id: 'bijoux', name: 'Bijoux & accessoires', img: 'pampille-flora', line: 'Pampilles, créoles, puces et pinces' },
    { id: 'pochettes', name: 'Pochettes & coffrets', img: 'ill-calendrier.svg', line: 'Surprises en petites séries' },
  ];
  const byId = Object.fromEntries(products.map((p) => [p.id, p]));
  const src = (img) => 'img/' + (img.endsWith('.svg') || img.endsWith('.png') ? img : img + '.webp');
  const eur = (n) => (Math.round(n * 100) / 100).toLocaleString('fr-FR', { minimumFractionDigits: n % 1 ? 2 : 0, maximumFractionDigits: 2 }) + ' €';

  /* Panier partagé (mémoire + sessionStorage si disponible) */
  const KEY = 'aga-cart-' + (document.documentElement.dataset.version || 'v');
  let cart = [];
  try { cart = JSON.parse(sessionStorage.getItem(KEY) || '[]'); } catch (e) { cart = []; }
  const subs = [];
  const save = () => { try { sessionStorage.setItem(KEY, JSON.stringify(cart)); } catch (e) {} subs.forEach((f) => f(cart)); };
  const Cart = {
    items: () => cart,
    count: () => cart.reduce((s, l) => s + l.qty, 0),
    total: () => cart.reduce((s, l) => s + l.qty * l.price, 0),
    add(id, opts = {}) {
      const p = byId[id]; if (!p) return;
      const key = id + '|' + (opts.variant || '') + '|' + (opts.scent || '');
      const line = cart.find((l) => l.key === key);
      if (line) line.qty += opts.qty || 1;
      else cart.push({ key, id, name: p.name, price: p.price, img: opts.img || p.img, variant: opts.variant || '', scent: opts.scent || '', qty: opts.qty || 1, cat: p.cat });
      save();
    },
    setQty(key, q) { const l = cart.find((x) => x.key === key); if (!l) return; l.qty = Math.max(0, q); cart = cart.filter((x) => x.qty > 0); save(); },
    remove(key) { cart = cart.filter((x) => x.key !== key); save(); },
    clear() { cart = []; save(); },
    on(f) { subs.push(f); },
  };
  return { products, byId, variants, scents, colors, cats, src, eur, Cart,
    contact: { email: 'laptitefabriquedagachae@gmail.com', insta: 'https://www.instagram.com/laptitefabriquedagachae', handle: '@laptitefabriquedagachae', place: 'Pays de Caux · Normandie' } };
})();
