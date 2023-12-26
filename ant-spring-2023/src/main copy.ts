// // const dijkstraDistances = (
// //   cells: Cell[],
// //   startCellId: number
// // ): Record<number, number> => {
// //   const distances: Record<number, number> = {};
// //   const visited = new Set([startCellId]);
// //   let stack = [{ dist: 0, cellId: startCellId }];
// //   while (stack.length > 0) {
// //     stack.sort((a, b) => a.dist - b.dist);
// //     const { dist, cellId } = stack.splice(0, 1)[0];
// //     const cell = cells[cellId];
// //     distances[cellId] = dist;
// //     cell.neighbors.forEach((neighborId: number) => {
// //       if (!visited.has(neighborId)) {
// //         stack.push({ dist: dist + 1, cellId: neighborId });
// //         visited.add(neighborId);
// //       }
// //     });
// //   }
// //   return distances;
// // };

// const computeDistancesFloydWarshall = (cells: Cell[]) => {
//   const cellIds = cells.map((cell) => cell.id);
//   const dist: number[][] = new Array(cells.length)
//     .fill(0)
//     .map(() => new Array(cells.length).fill(Infinity));
//   cells.forEach((cell) => {
//     dist[cell.id][cell.id] = 0;
//     cell.neighbors.forEach((neighborId) => {
//       dist[cell.id][neighborId] = 1;
//     });
//   });
//   cellIds.forEach((k) => {
//     cellIds.forEach((i) => {
//       cellIds.forEach((j) => {
//         if (dist[i][k] + dist[k][j] < dist[i][j])
//           dist[i][j] = dist[i][k] + dist[k][j];
//       });
//     });
//   });
//   return dist;
// };

// const getPathsToReachOnePoint = (
//   cells: Cell[],
//   startCellId: number,
//   endCellIds: number[]
// ): number[][] => {
//   const finalPaths: number[][] = [];
//   let optimalDistance = Infinity;
//   let stack = [{ dist: 0, cellId: startCellId, path: [startCellId] }];
//   while (stack.length > 0) {
//     stack.sort((a, b) => a.dist - b.dist);
//     const { dist, cellId, path } = stack.splice(0, 1)[0];
//     if (endCellIds.includes(cellId)) {
//       finalPaths.push(path);
//       optimalDistance = dist;
//     } else if (dist > optimalDistance) {
//       break;
//     } else {
//       const cell = cells[cellId];
//       cell.neighbors.forEach((neighborId: number) => {
//         if (!path.includes(neighborId)) {
//           stack.push({
//             dist: dist + 1,
//             cellId: neighborId,
//             path: [...path, neighborId],
//           });
//         }
//       });
//     }
//   }
//   return finalPaths;
// };

// const getCellsResourcesSum = (path: number[], cells: Cell[]) => {
//   return path.reduce((acc, cellId) => acc + cells[cellId].resources, 0);
// };

// const getBestPath = (paths: number[][], cells: Cell[]) => {
//   paths.sort(
//     (pathA, pathB) =>
//       getCellsResourcesSum(pathB, cells) - getCellsResourcesSum(pathA, cells)
//   );
//   return paths[0];
// };

// // const sortIdsByShortestDistance = (
// //   filteredCells: Cell[],
// //   allCells: Cell[],
// //   baseCell: Cell
// // ): number[] => {
// //   return [...filteredCells]
// //     .sort((a: Cell, b: Cell) => {
// //       return (
// //         baseCell.distanceToCell(a.id, allCells) -
// //         baseCell.distanceToCell(b.id, allCells)
// //       );
// //     })
// //     .map((cell) => cell.id);
// // };

// // const sortByShortestDistance = (
// //   filteredCells: Cell[],
// //   allCells: Cell[],
// //   baseCell: Cell
// // ): Cell[] => {
// //   return [...filteredCells].sort((a: Cell, b: Cell) => {
// //     return (
// //       baseCell.distanceToCell(a.id, allCells) -
// //       baseCell.distanceToCell(b.id, allCells)
// //     );
// //   });
// // };

// const sortByShortestDistanceNew = (
//   distances: number[][],
//   filteredCells: Cell[],
//   baseCell: Cell
// ): Cell[] => {
//   return [...filteredCells].sort((a: Cell, b: Cell) => {
//     return distances[a.id][baseCell.id] - distances[b.id][baseCell.id];
//   });
// };

