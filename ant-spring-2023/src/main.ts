const computeDistancesFloydWarshall = (cells: Cell[]) => {
  const cellIds = cells.map((cell) => cell.id);
  const dist: number[][] = new Array(cells.length)
    .fill(0)
    .map(() => new Array(cells.length).fill(Infinity));
  cells.forEach((cell) => {
    dist[cell.id][cell.id] = 0;
    cell.neighbors.forEach((neighborId) => {
      dist[cell.id][neighborId] = 1;
    });
  });
  cellIds.forEach((k) => {
    cellIds.forEach((i) => {
      cellIds.forEach((j) => {
        if (dist[i][k] + dist[k][j] < dist[i][j])
          dist[i][j] = dist[i][k] + dist[k][j];
      });
    });
  });
  return dist;
};

const getPathsToReachOnePoint = (
  cells: Cell[],
  startCellId: number,
  endCellIds: number[]
): number[][] => {
  const finalPaths: number[][] = [];
  let optimalDistance = Infinity;
  let stack = [{ dist: 0, cellId: startCellId, path: [startCellId] }];
  while (stack.length > 0) {
    stack.sort((a, b) => a.dist - b.dist);
    const { dist, cellId, path } = stack.splice(0, 1)[0];
    if (endCellIds.includes(cellId)) {
      finalPaths.push(path);
      optimalDistance = dist;
    } else if (dist > optimalDistance) {
      break;
    } else {
      const cell = cells[cellId];
      cell.neighbors.forEach((neighborId: number) => {
        if (!path.includes(neighborId)) {
          stack.push({
            dist: dist + 1,
            cellId: neighborId,
            path: [...path, neighborId],
          });
        }
      });
    }
  }
  return finalPaths;
};

const getCellsResourcesSum = (path: number[], cells: Cell[]) => {
  return path.reduce((acc, cellId) => acc + cells[cellId].resources, 0);
};

const getBestPath = (paths: number[][], cells: Cell[]) => {
  paths.sort(
    (pathA, pathB) =>
      getCellsResourcesSum(pathB, cells) - getCellsResourcesSum(pathA, cells)
  );
  return paths[0];
};

const sortByShortestDistance = (
  distances: number[][],
  filteredCells: Cell[],
  baseCell: Cell
): Cell[] => {
  return [...filteredCells].sort((a: Cell, b: Cell) => {
    return distances[a.id][baseCell.id] - distances[b.id][baseCell.id];
  });
};

const sortByShortestDistanceId = (
  distances: number[][],
  filteredCells: number[],
  baseCell: number
): number[] => {
  return [...filteredCells].sort((a: number, b: number) => {
    return distances[a][baseCell] - distances[b][baseCell];
  });
};

enum CellType {
  EMPTY = 0,
  EGG = 1,
  CRYSTAL = 2,
}

interface CellProps {
  id: number;
  type: CellType;
  resources: number;
  neighbors: number[];
}

class Cell {
  id: number;
  type: CellType;
  resources: number;
  neighbors: number[];
  myAnts = 0;
  oppAnts = 0;
  djikstraMap: Record<number, number> = {};

  constructor({ id, type, resources, neighbors }: CellProps) {
    this.id = id;
    this.type = type;
    this.resources = resources;
    this.neighbors = neighbors;
  }
  updateCell({
    resources,
    myAnts,
    oppAnts,
  }: {
    resources: number;
    myAnts: number;
    oppAnts: number;
  }) {
    this.resources = resources;
    this.myAnts = myAnts;
    this.oppAnts = oppAnts;
  }
}

class Game {
  cells: Cell[];
  resourceCells: Cell[];
  resourceCellIds: number[];
  eggCells: Cell[];
  eggCellIds: number[];
  crystalCells: Cell[];
  crystalCellIds: number[];
  numberOfBases: number;
  myBases: number[];
  oppBases: number[];
  actions: string[] = [];
  totalCrystals = 0;
  totalEggs = 0;
  myTotalAnts = 0;
  oppTotalAnts = 0;
  cellIdsWithBeacon: number[] = [];
  distances: number[][];
  sortedResourceCellIds: Record<number, number[]> = {};
  sortedEggCellIds: Record<number, number[]> = {};
  sortedCrystalCellIds: Record<number, number[]> = {};

  constructor({
    cells,
    numberOfBases,
    myBases,
    oppBases,
  }: {
    cells: Cell[];
    numberOfBases: number;
    myBases: number[];
    oppBases: number[];
  }) {
    this.cells = cells;
    this.resourceCells = cells.filter((cell) => cell.resources);
    this.resourceCellIds = this.resourceCells.map((cell) => cell.id);
    this.eggCells = cells.filter((cell) => cell.type === CellType.EGG);
    this.eggCellIds = this.eggCells.map((cell) => cell.id);
    this.crystalCells = cells.filter((cell) => cell.type === CellType.CRYSTAL);
    this.crystalCellIds = this.crystalCells.map((cell) => cell.id);
    this.numberOfBases = numberOfBases;
    this.myBases = myBases;
    this.oppBases = oppBases;
    this.distances = computeDistancesFloydWarshall(this.cells);
    for (let baseIndex = 0; baseIndex < numberOfBases; baseIndex++) {
      this.sortedResourceCellIds[baseIndex] = sortByShortestDistanceId(
        this.distances,
        this.resourceCellIds,
        myBases[baseIndex]
      );
      this.sortedEggCellIds[baseIndex] = sortByShortestDistanceId(
        this.distances,
        this.eggCellIds,
        myBases[baseIndex]
      );
      this.sortedCrystalCellIds[baseIndex] = sortByShortestDistanceId(
        this.distances,
        this.crystalCellIds,
        myBases[baseIndex]
      );
    }
  }

