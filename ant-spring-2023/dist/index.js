"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __commonJS = (cb, mod) => function __require() {
  return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
};
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// node_modules/ts-heapq/dist/heapq.js
var require_heapq = __commonJS({
  "node_modules/ts-heapq/dist/heapq.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var Heapq3 = function() {
      function Heapq4(heap, comparator) {
        if (heap === void 0) {
          heap = [];
        }
        if (comparator === void 0) {
          comparator = function(a, b) {
            return a < b;
          };
        }
        this.heap = heap;
        this.comparator = comparator;
        this.heapify();
      }
      Heapq4.prototype.push = function(item) {
        this.heap.push(item);
        this.siftdown(0, this.heap.length - 1);
      };
      Heapq4.prototype.pop = function() {
        var last = this.heap.pop();
        if (!last) {
          throw new Error("Heap is empty");
        }
        if (!this.heap.length) {
          return last;
        }
        var returnItem = this.heap[0];
        this.heap[0] = last;
        this.siftup(0);
        return returnItem;
      };
      Heapq4.prototype.replace = function(item) {
        var returnItem = this.heap[0];
        this.heap[0] = item;
        this.siftup(0);
        return item;
      };
      Heapq4.prototype.pushPop = function(item) {
        var _a;
        if (this.heap.length && this.comparator(this.heap[0], item)) {
          _a = [this.heap[0], item], item = _a[0], this.heap[0] = _a[1];
          this.siftup(0);
        }
        return item;
      };
      Heapq4.prototype.top = function() {
        return this.heap[0];
      };
      Heapq4.prototype.length = function() {
        return this.heap.length;
      };
      Heapq4.prototype.heapify = function() {
        var n = this.heap.length;
        for (var i = n / 2; i >= 0; i--) {
          this.siftup(i);
        }
      };
      Heapq4.prototype.siftdown = function(startPos, pos) {
        var newItem = this.heap[pos];
        if (!newItem) {
          return;
        }
        while (pos > startPos) {
          var parentPos = pos - 1 >> 1;
          var parent_1 = this.heap[parentPos];
          if (this.comparator(newItem, parent_1)) {
            this.heap[pos] = parent_1;
            pos = parentPos;
            continue;
          }
          break;
        }
        this.heap[pos] = newItem;
      };
      Heapq4.prototype.siftup = function(pos) {
        var endPos = this.heap.length;
        var startPos = pos;
        var newItem = this.heap[pos];
        if (!newItem) {
          return;
        }
        var childPos = 2 * pos + 1;
        while (childPos < endPos) {
          var rightPos = childPos + 1;
          if (rightPos < endPos && !this.comparator(this.heap[childPos], this.heap[rightPos])) {
            childPos = rightPos;
          }
          this.heap[pos] = this.heap[childPos];
          pos = childPos;
          childPos = 2 * pos + 1;
        }
        this.heap[pos] = newItem;
        this.siftdown(startPos, pos);
      };
      return Heapq4;
    }();
    exports.Heapq = Heapq3;
  }
});

// node_modules/ts-heapq/dist/utils.js
var require_utils = __commonJS({
  "node_modules/ts-heapq/dist/utils.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var heapq_1 = require_heapq();
    function merge(comparator) {
      var iterables = [];
      for (var _i = 1; _i < arguments.length; _i++) {
        iterables[_i - 1] = arguments[_i];
      }
      var list = [];
      for (var _a = 0, iterables_1 = iterables; _a < iterables_1.length; _a++) {
        var iter = iterables_1[_a];
        list.push.apply(list, iter);
      }
      return new heapq_1.Heapq(list, comparator ? comparator : function(a, b) {
        return a < b;
      });
    }
    exports.merge = merge;
  }
});

// node_modules/ts-heapq/dist/index.js
var require_dist = __commonJS({
  "node_modules/ts-heapq/dist/index.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var heapq_1 = require_heapq();
    exports.Heapq = heapq_1.Heapq;
    var utils = require_utils();
    exports.utils = utils;
  }
});

