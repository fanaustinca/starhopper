// The Robot Shop catalogue: everything you can spend energy cells on besides
// skins (see skins.js). Pure data, so it runs (and is tested) in Node.
// Every category has a free default item (price 0) that everyone owns.
export const CATEGORIES = [
  { id: 'skin', name: 'Skins', icon: '🤖', blurb: 'Paint jobs and special builds for your robot.' },
  { id: 'hat', name: 'Hats', icon: '🎩', blurb: 'Headgear that rides along through every world.' },
  { id: 'trail', name: 'Trails', icon: '✨', blurb: 'A stream of particles behind you as you run and fly.' },
  { id: 'jump', name: 'Jump FX', icon: '💥', blurb: 'A burst every time you jump or double-jump.' },
  { id: 'pet', name: 'Companions', icon: '🛸', blurb: 'A little buddy that follows you everywhere.' },
  { id: 'dance', name: 'Victory', icon: '🕺', blurb: 'How your robot celebrates at the portal.' },
  { id: 'ship', name: 'Ship Paint', icon: '🚀', blurb: 'A new livery for the mothership between worlds.' },
];

export const ITEMS = {
  hat: [
    { id: 'none', name: 'No Hat', price: 0 },
    { id: 'party', name: 'Party Hat', price: 120, color: 0xff5ad0, accent: 0xffe05a },
    { id: 'cap', name: 'Ball Cap', price: 150, color: 0x2a6aff, accent: 0xffffff },
    { id: 'chef', name: 'Chef Hat', price: 180, color: 0xffffff, accent: 0xe8e8e8 },
    { id: 'propeller', name: 'Propeller Cap', price: 220, color: 0xffd02a, accent: 0xff3a3a },
    { id: 'headphones', name: 'Headphones', price: 250, color: 0x1a1c24, accent: 0x5fd8ff },
    { id: 'tophat', name: 'Top Hat', price: 300, color: 0x15161c, accent: 0xc8303a },
    { id: 'viking', name: 'Viking Helm', price: 350, color: 0xa8acb4, accent: 0xf4ecd8 },
    { id: 'wizard', name: 'Wizard Hat', price: 420, color: 0x3a2a9a, accent: 0xffd84a },
    { id: 'halo', name: 'Halo', price: 500, color: 0xfff0a0, accent: 0xffffff },
    { id: 'astro', name: 'Astro Dome', price: 650, color: 0xbfe8ff, accent: 0xff7a1a },
  ],
  trail: [
    { id: 'none', name: 'No Trail', price: 0 },
    { id: 'sparkle', name: 'Sparkles', price: 150, colors: [0xffffff, 0xfff0a0], rate: 34, size: 0.28, rise: 0.4, life: 0.5 },
    { id: 'bubbles', name: 'Bubbles', price: 200, colors: [0x9ad8ff, 0xd8f4ff], rate: 18, size: 0.32, rise: 1.6, life: 0.9, normal: true },
    { id: 'leaves', name: 'Leaf Fall', price: 220, colors: [0x6ad870, 0xb8e85a, 0xe8a83a], rate: 16, size: 0.3, rise: -1.2, life: 1.1, normal: true },
    { id: 'fire', name: 'Rocket Fire', price: 260, colors: [0xff7a1a, 0xffc040, 0xff3a1a], rate: 40, size: 0.38, rise: 1.4, life: 0.45 },
    { id: 'pixels', name: '8-Bit Pixels', price: 300, colors: [0xff3a6a, 0x3ad8ff, 0xffe03a, 0x6aff6a], rate: 26, size: 0.24, rise: 0, life: 0.6 },
    { id: 'rainbow', name: 'Rainbow', price: 420, colors: [0xff3a3a, 0xff9a2a, 0xffe03a, 0x3aff6a, 0x3a9aff, 0xa03aff], rate: 46, size: 0.34, rise: 0, life: 0.55, cycle: true },
    { id: 'stardust', name: 'Stardust', price: 550, colors: [0xb08aff, 0x5fd8ff, 0xffffff], rate: 40, size: 0.3, rise: 0.2, life: 0.9 },
  ],
  jump: [
    { id: 'none', name: 'Dust Puff', price: 0 },
    { id: 'confetti', name: 'Confetti', price: 150 },
    { id: 'stars', name: 'Star Pop', price: 200, color: 0xffe05a },
    { id: 'hearts', name: 'Hearts', price: 220, color: 0xff5a8a },
    { id: 'ring', name: 'Shock Ring', price: 260, color: 0x7fe0ff },
    { id: 'notes', name: 'Music Notes', price: 300 },
    { id: 'lightning', name: 'Lightning', price: 400, color: 0xa0d8ff },
  ],
  pet: [
    { id: 'none', name: 'No Companion', price: 0 },
    { id: 'orb', name: 'Orb Drone', price: 300, color: 0xe8ecf2, accent: 0x5fd8ff },
    { id: 'satellite', name: 'Pocket Satellite', price: 380, color: 0xd8d0c0, accent: 0x2a6aff },
    { id: 'comet', name: 'Comet Sprite', price: 420, color: 0x9ae8ff, accent: 0xffffff },
    { id: 'ufo', name: 'Mini UFO', price: 480, color: 0xb8c0cc, accent: 0x7aff8a },
    { id: 'cat', name: 'Cat Bot', price: 550, color: 0xffdce8, accent: 0xff6aa8 },
    { id: 'jelly', name: 'Glow Jelly', price: 650, color: 0x5affd8, accent: 0xff7ae8 },
  ],
  dance: [
    { id: 'none', name: 'Fist Pump', price: 0 },
    { id: 'spin', name: 'Twirl', price: 150 },
    { id: 'robot', name: 'The Robot', price: 220 },
    { id: 'floss', name: 'Floss', price: 300 },
    { id: 'backflip', name: 'Backflips', price: 350 },
    { id: 'moonwalk', name: 'Moonwalk', price: 420 },
    { id: 'breakdance', name: 'Breakdance', price: 550 },
  ],
  ship: [
    { id: 'none', name: 'Starhopper White', price: 0, hull: 0xd8dde6, trim: 0x3a4150, accent: 0x1e7bff },
    { id: 'crimson', name: 'Crimson Comet', price: 200, hull: 0xc8303a, trim: 0x2a2a30, accent: 0xffd84a },
    { id: 'jungle', name: 'Jungle Camo', price: 250, hull: 0x5a7a3a, trim: 0x2a3a1a, accent: 0xffa030 },
    { id: 'stealth', name: 'Stealth', price: 300, hull: 0x22252c, trim: 0x101216, accent: 0xff3a3a },
    { id: 'neon', name: 'Neon Racer', price: 400, hull: 0x1a0a30, trim: 0x0a0418, accent: 0xff3ad8 },
    { id: 'gold', name: 'Gold Plated', price: 600, hull: 0xffcf5a, trim: 0x8a6a20, accent: 0xffffff, metal: 0.9 },
    { id: 'galaxy', name: 'Galaxy', price: 800, hull: 0x2a1a6a, trim: 0x140a3a, accent: 0x7af0ff, galaxy: true },
  ],
};

