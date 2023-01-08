import { ME, NEUTRAL, OPP } from "./constants";
import { Tile } from "./tile";

export class Island {
  blocks: Tile[] = [];

  constructor() {}

  public get owners(): number[] {
    let owners = [];
    const containsAllyBlock =
      this.blocks.findIndex((block) => block.owner === ME && block.canSpawn) >=
      0;
    const containsOpponentBlock =
      this.blocks.findIndex(
        (block) => block.owner === OPP && !block.recycler
      ) >= 0;
    const containsNeutral =
      this.blocks.findIndex((block) => block.owner === NEUTRAL) >= 0;
    if (containsAllyBlock) owners.push(ME);
    if (containsOpponentBlock) owners.push(OPP);
    if (containsNeutral) owners.push(NEUTRAL);
    return owners;
  }

  static createIsland(startTile: Tile) {
    const island = new Island();
    const stack = [startTile];
    while (stack.length) {
      const block = stack.pop()!;
      island.blocks.push(block);
      block.island = island;
      const neighbors = block.neighbors.filter((neighbor) => !neighbor.island);
      for (let i = 0; i < neighbors.length; i++) {
        stack.push(neighbors[i]);
      }
    }
    return island;
  }

  static findIslands = (allTiles: Tile[]) => {
    let blockWithoutIsland = allTiles.find(
      (tile) => !tile.island && tile.canMove
    );
    const islands: Island[] = [];
    while (blockWithoutIsland) {
      const island = Island.createIsland(blockWithoutIsland);
      islands.push(island);
      blockWithoutIsland = allTiles.find(
        (tile) => !tile.island && tile.canMove
      );
    }
    return islands;
  };
}