// src/main.ts
var main_exports = {};
__export(main_exports, {
  HEIGHT: () => HEIGHT,
  WIDTH: () => WIDTH
});
module.exports = __toCommonJS(main_exports);

// src/constants.ts
var ME = 1;
var OPP = 0;
var NEUTRAL = -1;
var COST = 10;
var RECYCLER_THRESHOLD = 18;

// src/utils.ts
var import_ts_heapq = __toESM(require_dist());
var dijkstraDistances = (matrix, startTile) => {
  const distances = new Array(matrix.length).fill(Infinity).map(() => new Array(matrix[0].length).fill(Infinity));
  const visited = /* @__PURE__ */ new Set([startTile]);
  let stack = new import_ts_heapq.Heapq([], (x, y) => x.dist < y.dist);
  stack.push({ dist: 0, tile: startTile });
  while (stack.length() > 0) {
    const { dist, tile } = stack.pop();
    distances[tile.y][tile.x] = dist;
    tile.neighbors.forEach((neighbor) => {
      if (!visited.has(neighbor)) {
        stack.push({ dist: dist + 1, tile: neighbor });
        visited.add(neighbor);
      }
    });
  }
  return distances;
};
var dijkstraTarget = (startTiles, endTiles) => {
  const visited = new Set(startTiles);
  let stack = new import_ts_heapq.Heapq([], (x, y) => x.dist < y.dist);
  startTiles.forEach((startTile) => stack.push({ dist: 0, tile: startTile }));
  while (stack.length() > 0) {
    const { dist, tile } = stack.pop();
    const neighbors = tile.neighbors.filter(
      (tile2) => !tile2.recycler && (!tile2.inRangeOfRecycler || tile2.scrapAmount > 1)
    );
    for (let i = 0; i < neighbors.length; i++) {
      const newNode = {
        dist: dist + 1,
        tile: neighbors[i]
      };
      if (endTiles.includes(neighbors[i])) {
        return newNode;
      } else if (!visited.has(neighbors[i])) {
        stack.push(newNode);
        visited.add(neighbors[i]);
      }
    }
  }
  return { dist: Infinity, tile: endTiles[0] };
};

// src/tile.ts
var Tile = class {
  constructor(x, y, game2) {
    this.scrapAmount = 0;
    this.owner = -1;
    this.units = 0;
    this.recycler = false;
    this.canBuild = false;
    this.canSpawn = false;
    this.inRangeOfRecycler = false;
    this.distToOpp = Infinity;
    this.distToNeutral = Infinity;
    this.neighbors = [];
    this.neighborsWithRecycler = [];
    this.recyclingScore = 0;
    this.island = null;
    this.hasMoved = 0;
    this.djikstraMap = [];
    this.potentiel = null;
    this.x = x;
    this.y = y;
  }
  updateTile({
    scrapAmount,
    owner,
    units,
    recycler,
    canBuild,
    canSpawn,
    inRangeOfRecycler
  }) {
    this.scrapAmount = scrapAmount;
    this.owner = owner;
    this.units = units;
    this.recycler = recycler === 1;
    this.canBuild = canBuild === 1;
    this.canSpawn = canSpawn === 1;
    this.inRangeOfRecycler = inRangeOfRecycler === 1;
    this.island = null;
    this.hasMoved = 0;
    this.potentiel = null;
  }
  get canMove() {
    return !this.recycler && this.scrapAmount > 0;
  }
  updateNeighbors(matrix) {
    this.neighbors = [];
    this.neighborsWithRecycler = [];
    const vectors = [
      [-1, 0],
      [1, 0],
      [0, -1],
      [0, 1]
    ];
    vectors.forEach(([dx, dy]) => {
      const y1 = this.y + dy;
      const x1 = this.x + dx;
      if (0 <= x1 && x1 < WIDTH && 0 <= y1 && y1 < HEIGHT) {
        const adjTile = matrix[y1][x1];
        if (adjTile.scrapAmount > 0 && !adjTile.inRangeOfRecycler || adjTile.scrapAmount > 1) {
          this.neighborsWithRecycler.push(adjTile);
          if (!adjTile.recycler) {
            this.neighbors.push(adjTile);
          }
        }
      }
    });
  }
  distanceToTile(tile, matrix) {
    if (!this.djikstraMap.length) {
      this.djikstraMap = dijkstraDistances(matrix, this);
    }
    return this.djikstraMap[tile.y][tile.x];
  }
  getPotentiel(matrix, notMyTiles) {
    if (this.potentiel)
      return this.potentiel;
    this.potentiel = 0;
    for (let i = 0; i < notMyTiles.length; i++) {
      const tile = notMyTiles[i];
      let distance = Math.max(0.5, this.distanceToTile(tile, matrix)) ** 2;
      if (distance <= 5) {
        if (tile.owner === ME) {
          if (tile.units)
            this.potentiel -= 4 / distance;
          else
            this.potentiel -= 1 / distance;
        } else if (tile.owner === NEUTRAL) {
          this.potentiel += 1 / distance;
        } else if (tile.owner === OPP) {
          if (tile.units)
            this.potentiel += 4 / distance;
          else
            this.potentiel += 3 / distance;
        }
      }
    }
    return this.potentiel;
  }
};

