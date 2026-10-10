// Gera os PNGs-fonte do icone e splash (assets/) a partir do icone truck-front-fill
// do Bootstrap Icons. Depois: `npx capacitor-assets generate --android`.
import sharp from "sharp";
import { mkdirSync } from "node:fs";

const truck = (fill) => `<path fill="${fill}" d="M3.5 0A2.5 2.5 0 0 0 1 2.5v9c0 .818.393 1.544 1 2v2a.5.5 0 0 0 .5.5h2a.5.5 0 0 0 .5-.5V14h6v1.5a.5.5 0 0 0 .5.5h2a.5.5 0 0 0 .5-.5v-2c.607-.456 1-1.182 1-2v-9A2.5 2.5 0 0 0 12.5 0zM3 3a1 1 0 0 1 1-1h8a1 1 0 0 1 1 1v3.9c0 .625-.562 1.092-1.17.994C10.925 7.747 9.208 7.5 8 7.5s-2.925.247-3.83.394A1.008 1.008 0 0 1 3 6.9zm1 9a1 1 0 1 1 0-2 1 1 0 0 1 0 2m8 0a1 1 0 1 1 0-2 1 1 0 0 1 0 2m-5-2h2a1 1 0 1 1 0 2H7a1 1 0 1 1 0-2"/>`;
// icone de 16x16 centralizado num canvas de `size`, ocupando `ratio` da largura
const svg = (size, ratio, fill, bg) => {
  const s = (size * ratio) / 16, off = (size - 16 * s) / 2;
  return Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}">` +
    (bg ? `<rect width="100%" height="100%" fill="${bg}"/>` : "") +
    `<g transform="translate(${off} ${off}) scale(${s})">${truck(fill)}</g></svg>`);
};

const TEAL = "#14b8a6", DARK = "#0a0e11";
mkdirSync("assets", { recursive: true });
await sharp(svg(1024, 0.5, "#ffffff", TEAL)).png().toFile("assets/icon-only.png");
await sharp(svg(1024, 0.38, "#ffffff")).png().toFile("assets/icon-foreground.png");
await sharp(svg(1024, 1, TEAL, TEAL)).png().toFile("assets/icon-background.png");
await sharp(svg(2732, 0.16, TEAL, DARK)).png().toFile("assets/splash.png");
await sharp(svg(2732, 0.16, TEAL, DARK)).png().toFile("assets/splash-dark.png");
console.log("icons: assets/*.png gerados");