// enum CellType {
//   EMPTY = 0,
//   EGG = 1,
//   CRYSTAL = 2,
// }

// interface CellProps {
//   id: number;
//   type: CellType;
//   resources: number;
//   neighbors: number[];
// }

// class Cell {
//   id: number;
//   type: CellType;
//   resources: number;
//   neighbors: number[];
//   myAnts = 0;
//   oppAnts = 0;
//   djikstraMap: Record<number, number> = {};

//   constructor({ id, type, resources, neighbors }: CellProps) {
//     this.id = id;
//     this.type = type;
//     this.resources = resources;
//     this.neighbors = neighbors;
//   }
//   updateCell({
//     resources,
//     myAnts,
//     oppAnts,
//   }: {
//     resources: number;
//     myAnts: number;
//     oppAnts: number;
//   }) {
//     this.resources = resources;
//     this.myAnts = myAnts;
//     this.oppAnts = oppAnts;
//   }

//   // distanceToCell(destiId: number, cells: Cell[]) {
//   //   if (!Object.keys(this.djikstraMap).length) {
//   //     this.djikstraMap = dijkstraDistances(cells, this.id);
//   //   }
//   //   return this.djikstraMap[destiId];
//   // }
// }

// class Game {
//   cells: Cell[];
//   eggCells: Cell[];
//   crystalCells: Cell[];
//   numberOfBases: number;
//   myBases: number[];
//   oppBases: number[];
//   actions: string[] = [];
//   totalCrystals = 0;
//   totalEggs = 0;
//   myTotalAnts = 0;
//   oppTotalAnts = 0;
//   cellIdsWithBeacon: number[] = [];
//   distances: number[][];

//   constructor({
//     cells,
//     numberOfBases,
//     myBases,
//     oppBases,
//   }: {
//     cells: Cell[];
//     numberOfBases: number;
//     myBases: number[];
//     oppBases: number[];
//   }) {
//     this.cells = cells;
//     this.eggCells = cells.filter((cell) => cell.type === CellType.EGG);
//     this.crystalCells = cells.filter((cell) => cell.type === CellType.CRYSTAL);
//     this.numberOfBases = numberOfBases;
//     this.myBases = myBases;
//     this.oppBases = oppBases;
//     this.distances = computeDistancesFloydWarshall(this.cells);
//   }

//   createAntLine(index1: number, index2: number, strength: number): void {
//     this.actions.push(`LINE ${index1} ${index2} ${strength}`);
//   }

//   createBeacon(index: number, strength: number): void {
//     this.actions.push(`BEACON ${index} ${strength}`);
//   }

//   createBeaconsFromPath(cellIds: number[], strength: number): void {
//     cellIds.forEach((cellId) => this.createBeacon(cellId, strength));
//   }

//   message(text: string, value: number): void {
//     this.actions.push(`MESSAGE ${text}=${value}`);
//   }

//   newTurn() {
//     this.actions = [];
//     this.cellIdsWithBeacon = [];
//     this.totalCrystals = this.cells
//       .filter((cell) => cell.type === CellType.CRYSTAL)
//       .reduce((acc, cell) => acc + cell.resources, 0);
//     this.totalEggs = this.cells
//       .filter((cell) => cell.type === CellType.EGG)
//       .reduce((acc, cell) => acc + cell.resources, 0);
//     this.myTotalAnts = this.cells.reduce((acc, cell) => acc + cell.myAnts, 0);
//     this.oppTotalAnts = this.cells.reduce((acc, cell) => acc + cell.oppAnts, 0);
//     this.eggCells = this.eggCells.filter((cell) => cell.resources > 0);
//     this.crystalCells = this.crystalCells.filter((cell) => cell.resources > 0);
//   }

//   useAnts(): void {
//     const myBaseCell = this.cells[myBases[0]];
//     let myAntsLeft = this.myTotalAnts;
//     while (myAntsLeft > 0) {
//       const sortedEggCells = sortByShortestDistanceNew(
//         this.distances,
//         this.eggCells,
//         myBaseCell
//       );
//       const sortedCrystalCells = sortByShortestDistanceNew(
//         this.distances,
//         this.crystalCells,
//         myBaseCell
//       );