// src/islands.ts
var _Island = class {
  constructor() {
    this.blocks = [];
  }
  get owners() {
    let owners = [];
    const containsAllyBlock = this.blocks.findIndex((block) => block.owner === ME && block.canSpawn) >= 0;
    const containsOpponentBlock = this.blocks.findIndex(
      (block) => block.owner === OPP && !block.recycler
    ) >= 0;
    const containsNeutral = this.blocks.findIndex((block) => block.owner === NEUTRAL) >= 0;
    if (containsAllyBlock)
      owners.push(ME);
    if (containsOpponentBlock)
      owners.push(OPP);
    if (containsNeutral)
      owners.push(NEUTRAL);
    return owners;
  }
  static createIsland(startTile) {
    const island = new _Island();
    const stack = [startTile];
    while (stack.length) {
      const block = stack.pop();
      island.blocks.push(block);
      block.island = island;
      const neighbors = block.neighbors.filter((neighbor) => !neighbor.island);
      for (let i = 0; i < neighbors.length; i++) {
        stack.push(neighbors[i]);
      }
    }
    return island;
  }
};
var Island = _Island;
Island.findIslands = (allTiles) => {
  let blockWithoutIsland = allTiles.find(
    (tile) => !tile.island && tile.canMove
  );
  const islands = [];
  while (blockWithoutIsland) {
    const island = _Island.createIsland(blockWithoutIsland);
    islands.push(island);
    blockWithoutIsland = allTiles.find(
      (tile) => !tile.island && tile.canMove
    );
  }
  return islands;
};

// src/robotMove.ts
var moveRobots = (game2, myRobots) => {
  moveRobotsNormal(game2, myRobots, game2.notMyTiles, game2.matrix);
};
var moveRobotsNormal = (game2, myRobots, notMyTiles, matrix) => {
  myRobots.filter((robot) => robot.units > robot.hasMoved).forEach((robotTile) => {
    let availableRobots = robotTile.units - robotTile.hasMoved;
    if (availableRobots && robotTile.neighbors.some(
      (neighbor) => neighbor.owner == OPP && neighbor.units
    )) {
      availableRobots--;
    }
    let bestPlaces = robotTile.neighbors.sort(
      (a, b) => b.getPotentiel(matrix, notMyTiles) - a.getPotentiel(matrix, notMyTiles)
    );
    if (bestPlaces.length && bestPlaces[0].getPotentiel(matrix, notMyTiles) <= 0) {
      bestPlaces = [dijkstraTarget([robotTile], notMyTiles).tile];
    }
    let index = 0;
    while (availableRobots > 0 && bestPlaces.length) {
      game2.move(1, robotTile, bestPlaces[index]);
      availableRobots--;
      index = (index + 1) % bestPlaces.length;
    }
  });
};

