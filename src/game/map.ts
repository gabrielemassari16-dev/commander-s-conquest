import type { Biome, Tile } from "./types";

export const MAP_W = 16;
export const MAP_H = 10;

// Deterministic-ish seeded random
function rng(seed: number) {
  let s = seed >>> 0;
  return () => {
    s = (s * 1664525 + 1013904223) >>> 0;
    return s / 0xffffffff;
  };
}

export function generateMap(seed = Date.now() % 1000000): Tile[][] {
  const rnd = rng(seed);
  const map: Tile[][] = [];
  for (let y = 0; y < MAP_H; y++) {
    const row: Tile[] = [];
    for (let x = 0; x < MAP_W; x++) {
      let biome: Biome = "plain";
      const r = rnd();
      // sea band on right
      if (x >= MAP_W - 3 && rnd() < 0.6) biome = "sea";
      else if (r < 0.18) biome = "forest";
      else if (r < 0.3) biome = "mountain";
      else if (r < 0.4) biome = "desert";
      else biome = "plain";
      row.push({ biome });
    }
    map.push(row);
  }
  // Sprinkle villages
  for (let i = 0; i < 5; i++) {
    const x = Math.floor(rnd() * (MAP_W - 4)) + 2;
    const y = Math.floor(rnd() * MAP_H);
    if (map[y][x].biome !== "sea") {
      map[y][x] = { biome: "village", village: true };
    }
  }
  return map;
}

export function biomeColor(b: Biome): string {
  switch (b) {
    case "desert": return "var(--color-biome-desert)";
    case "forest": return "var(--color-biome-forest)";
    case "mountain": return "var(--color-biome-mountain)";
    case "sea": return "var(--color-biome-sea)";
    case "village": return "var(--color-biome-village)";
    default: return "var(--color-biome-plain)";
  }
}

export function biomeLabel(b: Biome): string {
  return { desert: "Deserto", forest: "Foresta", mountain: "Montagna", sea: "Mare", village: "Villaggio", plain: "Pianura" }[b];
}

export function biomeIcon(b: Biome): string {
  return { desert: "🌵", forest: "🌲", mountain: "⛰️", sea: "🌊", village: "🏘️", plain: "🌾" }[b];
}

export function isPassable(b: Biome, isVehicle: boolean, isNaval: boolean): boolean {
  if (b === "sea") return isNaval; // only naval/air
  if (b === "mountain" && isVehicle) return false;
  return true;
}
