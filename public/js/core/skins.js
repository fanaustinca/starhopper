// Robot skins sold in the shop. Prices are in energy cells.
export const SKINS = [
  { id: 'classic', name: 'Classic', price: 0, body: 0xd4d9e1, accent: 0x1e7bff, joint: 0x9aa3b2, eye: 0x5fd8ff },
  { id: 'midnight', name: 'Midnight', price: 120, body: 0x1c1f2a, accent: 0x8a6aff, joint: 0x3a3f4c, eye: 0xb89aff },
  { id: 'mint', name: 'Mint Pop', price: 180, body: 0xb4f2dc, accent: 0xff6aa8, joint: 0xf4f6fa, eye: 0xff6aa8 },
  { id: 'solar', name: 'Solar Flare', price: 250, body: 0xff8a2a, accent: 0xffe04a, joint: 0x8a3a10, eye: 0xfff07a, bodyGlow: 0x3a0e00 },
  { id: 'retro', name: 'Retro Tin', price: 250, body: 0xb8bcc4, accent: 0xd03a2a, joint: 0x6a6e76, eye: 0xffd84a, metal: 0.9, rough: 0.35, acc: 'antenna' },
  { id: 'glacier', name: 'Glacier', price: 320, body: 0xd4f6ff, accent: 0x4ad8ff, joint: 0x8ad0e8, eye: 0x9af8ff, glass: true },
  { id: 'ninja', name: 'Ninja', price: 380, body: 0x121318, accent: 0xff2a3a, joint: 0x24262c, eye: 0xff3a3a, acc: 'scarf' },
  { id: 'chrome', name: 'Gold Chrome', price: 450, body: 0xffcf5a, accent: 0xffffff, joint: 0xb08a30, eye: 0x5fd8ff, metal: 1, rough: 0.12 },
  { id: 'kitty', name: 'Kitty Bot', price: 450, body: 0xffdce8, accent: 0xff6aa8, joint: 0xffffff, eye: 0x5fd8ff, acc: 'ears' },
  { id: 'ranger', name: 'Space Ranger', price: 550, body: 0xd8dce4, accent: 0xff7a1a, joint: 0x8a8f9a, eye: 0x7affd8, acc: 'backpack' },
  { id: 'magma', name: 'Magma Core', price: 650, body: 0x2a1410, accent: 0xff4a10, joint: 0x4a2a20, eye: 0xffa040, bodyGlow: 0x200400, accentGlow: 3 },
  { id: 'royal', name: 'Royal', price: 800, body: 0x6a3ab0, accent: 0xffd34a, joint: 0xffd34a, eye: 0xffe08a, acc: 'crown' },
  { id: 'galaxy', name: 'Galaxy', price: 1200, body: 0x241650, accent: 0xff4ad0, joint: 0x3a2a70, eye: 0x9af8ff, galaxy: true },
];

export function skinById(id) {
  return SKINS.find((s) => s.id === id) || SKINS[0];
}