// src/robotSpawn.ts
var spawnRobots = (game2, myTiles) => {
  game2.islands.filter((island) => {
    if (island.owners.includes(ME) && island.owners.length > 1 && getNbUnitsOnIsland(island, ME) === 0 && game2.myMatter >= COST) {
      game2.spawn(1, island.blocks[0]);
    }
  });
  const placesToSpawn = findPlacesToSpawn(
    myTiles,
    game2.notMyTiles,
    game2.matrix
  );
  let index = 0;
  while (game2.myMatter >= COST && placesToSpawn[index]) {
    game2.spawn(1, placesToSpawn[index]);
    index = (index + 1) % placesToSpawn.length;
  }
};
var findPlacesToSpawn = (myTiles, notMyTiles, matrix) => {
  const interestingPlaces = myTiles.filter(
    (tile) => {
      var _a, _b;
      return tile.canSpawn && !(((_a = tile.island) == null ? void 0 : _a.owners.includes(ME)) && ((_b = tile.island) == null ? void 0 : _b.owners.length) === 1) && (tile.scrapAmount > 1 || !tile.inRangeOfRecycler) && tile.neighbors.find((a) => a.owner !== ME);
    }
  );
  return interestingPlaces.sort(
    (a, b) => b.getPotentiel(matrix, notMyTiles) - a.getPotentiel(matrix, notMyTiles)
  );
};
var getNbUnitsOnIsland = (island, owner) => {
  return island.blocks.reduce((acc, block) => {
    if (block.owner === owner) {
      return acc + block.units;
    }
    return acc;
  }, 0);
};

// src/recyclerBuild.ts
var buildRecyler = (game2, myTiles) => {
  const placesToBuildDefensively = findPlacesToBuildDefensively(myTiles);
  let index = 0;
  while (game2.myMatter >= COST && index < placesToBuildDefensively.length) {
    game2.build(placesToBuildDefensively[index]);
    index++;
    game2.canBuildThisTurn = false;
  }
  const placesToBuild = findPlacesToBuildRecyclerForResource(myTiles);
  if (game2.myMatter >= COST && game2.myMatter <= 100 && placesToBuild.length) {
    game2.build(placesToBuild[0]);
  }
};
var findPlacesToBuildRecyclerForResource = (myTiles) => {
  const selectedTiles = myTiles.filter((tile) => {
    var _a;
    return tile.canBuild && ((_a = tile.island) == null ? void 0 : _a.owners.includes(OPP));
  });
  selectedTiles.forEach((tile) => {
    tile.recyclingScore = getRecyclerScore(tile);
  });
  const interestingTiles = selectedTiles.filter(
    (tile) => tile.recyclingScore >= RECYCLER_THRESHOLD
  );
  return interestingTiles.sort((a, b) => b.recyclingScore - a.recyclingScore);
};
var findPlacesToBuildDefensively = (myTiles) => {
  const myDangerousTiles = myTiles.filter(
    (tile) => tile.canBuild && tile.neighbors.some(
      (neighbor) => neighbor.owner === OPP && neighbor.units > 0
    )
  ).sort((a, b) => {
    return getNeighborOppUnits(b) - getNeighborOppUnits(a);
  });
  return myDangerousTiles;
};
var getNeighborOppUnits = (tile) => {
  return tile.neighbors.reduce((acc, neighbor) => {
    if (neighbor.owner === OPP) {
      return acc + neighbor.units;
    }
    return acc;
  }, 0);
};
var getRecyclerGain = (tile) => {
  return [...tile.neighbors, tile].reduce((acc, neighbor) => {
    if (neighbor.owner == ME && neighbor.inRangeOfRecycler) {
      return acc;
    }
    return acc + Math.min(tile.scrapAmount, neighbor.scrapAmount);
  }, 0);
};
var destructedTiles = (tile) => {
  return tile.neighbors.reduce((acc, neighbor) => {
    if (neighbor.scrapAmount <= tile.scrapAmount) {
      return acc + 1;
    }
    return acc;
  }, 1);
};
var getRecyclerScore = (tile) => {
  return getRecyclerGain(tile) / destructedTiles(tile);
};

