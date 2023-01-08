import { Heapq } from "ts-heapq";
import { Tile } from "./tile";

export const manhattanDist = (a: Tile, b: Tile) => {
  return Math.abs(a.x - b.x) + Math.abs(a.y - b.y);
};

export type NodeHeuristic = {
  dist: number;
  tile: Tile;
  firstStep: Tile | null;
  heuristic: number;
};

export const aStar = (
  startTile: Tile,
  endTile: Tile
): { dist: number; firstSteps: Tile[] } => {
  const visited = new Set([startTile]);
  let stack: Heapq<NodeHeuristic> = new Heapq<NodeHeuristic>(
    [
      {
        dist: 0,
        tile: startTile,
        firstStep: null,
        heuristic: manhattanDist(startTile, endTile),
      },
    ],
    (x, y) => x.heuristic < y.heuristic
  );

  let bestDist = Infinity;
  let firstStepsSet = new Set<Tile>();
  while (stack.length() > 0) {
    const { dist, tile, firstStep }: NodeHeuristic = stack.pop();
    tile.neighbors.forEach((neighbor) => {
      const newNode = {
        dist: dist + 1,
        tile: neighbor,
        firstStep: firstStep ?? neighbor,
        heuristic: dist + 1 + manhattanDist(neighbor, endTile),
      };
      if (neighbor === endTile) {
        bestDist = newNode.dist;
        firstStepsSet.add(newNode.firstStep);
      } else if (!visited.has(neighbor) && newNode.heuristic < bestDist) {
        stack.push(newNode);
        visited.add(neighbor);
      }
    });
  }
  const firstSteps = Array.from(firstStepsSet).sort(
    (a, b) => a.owner - b.owner
  );
  return { dist: bestDist, firstSteps };
};

export type DistTile = {
  dist: number;
  tile: Tile;
};

export const dijkstraDistances = (
  matrix: Tile[][],
  startTile: Tile
): number[][] => {
  const distances: number[][] = new Array(matrix.length)
    .fill(Infinity)
    .map(() => new Array(matrix[0].length).fill(Infinity));

  const visited = new Set([startTile]);
  let stack = new Heapq<DistTile>([], (x, y) => x.dist < y.dist);
  stack.push({ dist: 0, tile: startTile });

  while (stack.length() > 0) {
    const { dist, tile } = stack.pop();
    distances[tile.y][tile.x] = dist;
    tile.neighbors.forEach((neighbor) => {
      if (!visited.has(neighbor)) {
        stack.push({ dist: dist + 1, tile: neighbor });
        visited.add(neighbor);
      }
    });
  }
  return distances;
};

export const dijkstraTarget = (
  startTiles: Tile[],
  endTiles: Tile[]
): DistTile => {
  const visited = new Set(startTiles);
  let stack = new Heapq<DistTile>([], (x, y) => x.dist < y.dist);
  startTiles.forEach((startTile) => stack.push({ dist: 0, tile: startTile }));

  while (stack.length() > 0) {
    const { dist, tile }: DistTile = stack.pop();
    const neighbors = tile.neighbors.filter(
      (tile) =>
        !tile.recycler && (!tile.inRangeOfRecycler || tile.scrapAmount > 1)
    );
    for (let i = 0; i < neighbors.length; i++) {
      const newNode = {
        dist: dist + 1,
        tile: neighbors[i],
      };
      if (endTiles.includes(neighbors[i])) {
        return newNode;
      } else if (!visited.has(neighbors[i])) {
        stack.push(newNode);
        visited.add(neighbors[i]);
      }
    }
  }
  return { dist: Infinity, tile: endTiles[0] };
};
