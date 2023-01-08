import { COST, ME } from "./constants";
import { Game } from "./game";
import { Island } from "./islands";
import { Tile } from "./tile";

export const spawnRobots = (game: Game, myTiles: Tile[]): void => {
  game.islands.filter((island) => {
    if (
      island.owners.includes(ME) &&
      island.owners.length > 1 &&
      getNbUnitsOnIsland(island, ME) === 0 &&
      game.myMatter >= COST
    ) {
      game.spawn(1, island.blocks[0]);
    }
  });

  const placesToSpawn = findPlacesToSpawn(
    myTiles,
    game.notMyTiles,
    game.matrix
  );
  let index = 0;
  while (game.myMatter >= COST && placesToSpawn[index]) {
    game.spawn(1, placesToSpawn[index]);
    index = (index + 1) % placesToSpawn.length;
  }
};

const findPlacesToSpawn = (
  myTiles: Tile[],
  notMyTiles: Tile[],
  matrix: Tile[][]
): Tile[] => {
  const interestingPlaces = myTiles.filter(
    (tile) =>
      tile.canSpawn &&
      // useless to spawn if island is already fully mine
      !(tile.island?.owners.includes(ME) && tile.island?.owners.length === 1) &&
      (tile.scrapAmount > 1 || !tile.inRangeOfRecycler) &&
      tile.neighbors.find((a) => a.owner !== ME)
  );
  return interestingPlaces.sort(
    (a, b) =>
      b.getPotentiel(matrix, notMyTiles) - a.getPotentiel(matrix, notMyTiles)
  );
};

const getNbUnitsOnIsland = (island: Island, owner: number): number => {
  return island.blocks.reduce((acc, block) => {
    if (block.owner === owner) {
      return acc + block.units;
    }
    return acc;
  }, 0);
};