// src/detectBorders.ts
var import_ts_heapq2 = __toESM(require_dist());
var detectBorders = (myBase, oppBase, matrix) => {
  const visited = /* @__PURE__ */ new Set([myBase]);
  let stack = new import_ts_heapq2.Heapq([], (x, y) => x.dist < y.dist);
  let dist = 0;
  let borders = [];
  stack.push({ dist, tile: myBase });
  while (stack.length()) {
    const { dist: dist2, tile } = stack.pop();
    const neighbors = tile.neighbors.filter(
      (tile2) => tile2.scrapAmount && !visited.has(tile2)
    );
    if (neighbors.some((neighbor) => {
      const distToOpp = oppBase.distanceToTile(neighbor, matrix);
      return distToOpp < dist2 + 1;
    })) {
      borders.push(tile);
    }
    neighbors.filter((neighbor) => {
      const distToOpp = oppBase.distanceToTile(neighbor, matrix);
      return distToOpp >= dist2 + 1;
    }).forEach((neighbor) => {
      stack.push({
        dist: dist2 + 1,
        tile: neighbor
      });
      visited.add(neighbor);
    });
  }
  return borders;
};

// src/game.ts
var Game = class {
  constructor(width, height) {
    this.turn = 0;
    this.myMatter = 0;
    this.oppMatter = 0;
    this.canBuildThisTurn = true;
    this.actions = [];
    this.matrix = [];
    this.allTiles = [];
    this.myTiles = [];
    this.notMyTiles = [];
    this.oppTiles = [];
    this.myRobots = [];
    this.startBaseOnLeft = false;
    this.islands = [];
    this.borders = [];
    this.gameIsOver = () => {
      const islandsToFightFor = this.islands.filter(
        (island) => island.owners.includes(ME) && island.owners.length !== 1
      );
      return islandsToFightFor.length === 0;
    };
    for (let y = 0; y < height; y++) {
      const row = [];
      for (let x = 0; x < width; x++) {
        row.push(new Tile(x, y, this));
      }
      this.matrix.push(row);
    }
    this.myBase = this.matrix[0][0];
    this.oppBase = this.matrix[0][0];
  }
  build(tile) {
    this.actions.push(`BUILD ${tile.x} ${tile.y}`);
    this.myMatter -= COST;
    tile.recycler == true;
  }
  spawn(amount, tile) {
    this.actions.push(`SPAWN ${amount} ${tile.x} ${tile.y}`);
    this.myMatter -= COST;
  }
  move(amount, origin, destination) {
    this.actions.push(
      `MOVE ${amount} ${origin.x} ${origin.y} ${destination.x} ${destination.y}`
    );
  }
  newTurn() {
    this.allTiles = this.matrix.flat().filter(
      (tile) => tile.scrapAmount > 0 && (tile.scrapAmount > 1 || !tile.inRangeOfRecycler) && !tile.recycler
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
  addActions() {
    this.actions = [];
    if (!this.gameIsOver()) {
      buildRecyler(this, this.myTiles);
      moveRobots(this, this.myRobots);
      spawnRobots(this, this.myTiles);
    }
  }
  displayNextActions() {
    console.log(this.actions.length > 0 ? this.actions.join(";") : "WAIT");
  }
};

// src/main.ts
var inputs = readline().split(" ");
var WIDTH = parseInt(inputs[0]);
var HEIGHT = parseInt(inputs[1]);
var game = new Game(WIDTH, HEIGHT);
while (true) {
  const [myMatter, oppMatter] = readline().split(" ").map(Number);
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
        inRangeOfRecycler
      ] = readline().split(" ").map(Number);
      game.matrix[y][x].updateTile({
        scrapAmount,
        owner,
        units,
        recycler,
        canBuild,
        canSpawn,
        inRangeOfRecycler
      });
    }
  }
  game.newTurn();
  game.addActions();
  game.displayNextActions();
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  HEIGHT,
  WIDTH
});