//       const eggCellDist = this.distances[myBaseCell.id][sortedEggCells[0].id];
//       const crystalCellDist =
//         this.distances[myBaseCell.id][sortedCrystalCells[0].id];

//       if (myAntsLeft >= eggCellDist) {
//         const paths = getPathsToReachOnePoint(
//           this.cells,
//           sortedEggCells[0].id,
//           [myBaseCell.id]
//         );
//         const bestPath = getBestPath(paths, this.cells);
//         this.cellIdsWithBeacon = this.cellIdsWithBeacon.concat(bestPath);
//         myAntsLeft -= bestPath.length;
//         continue;
//       }
//       if (myAntsLeft >= crystalCellDist) {
//         const paths = getPathsToReachOnePoint(
//           this.cells,
//           sortedCrystalCells[0].id,
//           [myBaseCell.id]
//         );
//         const bestPath = getBestPath(paths, this.cells);
//         this.cellIdsWithBeacon = this.cellIdsWithBeacon.concat(bestPath);
//         myAntsLeft -= bestPath.length;
//         continue;
//       }
//     }
//     this.createBeaconsFromPath(this.cellIdsWithBeacon, 1);
//   }

//   addActions(): void {
//     this.useAnts();
//     // const myBaseCell = this.cells[myBases[0]];
//     // const sortedEggCellIds = sortIdsByShortestDistance(
//     //   this.eggCells,
//     //   this.cells,
//     //   myBaseCell
//     // );
//     // const sortedCrystalCellIds = sortIdsByShortestDistance(
//     //   this.crystalCells,
//     //   this.cells,
//     //   myBaseCell
//     // );

//     // const paths = getPathsToReachOnePoint(this.cells, sortedEggCellIds[0], [
//     //   myBaseCell.id,
//     // ]);
//     // const bestPath = getBestPath(paths, this.cells);
//     // this.cellIdsWithBeacon = this.cellIdsWithBeacon.concat(bestPath);
//     // this.createBeaconsFromPath(this.cellIdsWithBeacon, 1);

//     // if (5 * this.myTotalAnts < this.totalCrystals && this.totalEggs > 0) {
//     //   const sortedEggCellIds = sortIdsByShortestDistance(
//     //     this.eggCells,
//     //     this.cells,
//     //     myBaseCell
//     //   );
//     //   sortedEggCellIds.forEach((cellId) => {
//     //     this.createAntLine(myBaseCell.id, cellId, 1);
//     //   });
//     // } else {
//     //   const sortedCrystalCellIds = sortIdsByShortestDistance(
//     //     this.crystalCells,
//     //     this.cells,
//     //     myBaseCell
//     //   );

//     //   sortedCrystalCellIds.forEach((cellId) => {
//     //     this.createAntLine(myBaseCell.id, cellId, 1);
//     //   });
//     // }
//     // this.message("totalCrystals", this.totalCrystals);
//   }

//   displayNextActions(): void {
//     console.log(this.actions.length > 0 ? this.actions.join(";") : "WAIT");
//   }
// }

// const cells: Cell[] = [];
// const numberOfCells: number = parseInt(readline());
// for (let i = 0; i < numberOfCells; i++) {
//   const [type, initialResources, ...allNeighbors] = readline()
//     .split(" ")
//     .map(Number);

//   cells.push(
//     new Cell({
//       id: i,
//       type,
//       resources: initialResources,
//       neighbors: allNeighbors.filter((id) => id > -1),
//     })
//   );
// }

// const numberOfBases: number = parseInt(readline());
// const myBases: number[] = readline().split(" ").map(Number);
// const oppBases: number[] = readline().split(" ").map(Number);

// const game = new Game({ cells, numberOfBases, myBases, oppBases });

// // game loop
// while (true) {
//   for (let i = 0; i < numberOfCells; i++) {
//     const [resources, myAnts, oppAnts] = readline().split(" ").map(Number);
//     game.cells[i].updateCell({ resources, myAnts, oppAnts });
//   }
//   game.newTurn();
//   game.addActions();
//   game.displayNextActions();

//   // WAIT | LINE <sourceIdx> <targetIdx> <strength> | BEACON <cellIdx> <strength> | MESSAGE <text>
//   // To debug: console.error('Debug messages...');
// }
