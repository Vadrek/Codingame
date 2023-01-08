import { COST, ME, OPP } from "./constants";
import { Tile } from "./tile";
import { Island } from "./islands";
import { moveRobots } from "./robotMove";
import { spawnRobots } from "./robotSpawn";
import { buildRecyler } from "./recyclerBuild";
import { detectBorders } from "./detectBorders";
import { moveToBorders } from "./newIA";

export class Game {
  public turn: number = 0;
  public myMatter = 0;
  public oppMatter = 0;
  public myBase: Tile;
  public oppBase: Tile;
  public canBuildThisTurn = true;

  public actions: string[] = [];
  public matrix: Tile[][] = [];
  public allTiles: Tile[] = [];
  public myTiles: Tile[] = [];
  public notMyTiles: Tile[] = [];
  public oppTiles: Tile[] = [];
  public myRobots: Tile[] = [];
  public startBaseOnLeft = false;
  public islands: Island[] = [];
  public borders: Tile[] = [];

  constructor(width: number, height: number) {
    for (let y = 0; y < height; y++) {
      const row: Tile[] = [];
      for (let x = 0; x < width; x++) {
        row.push(new Tile(x, y, this));
      }
      this.matrix.push(row);
    }
    this.myBase = this.matrix[0][0];
    this.oppBase = this.matrix[0][0];
  }

  build(tile: Tile): void {
    this.actions.push(`BUILD ${tile.x} ${tile.y}`);
    this.myMatter -= COST;
    tile.recycler == true;
  }

  spawn(amount: number, tile: Tile): void {
    this.actions.push(`SPAWN ${amount} ${tile.x} ${tile.y}`);
    this.myMatter -= COST;
  }

  move(amount: number, origin: Tile, destination: Tile): void {
    this.actions.push(
      `MOVE ${amount} ${origin.x} ${origin.y} ${destination.x} ${destination.y}`
    );
  }

  newTurn(): void {
    this.allTiles = this.matrix
      .flat()
      .filter(
        (tile: Tile) =>
          tile.scrapAmount > 0 &&
          (tile.scrapAmount > 1 || !tile.inRangeOfRecycler) &&
          !tile.recycler
      );
    this.allTiles.forEach((tile) => tile.updateNeighbors(this.matrix));
    this.turn += 1;
    this.myTiles = this.allTiles.filter((tile) => tile.owner === ME);
    this.notMyTiles = this.allTiles.filter((tile) => tile.owner !== ME);
    this.oppTiles = this.allTiles.filter((tile) => tile.owner === OPP);
    this.myRobots = this.myTiles.filter((tile) => tile.units > 0);
    if (this.turn === 1) {
      this.myBase = this.myTiles.filter((tile) => !tile.units)[0];
      this.oppBase = this.oppTiles.filter((tile) => !tile.units)[0];
      this.startBaseOnLeft = this.myBase.x < this.oppBase.x;
      this.borders = detectBorders(this.myBase, this.oppBase, this.matrix);
    }
    this.islands = Island.findIslands(this.allTiles);
  }

  gameIsOver = () => {
    const islandsToFightFor = this.islands.filter(
      (island: Island) =>
        island.owners.includes(ME) && island.owners.length !== 1
    );
    return islandsToFightFor.length === 0;
  };

  addActions(): void {
    this.actions = [];
    if (!this.gameIsOver()) {
      buildRecyler(this, this.myTiles);
      //   if (this.turn < 8) {
      //   console.error("this.borders", this.borders.length);
      //   moveToBorders(this.myRobots, this.borders, this);
      //   } else {
      moveRobots(this, this.myRobots);
      spawnRobots(this, this.myTiles);
    }
  }

  displayNextActions(): void {
    console.log(this.actions.length > 0 ? this.actions.join(";") : "WAIT");
  }
}