  createAntLine(index1: number, index2: number, strength: number): void {
    this.actions.push(`LINE ${index1} ${index2} ${strength}`);
  }

  createBeacon(index: number, strength: number): void {
    this.actions.push(`BEACON ${index} ${strength}`);
  }

  createBeaconsFromPath(cellIds: number[], strength: number): void {
    cellIds.forEach((cellId) => this.createBeacon(cellId, strength));
  }

  message(text: string, value: number): void {
    this.actions.push(`MESSAGE ${text}=${value}`);
  }

  newTurn() {
    this.actions = [];
    this.cellIdsWithBeacon = [];
    this.totalCrystals = this.cells
      .filter((cell) => cell.type === CellType.CRYSTAL)
      .reduce((acc, cell) => acc + cell.resources, 0);
    this.totalEggs = this.cells
      .filter((cell) => cell.type === CellType.EGG)
      .reduce((acc, cell) => acc + cell.resources, 0);
    this.myTotalAnts = this.cells.reduce((acc, cell) => acc + cell.myAnts, 0);
    this.oppTotalAnts = this.cells.reduce((acc, cell) => acc + cell.oppAnts, 0);
    this.eggCells = this.eggCells.filter((cell) => cell.resources > 0);
    // this.eggCellIds = this.eggCells.map((cell) => cell.id);
    this.crystalCells = this.crystalCells.filter((cell) => cell.resources > 0);
    // this.crystalCellIds = this.crystalCells.map((cell) => cell.id);
    for (let baseIndex = 0; baseIndex < numberOfBases; baseIndex++) {
      this.sortedResourceCellIds[baseIndex] = this.sortedResourceCellIds[
        baseIndex
      ].filter((cellId) => this.cells[cellId].resources);
      this.sortedCrystalCellIds[baseIndex] = this.sortedCrystalCellIds[
        baseIndex
      ].filter((cellId) => this.cells[cellId].resources);
      this.sortedEggCellIds[baseIndex] = this.sortedEggCellIds[
        baseIndex
      ].filter((cellId) => this.cells[cellId].resources);
    }
  }

  useAnts(): void {
    for (let baseIndex = 0; baseIndex < this.numberOfBases; baseIndex++) {
      const myBaseCellId = myBases[baseIndex];

      let myAntsLeft = this.myTotalAnts - 1;
      const sortedResourceCellIds = [...this.sortedResourceCellIds[baseIndex]];
      const sortedEggCellIds = this.sortedEggCellIds[baseIndex];
      // const sortedCrystalCellIds = this.sortedCrystalCellIds[baseIndex];

      const targetEgg = sortedEggCellIds[0];
      const distToTargetEgg = this.distances[myBaseCellId][targetEgg];
      if (
        this.eggCells.length &&
        distToTargetEgg <= myAntsLeft / this.numberOfBases
      ) {
        this.createAntLine(myBaseCellId, targetEgg, 1);
        myAntsLeft -= distToTargetEgg - 1;
      }

      let targetRes = sortedResourceCellIds[0];
      let distToTargetRes = this.distances[myBaseCellId][targetRes];
      while (distToTargetRes <= myAntsLeft / this.numberOfBases) {
        this.createAntLine(myBaseCellId, targetRes, 1);
        myAntsLeft -= distToTargetRes - 1;
        sortedResourceCellIds.splice(0, 1);
        targetRes = sortedResourceCellIds[0];
        distToTargetRes = this.distances[myBaseCellId][targetRes];
      }
    }
  }

  addActions(): void {
    this.useAnts();
  }

  displayNextActions(): void {
    console.log(this.actions.length > 0 ? this.actions.join(";") : "WAIT");
  }
}

const cells: Cell[] = [];
const numberOfCells: number = parseInt(readline());
for (let i = 0; i < numberOfCells; i++) {
  const [type, initialResources, ...allNeighbors] = readline()
    .split(" ")
    .map(Number);

  cells.push(
    new Cell({
      id: i,
      type,
      resources: initialResources,
      neighbors: allNeighbors.filter((id) => id > -1),
    })
  );
}

const numberOfBases: number = parseInt(readline());
const myBases: number[] = readline().split(" ").map(Number);
const oppBases: number[] = readline().split(" ").map(Number);

const game = new Game({ cells, numberOfBases, myBases, oppBases });

// game loop
while (true) {
  for (let i = 0; i < numberOfCells; i++) {
    const [resources, myAnts, oppAnts] = readline().split(" ").map(Number);
    game.cells[i].updateCell({ resources, myAnts, oppAnts });
  }
  game.newTurn();
  game.addActions();
  game.displayNextActions();

  // WAIT | LINE <sourceIdx> <targetIdx> <strength> | BEACON <cellIdx> <strength> | MESSAGE <text>
  // To debug: console.error('Debug messages...');
}
