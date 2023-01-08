import { COST, ME, OPP, RECYCLER_THRESHOLD } from "./constants";
import { Game } from "./game";
import { Tile } from "./tile";

export const buildRecyler = (game: Game, myTiles: Tile[]): void => {
  const placesToBuildDefensively = findPlacesToBuildDefensively(myTiles);
  let index = 0;
  while (game.myMatter >= COST && index < placesToBuildDefensively.length) {
    game.build(placesToBuildDefensively[index]);
    index++;
    game.canBuildThisTurn = false;
  }

  //   if (game.canBuildThisTurn) {
  const placesToBuild = findPlacesToBuildRecyclerForResource(myTiles);
  if (game.myMatter >= COST && game.myMatter <= 100 && placesToBuild.length) {
    game.build(placesToBuild[0]);
  }
  //   placesToBuild.forEach((place) =>
  //     console.error("x y score", place.x, place.y, place.recyclingScore)
  //   );
  //   } else {
  //     game.canBuildThisTurn = true;
  //   }
};

export const findPlacesToBuildRecyclerForResource = (
  myTiles: Tile[]
): Tile[] => {
  const selectedTiles = myTiles.filter((tile) => {
    return (
      tile.canBuild && tile.island?.owners.includes(OPP)
      //   destructedTiles(tile) === 1
    );
  });
  selectedTiles.forEach((tile) => {
    tile.recyclingScore = getRecyclerScore(tile);
  });
  const interestingTiles = selectedTiles.filter(
    (tile) => tile.recyclingScore >= RECYCLER_THRESHOLD
  );
  return interestingTiles.sort((a, b) => b.recyclingScore - a.recyclingScore);
};

const findPlacesToBuildDefensively = (myTiles: Tile[]): Tile[] => {
  const myDangerousTiles = myTiles
    .filter(
      (tile) =>
        tile.canBuild &&
        tile.neighbors.some(
          (neighbor) => neighbor.owner === OPP && neighbor.units > 0
        )
    )
    .sort((a, b) => {
      return getNeighborOppUnits(b) - getNeighborOppUnits(a);
    });

  return myDangerousTiles;
};

const getNeighborOppUnits = (tile: Tile): number => {
  return tile.neighbors.reduce((acc, neighbor) => {
    if (neighbor.owner === OPP) {
      return acc + neighbor.units;
    }
    return acc;
  }, 0);
};

const getRecyclerGain = (tile: Tile): number => {
  return [...tile.neighbors, tile].reduce((acc, neighbor) => {
    if (neighbor.owner == ME && neighbor.inRangeOfRecycler) {
      return acc;
    }
    return acc + Math.min(tile.scrapAmount, neighbor.scrapAmount);
  }, 0);
};

export const destructedTiles = (tile: Tile): number => {
  return tile.neighbors.reduce((acc, neighbor) => {
    if (neighbor.scrapAmount <= tile.scrapAmount) {
      return acc + 1;
    }
    return acc;
  }, 1);
};

export const getRecyclerScore = (tile: Tile): number => {
  return getRecyclerGain(tile) / destructedTiles(tile);
};
