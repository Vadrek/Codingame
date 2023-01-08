import { ME, OPP } from "./constants";
import { Game } from "./game";
import { Tile } from "./tile";
import { dijkstraTarget } from "./utils";

export const moveRobots = (game: Game, myRobots: Tile[]): void => {
  //   moveRobotsSmart(game, myRobots);
  moveRobotsNormal(game, myRobots, game.notMyTiles, game.matrix);
};

const moveRobotsNormal = (
  game: Game,
  myRobots: Tile[],
  notMyTiles: Tile[],
  matrix: Tile[][]
): void => {
  myRobots
    .filter((robot) => robot.units > robot.hasMoved)
    .forEach((robotTile) => {
      let availableRobots = robotTile.units - robotTile.hasMoved;
      if (
        availableRobots &&
        robotTile.neighbors.some(
          (neighbor) => neighbor.owner == OPP && neighbor.units
        )
      ) {
        availableRobots--;
      }
      let bestPlaces = robotTile.neighbors.sort(
        (a, b) =>
          b.getPotentiel(matrix, notMyTiles) -
          a.getPotentiel(matrix, notMyTiles)
      );
      if (
        bestPlaces.length &&
        bestPlaces[0].getPotentiel(matrix, notMyTiles) <= 0
      ) {
        bestPlaces = [dijkstraTarget([robotTile], notMyTiles).tile];
      }

      let index = 0;
      while (availableRobots > 0 && bestPlaces.length) {
        game.move(1, robotTile, bestPlaces[index]);
        availableRobots--;
        index = (index + 1) % bestPlaces.length;
      }
    });
};
