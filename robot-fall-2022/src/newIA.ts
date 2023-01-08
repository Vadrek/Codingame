import { COST, ME, NEUTRAL, OPP } from "./constants";
import { Game } from "./game";
import { Tile } from "./tile";
import { aStar, dijkstraTarget } from "./utils";

export const updateBorders = (borders: Tile[]) => {
  borders.filter((border) => {
    if (!border.scrapAmount) {
      return false;
    }
  });
};

export const moveToBorders = (
  myRobots: Tile[],
  borders: Tile[],
  game: Game
) => {
  // remove useless borders
  borders = borders.filter(
    (border) =>
      border.owner === NEUTRAL ||
      (border.owner === ME &&
        border.neighbors.some(
          (neighbor) => neighbor.owner === OPP && neighbor.units
        ))
  );
  const dangerousZones = game.myTiles.filter(
    (tile) =>
      tile.canSpawn && tile.neighbors.some((neighbor) => neighbor.owner === OPP)
  );
  dangerousZones.forEach((tile) => {
    if (!borders.includes(tile)) {
      borders.push(tile);
    }
  });

  let borderIndex = 0;
  let robotsLeft = myRobots.filter((tile) => tile.units > tile.hasMoved);
  borders.forEach((b) => console.error("border", b.x, b.y));
  while (borderIndex < borders.length && robotsLeft.length) {
    const { robot, firstStep } = chooseBestRobot(
      robotsLeft,
      borders[borderIndex]
    );
    const destination = firstStep ?? borders[borderIndex];
    game.move(1, robot, destination);
    robotsLeft = robotsLeft.filter((tile) => tile.units > tile.hasMoved);
    borderIndex++;
  }
  while (borderIndex < borders.length && game.myMatter >= COST) {
    const closestPlaceToSpawn = dijkstraTarget(
      [borders[borderIndex]],
      game.myTiles
    ).tile;
    game.spawn(1, closestPlaceToSpawn);
  }
};

const chooseBestRobot = (myRobots: Tile[], border: Tile) => {
  const distMap = new Map<Tile, number>();
  const bestFirstSteps = new Map<Tile, Tile>();
  myRobots.forEach((robot) => {
    const { dist, firstSteps } = aStar(robot, border);
    const bestFirstStep = firstSteps.sort((a, b) => a.owner - b.owner)[0];
    distMap.set(robot, dist);
    bestFirstSteps.set(robot, bestFirstStep);
  });
  const bestRobot = myRobots.sort((a, b) => {
    return (
      (distMap.get(a) ?? 0) - (distMap.get(b) ?? 0) ||
      (bestFirstSteps.get(a)?.owner ?? 0) - (bestFirstSteps.get(b)?.owner ?? 0)
    );
  })[0];
  bestRobot.hasMoved++;
  return { robot: bestRobot, firstStep: bestFirstSteps.get(bestRobot) };
};