export function itemById(cat, id) {
  const list = ITEMS[cat] || [];
  return list.find((i) => i.id === id) || list[0];
}

// owned / equipped bookkeeping lives in the save; these helpers keep it consistent
export function defaultCosmetics() {
  const owned = {}, equip = {};
  for (const c of Object.keys(ITEMS)) { owned[c] = ['none']; equip[c] = 'none'; }
  return { owned, equip };
}
export function normalizeCosmetics(save) {
  const d = defaultCosmetics();
  save.owned = { ...d.owned, ...(save.owned || {}) };
  save.equip = { ...d.equip, ...(save.equip || {}) };
  for (const c of Object.keys(ITEMS)) {
    save.owned[c] = [...new Set(['none', ...save.owned[c].filter((id) => ITEMS[c].some((i) => i.id === id))])];
    if (!save.owned[c].includes(save.equip[c])) save.equip[c] = 'none';
  }
  return save;
}
// buy (if affordable) and equip; returns 'bought' | 'equipped' | 'poor'
export function buyOrEquip(save, cat, id) {
  normalizeCosmetics(save);
  const it = itemById(cat, id);
  if (!save.owned[cat].includes(it.id)) {
    if ((save.wallet || 0) < it.price) return 'poor';
    save.wallet -= it.price;
    save.owned[cat].push(it.id);
    save.equip[cat] = it.id;
    return 'bought';
  }
  save.equip[cat] = it.id;
  return 'equipped';
}
