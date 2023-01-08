import { Game } from "./game";

var inputs = readline().split(" ");
export const WIDTH = parseInt(inputs[0]);
export const HEIGHT = parseInt(inputs[1]);
const game = new Game(WIDTH, HEIGHT);

// game loop
while (true) {
  const [myMatter, oppMatter]: number[] = readline().split(" ").map(Number);
  game.myMatter = myMatter;
  game.oppMatter = oppMatter;

  for (let y = 0; y < HEIGHT; y++) {
    for (let x = 0; x < WIDTH; x++) {
      const [
        scrapAmount,
        owner,
        units,
        recycler,
        canBuild,
        canSpawn,
        inRangeOfRecycler,
      ] = readline().split(" ").map(Number);
      game.matrix[y][x].updateTile({
        scrapAmount,
        owner,
        units,
        recycler,
        canBuild,
        canSpawn,
        inRangeOfRecycler,
      });
    }
  }

  game.newTurn();
  game.addActions();
  game.displayNextActions();
}
