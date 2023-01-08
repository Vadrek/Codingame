import { Heapq } from "ts-heapq";
import { Tile } from "./tile";
import { DistTile } from "./utils";

export const detectBorders = (
  myBase: Tile,
  oppBase: Tile,
  matrix: Tile[][]
) => {
  const visited = new Set([myBase]);
  let stack = new Heapq<DistTile>([], (x, y) => x.dist < y.dist);
  let dist = 0;
  let borders: Tile[] = [];
  stack.push({ dist, tile: myBase });
  while (stack.length()) {
    const { dist, tile } = stack.pop();
    const neighbors = tile.neighbors.filter(
      (tile) => tile.scrapAmount && !visited.has(tile)
    );
    if (
      neighbors.some((neighbor) => {
        const distToOpp = oppBase.distanceToTile(neighbor, matrix);
        return distToOpp < dist + 1;
      })
    ) {
      borders.push(tile);
    }
    neighbors
      .filter((neighbor) => {
        const distToOpp = oppBase.distanceToTile(neighbor, matrix);
        return distToOpp >= dist + 1;
      })
      .forEach((neighbor) => {
        stack.push({
          dist: dist + 1,
          tile: neighbor,
        });
        visited.add(neighbor);
      });
  }
  return borders;
};
