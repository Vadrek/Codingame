import { ME, NEUTRAL, OPP } from "./constants";
import { HEIGHT, WIDTH } from "./main";
import { dijkstraDistances } from "./utils";
import { Game } from "./game";
import { Island } from "./islands";

type TileAttributes = {
  scrapAmount: number;
  owner: number;
  units: number;
  recycler: number;
  canBuild: number;
  canSpawn: number;
  inRangeOfRecycler: number;
};

export class Tile {
  x: number;
  y: number;
  scrapAmount = 0;
  owner = -1;
  units = 0;
  recycler = false;
  canBuild = false;
  canSpawn = false;
  inRangeOfRecycler = false;
  distToOpp = Infinity;
  distToNeutral = Infinity;
  neighbors: Tile[] = [];
  neighborsWithRecycler: Tile[] = [];
  recyclingScore = 0;
  island: Island | null = null;
  hasMoved = 0;
  djikstraMap: number[][] = [];
  potentiel: number | null = null;

  constructor(x: number, y: number, game: Game) {
    this.x = x;
    this.y = y;
  }

  updateTile({
    scrapAmount,
    owner,
    units,
    recycler,
    canBuild,
    canSpawn,
    inRangeOfRecycler,
  }: TileAttributes) {
    this.scrapAmount = scrapAmount;
    this.owner = owner;
    this.units = units;
    this.recycler = recycler === 1;
    this.canBuild = canBuild === 1;
    this.canSpawn = canSpawn === 1;
    this.inRangeOfRecycler = inRangeOfRecycler === 1;
    this.island = null;
    this.hasMoved = 0;
    this.potentiel = null;
  }

  public get canMove(): boolean {
    return !this.recycler && this.scrapAmount > 0;
  }

  updateNeighbors(matrix: Tile[][]): void {
    this.neighbors = [];
    this.neighborsWithRecycler = [];
    const vectors = [
      [-1, 0],
      [1, 0],
      [0, -1],
      [0, 1],
    ];
    vectors.forEach(([dx, dy]: number[]) => {
      const y1 = this.y + dy;
      const x1 = this.x + dx;
      if (0 <= x1 && x1 < WIDTH && 0 <= y1 && y1 < HEIGHT) {
        const adjTile = matrix[y1][x1];
        if (
          (adjTile.scrapAmount > 0 && !adjTile.inRangeOfRecycler) ||
          adjTile.scrapAmount > 1
        ) {
          this.neighborsWithRecycler.push(adjTile);
          if (!adjTile.recycler) {
            this.neighbors.push(adjTile);
          }
        }
      }
    });
  }

  distanceToTile(tile: Tile, matrix: Tile[][]) {
    if (!this.djikstraMap.length) {
      this.djikstraMap = dijkstraDistances(matrix, this);
    }
    return this.djikstraMap[tile.y][tile.x];
  }

  getPotentiel(matrix: Tile[][], notMyTiles: Tile[]) {
    if (this.potentiel) return this.potentiel;
    this.potentiel = 0;
    for (let i = 0; i < notMyTiles.length; i++) {
      const tile = notMyTiles[i];
      let distance = Math.max(0.5, this.distanceToTile(tile, matrix)) ** 2;
      if (distance <= 5) {
        if (tile.owner === ME) {
          if (tile.units) this.potentiel -= 4 / distance;
          else this.potentiel -= 1 / distance;
        } else if (tile.owner === NEUTRAL) {
          this.potentiel += 1 / distance;
        } else if (tile.owner === OPP) {
          if (tile.units) this.potentiel += 4 / distance;
          else this.potentiel += 3 / distance;
        }
      }
    }
    return this.potentiel;
  }
}
