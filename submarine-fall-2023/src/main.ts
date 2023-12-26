/* ******************************************************
                            CONSTANTS
****************************************************** */

const fishTypeMinY = {
  0: 2500,
  1: 5000,
  2: 7500,
};
const fishTypeMaxY = {
  0: 5000,
  1: 7500,
  2: 10000,
};

type RadarType = "TL" | "TR" | "BL" | "BR";
const droneSpeed = 600;
const fishSpeed = 200;
const scanWithoutLight = 800;
const scanWithLight = 2000;
const batteryUse = 5;
const batteryReload = 1;
const batteryCapacity = 30;

/* ******************************************************
                            UTILS
****************************************************** */

const distance = (x1: number, y1: number, x2: number, y2: number): number => {
  return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
};

/* ******************************************************
                            CLASSES
****************************************************** */

class Fish {
  constructor(
    public id: number,
    public color: number,
    public type: number,
    public x: number,
    public y: number,
    public vx: number,
    public vy: number,
    public scanned: boolean = false
  ) {}
  updatePosition({
    x,
    y,
    vx,
    vy,
  }: {
    x: number;
    y: number;
    vx: number;
    vy: number;
  }): void {
    this.x = x;
    this.y = y;
    this.vx = vx;
    this.vy = vy;
  }

  scan(): void {
    this.scanned = true;
  }
}

class Drone {
  constructor(
    public id: number,
    public x: number,
    public y: number,
    public emergency: number,
    public battery: number,
    public fishRadars: Record<number, RadarType> = {},
    public fishTypeFocus: number = 0
  ) {}

  update({ x, y, battery }: { x: number; y: number; battery: number }): void {
    this.x = x;
    this.y = y;
    this.battery = battery;
  }

  distanceTo(fish: Fish): number {
    return distance(this.x, this.y, fish.x, fish.y);
  }
}

class Game {
  constructor(
    public turn: number = 0,
    public allFishes: Record<number, Fish> = {},
    public myDrones: Record<number, Drone> = {},
    public myDroneCount: number = 0,
    public myScore: number = 0,
    public enemyScore: number = 0
  ) {}
  initialize() {
    const creatureCount: number = parseInt(readline());
    for (let i = 0; i < creatureCount; i++) {
      const [creatureId, color, type]: number[] = readline()
        .split(" ")
        .map(Number);
      this.allFishes[creatureId] = new Fish(
        creatureId,
        color,
        type,
        0,
        0,
        0,
        0
      );
    }
  }

  newTurn() {
    this.turn++;
    this.myScore = parseInt(readline());
    this.enemyScore = parseInt(readline());
    const myScanCount: number = parseInt(readline());
    for (let i = 0; i < myScanCount; i++) {
      const creatureId: number = parseInt(readline());
      this.allFishes[creatureId].scan();
    }
    const enemyScanCount: number = parseInt(readline());
    for (let i = 0; i < enemyScanCount; i++) {
      const creatureId: number = parseInt(readline());
    }
    this.myDroneCount = parseInt(readline());
    for (let i = 0; i < this.myDroneCount; i++) {
      const [droneId, droneX, droneY, emergency, battery] = readline()
        .split(" ")
        .map(Number);

      if (this.turn === 1) {
        this.myDrones[droneId] = new Drone(
          droneId,
          droneX,
          droneY,
          emergency,
          battery
        );
      } else {
        this.myDrones[droneId].update({ x: droneX, y: droneY, battery });
      }
    }

    const enemyDroneCount: number = parseInt(readline());
    for (let i = 0; i < enemyDroneCount; i++) {
      const [droneId, droneX, droneY, emergency, battery]: number[] = readline()
        .split(" ")
        .map(Number);
    }
    const droneScanCount: number = parseInt(readline());
    for (let i = 0; i < droneScanCount; i++) {
      const [droneId, creatureId]: number[] = readline().split(" ").map(Number);
    }
    const visibleCreatureCount: number = parseInt(readline());
    for (let i = 0; i < visibleCreatureCount; i++) {
      const [
        creatureId,
        creatureX,
        creatureY,
        creatureVx,
        creatureVy,
      ]: number[] = readline().split(" ").map(Number);
      this.allFishes[creatureId].updatePosition({
        x: creatureX,
        y: creatureY,
        vx: creatureVx,
        vy: creatureVy,
      });
    }
    const radarBlipCount: number = parseInt(readline());
    for (let i = 0; i < radarBlipCount; i++) {
      var inputs: string[] = readline().split(" ");
      const droneId: number = parseInt(inputs[0]);
      const creatureId: number = parseInt(inputs[1]);
      const radar: string = inputs[2];
      this.myDrones[droneId].fishRadars[creatureId] = radar as RadarType;
    }
  }
}

const game = new Game();
game.initialize();

/* ******************************************************
                        GAME LOOP
****************************************************** */

while (true) {
  game.newTurn();

  /* ******************************************************
                            LOGIC
  ****************************************************** */

  // const myDrone = game.myDrones[0];
  // const sortedFishes = Object.values(allFishes)
  //   .filter((fish) => !fish.scanned)
  //   .sort((a: Fish, b: Fish) => {
  //     return myDrone.distanceTo(a) - myDrone.distanceTo(b);
  //   });

  // const closestFish = sortedFishes[0];
  // const activateLight = myDrone.distanceTo(closestFish) < 2600;
  // const light = activateLight ? 1 : 0;

  for (let i = 0; i < game.myDroneCount; i++) {
    // Write an action using console.log()
    // To debug: console.error('Debug messages...');
    // console.error("x, y, battery", closestFish.x, closestFish.y, light);
    // console.log(`MOVE ${closestFish.x} ${closestFish.y} ${light}`);

    console.log("WAIT 1"); // MOVE <x> <y> <light (1|0)> | WAIT <light (1|0)>
  }
}
