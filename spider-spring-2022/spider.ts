const MAX_X = 17630;
const MAX_Y = 9000;
const ENEMY_BASE = { x: MAX_X, y: MAX_Y };
const HERO_VISION = 2200;
const HERO_ATTACK = 800;
const WIND_RANGE = 1280;
const MANA_COST = 10;

const distance = (
  { x: xA, y: yA }: { x: number; y: number },
  { x: xB, y: yB }: { x: number; y: number }
): number => {
  return Math.sqrt(Math.pow(xA - xB, 2) + Math.pow(yA - yB, 2));
};

const isPointInsideField = ({ x, y }: { x: number; y: number }): boolean => {
  return x > 0 && x < MAX_X && y > 0 && y < MAX_Y;
};

const lineFrom2points = (
  { x: x1, y: y1 }: { x: number; y: number },
  { x: x2, y: y2 }: { x: number; y: number }
): { a: number; b: number; c: number } => {
  // line: ax +by + c = 0, it returns [a,b,c]
  if (x1 === x2) {
    return { a: 1, b: 0, c: -x1 };
  } else {
    return { a: y2 - y1, b: x1 - x2, c: x2 * y1 - x1 * y2 };
  }
};

const intersectionLineCircle = (
  { a, b, c }: { a: number; b: number; c: number },
  { x: xc, y: yc }: { x: number; y: number },
  r: number
): { x: number; y: number }[] => {
  // line : ax + by + c = 0
  if (b === 0) {
    const x0 = -c / a;
    const delta = r ** 2 - (c / a + xc) ** 2;
    if (delta < 0) {
      return [];
    } else if (delta === 0) {
      return [{ x: x0, y: yc }];
    } else {
      const y1 = yc + Math.sqrt(delta);
      const y2 = yc - Math.sqrt(delta);
      return [
        { x: x0, y: y1 },
        { x: x0, y: y2 },
      ];
    }
  } else {
    // now line : y = a1x + b1
    const a1 = -a / b;
    const b1 = -c / b;
    const A = 1 + a1 ** 2;
    const B = 2 * (a1 * (b1 - yc) - xc);
    const C = (b1 - yc) ** 2 + xc ** 2 - r ** 2;
    const delta = B ** 2 - 4 * A * C;
    if (delta < 0) {
      return [];
    } else {
      const x1 = (-B + Math.sqrt(delta)) / (2 * A);
      const x2 = (-B - Math.sqrt(delta)) / (2 * A);
      const y1 = a1 * x1 + b1;
      const y2 = a1 * x2 + b1;
      if (delta === 0) {
        return [{ x: x1, y: y1 }];
      } else {
        return [
          { x: x1, y: y1 },
          { x: x2, y: y2 },
        ];
      }
    }
  }
};

const intersectionTwoCircles = (
  { x: x1, y: y1 }: { x: number; y: number },
  r1: number,
  { x: x2, y: y2 }: { x: number; y: number },
  r2: number
): { x: number; y: number }[] => {
  // lineBetweenintersections : ax + by + c = 0
  const lineBetweenintersections = {
    a: x1 - x2,
    b: y1 - y2,
    c: (r1 ** 2 - r2 ** 2 - x1 ** 2 + x2 ** 2 - y1 ** 2 + y2 ** 2) / 2,
  };
  return intersectionLineCircle(lineBetweenintersections, { x: x1, y: y1 }, r1);
};

class Hero {
  nextAction = "";
  public destiIndex: number = 0;
  public hasBeenControlled: number = 0;

  constructor(
    public id: number,
    public x: number,
    public y: number,
    public shieldLife: number,
    public isControlled: number,
    public isBottomRightBase: boolean,
    public base: Base,
    public destinations: number[][] = [[]]
  ) {}

  update = (x: number, y: number, shieldLife: number, isControlled: number) => {
    this.x = x;
    this.y = y;
    this.shieldLife = shieldLife;
    this.isControlled = isControlled;
    this.hasBeenControlled = Math.max(0, this.hasBeenControlled - 1);
  };

  transformXY = (x: number, y: number): number[] => {
    if (this.isBottomRightBase) {
      x = MAX_X - x;
      y = MAX_Y - y;
    }
    return [x, y];
  };

  wait = () => {
    this.nextAction = "WAIT";
  };

  move = (x: number, y: number, info = "") => {
    const [X, Y] = this.transformXY(x, y);
    this.nextAction = `MOVE ${X} ${Y} ${info}`;
  };

  wind = (x: number, y: number) => {
    const [X, Y] = this.transformXY(x, y);
    this.nextAction = `SPELL WIND ${X} ${Y} wind`;
    this.base.mana -= MANA_COST;
  };

  shield = (entityId: number) => {
    this.nextAction = `SPELL SHIELD ${entityId} shield`;
    this.base.mana -= MANA_COST;
  };

  control = (entityId: number, x: number, y: number) => {
    const [X, Y] = this.transformXY(x, y);
    this.nextAction = `SPELL CONTROL ${entityId} ${X} ${Y} control`;
    this.base.mana -= MANA_COST;
  };

  patrol = () => {
    let [destiX, destiY] = this.destinations[this.destiIndex];
    if (this.x == destiX && this.y == destiY) {
      this.destiIndex = (this.destiIndex + 1) % this.destinations.length;
      [destiX, destiY] = this.destinations[this.destiIndex];
    }
    this.move(destiX, destiY);
  };
}

class Monster {
  MY_BASE = 1;
  ENEMY_BASE = 2;
  public isNeutralized = false;
  constructor(
    public id: number,
    public x: number,
    public y: number,
    public shieldLife: number,
    public isControlled: number,
    public health: number,
    public vx: number,
    public vy: number,
    public nearBase: number,
    public threatFor: number
  ) {}
  nextPosition = (): { x: number; y: number } => {
    return { x: this.x + this.vx, y: this.y + this.vy };
  };
  isDangerousForMyBase = (): boolean => {
    return this.threatFor === this.MY_BASE;
  };
  isDangerousForEnemyBase = (): boolean => {
    return this.threatFor === this.ENEMY_BASE;
  };
  isNeutral = (): boolean => {
    return (
      this.threatFor !== this.MY_BASE && this.threatFor !== this.ENEMY_BASE
    );
  };

  timeToLive = (): number => {
    let time = 0;
    let x = this.x;
    let y = this.y;
    while (isPointInsideField({ x, y }) && this.health > 0) {
      x += this.vx;
      y += this.vy;
      time += 1;
    }
    return time;
  };

  update = (
    x: number,
    y: number,
    shieldLife: number,
    isControlled: number,
    health: number,
    vx: number,
    vy: number,
    nearBase: number,
    threatFor: number
  ) => {
    this.x = x;
    this.y = y;
    this.shieldLife = shieldLife;
    this.isControlled = isControlled;
    this.health = health;
    this.vx = vx;
    this.vy = vy;
    this.nearBase = nearBase;
    this.threatFor = threatFor;
    this.isNeutralized = false;
  };
}

class Base {
  constructor(
    public x: number,
    public y: number,
    public health: number,
    public mana: number
  ) {}
  setHealth = (value: number) => {
    this.health = value;
  };
  setMana = (value: number) => {
    this.mana = value;
  };
  canCast = (): boolean => {
    return this.mana >= 10;
  };
}

class GameSpider {
  TYPE_MONSTER = 0;
  TYPE_MY_HERO = 1;
  TYPE_ENEMY_HERO = 2;

  myBase: Base;
  enemyBase: Base;
  public turn: number = 0;
  public monsters: Monster[] = [];
  public myHeroes: Hero[] = [];
  public enemyHeroes: Hero[] = [];
  public monstersToProtect: number[] = []; // ids of monsters
  public oldMonstersToProtect: number[] = []; // ids of monsters

  isBottomRightBase: boolean;
  public patrolPaths: number[][][];

  constructor(
    baseX: number,
    baseY: number,
    public heroesPerPlayer: number = 3,
    public mana: number = 0
  ) {
    this.isBottomRightBase = baseX !== 0 && baseY !== 0;
    this.myBase = new Base(0, 0, heroesPerPlayer, mana);
    this.enemyBase = new Base(MAX_X, MAX_Y, heroesPerPlayer, mana);
    this.patrolPaths = [
      [
        [12630, 4000],
        [17430, 4000],
        [12630, 8800],
      ],
      [
        [5000, 1500],
        [3600, 3400],
      ],
      [
        [3400, 3600],
        [1500, 5000],
      ],
    ];
  }

  newTurn = (
    health: number,
    mana: number,
    enemyHealth: number,
    enemyMana: number
  ) => {
    this.turn += 1;
    this.myBase.setHealth(health);
    this.myBase.setMana(mana);
    this.enemyBase.setHealth(enemyHealth);
    this.enemyBase.setMana(enemyMana);
    this.monsters = [];
    this.oldMonstersToProtect = this.monstersToProtect;
    this.monstersToProtect = [];
  };

  addEntity = (inputs: number[]) => {
    const id: number = inputs[0]; // Unique identifier
    const type: number = inputs[1]; // 0=monster, 1=your hero, 2=opponent hero
    const x: number = this.isBottomRightBase ? MAX_X - inputs[2] : inputs[2]; // Position of this entity
    const y: number = this.isBottomRightBase ? MAX_Y - inputs[3] : inputs[3]; // Position of this entity
    const shieldLife: number = inputs[4]; // Ignore for this league; Count down until shield spell fades
    const isControlled: number = inputs[5]; // Ignore for this league; Equals 1 when this entity is under a control spell
    const health: number = inputs[6]; // Remaining health of this monster
    const vx: number = this.isBottomRightBase ? -inputs[7] : inputs[7]; // Trajectory of this monster
    const vy: number = this.isBottomRightBase ? -inputs[8] : inputs[8]; // Trajectory of this monster
    const nearBase: number = inputs[9]; // 0=monster with no target yet, 1=monster targeting a base
    const threatFor: number = inputs[10]; // Given this monster's trajectory, is it a threat to 1=your base, 2=your opponent's base, 0=neither
    const newId = id % this.heroesPerPlayer;
    if (type == this.TYPE_MONSTER) {
      this.monsters.push(
        new Monster(
          id,
          x,
          y,
          shieldLife,
          isControlled,
          health,
          vx,
          vy,
          nearBase,
          threatFor
        )
      );
      if (this.oldMonstersToProtect.indexOf(id) > -1) {
        this.monstersToProtect.push(id);
      }
    } else if (type == this.TYPE_MY_HERO) {
      const hero = this.myHeroes.find((hero) => hero.id == id);
      if (!hero) {
        this.myHeroes.push(
          new Hero(
            id,
            x,
            y,
            shieldLife,
            isControlled,
            this.isBottomRightBase,
            this.myBase,
            this.patrolPaths[newId]
          )
        );
      } else {
        hero.update(x, y, shieldLife, isControlled);
      }
    } else if (type == this.TYPE_ENEMY_HERO) {
      const hero = this.enemyHeroes.find((hero) => hero.id == id);
      if (!hero) {
        this.enemyHeroes.push(
          new Hero(
            id,
            x,
            y,
            shieldLife,
            isControlled,
            this.isBottomRightBase,
            this.enemyBase
          )
        );
      } else {
        hero.update(x, y, shieldLife, isControlled);
      }
    }
  };

  chooseNextActions = (): void => {
    // HEROS 1 et 2 en défense
    this.actionHeroDefense(this.myHeroes[1]);
    this.actionHeroDefense(this.myHeroes[2]);

    // HERO 0 en attaque
    this.actionHeroAttack(this.myHeroes[0]);
  };

  actionHeroDefense = (hero: Hero): void => {
    const enemyHeroClose = this.enemyHeroes.filter(
      (enemy) => distance(enemy, this.myBase) < 5000
    );
    const monstersClose = this.monsters.filter(
      (monster) => distance(monster, this.myBase) < 8000
    );
    const monstersByDistance = monstersClose.sort(
      (a, b) => distance(a, this.myBase) - distance(b, this.myBase)
    );

    const dangerousMonstersTopOrBot = this.filterTopOrBottomMonsters(
      hero,
      monstersByDistance.filter(
        (monster) => monster.isDangerousForMyBase() && !monster.isNeutralized
      )
    );
    const monstersByDistanceTopOrBot = this.filterTopOrBottomMonsters(
      hero,
      monstersByDistance
    );

    const dangerousMonstersShielded = this.filterTopOrBottomMonsters(
      hero,
      monstersByDistance.filter(
        (monster) => monster.isDangerousForMyBase() && monster.shieldLife
      )
    );
    const hugeThreats = monstersByDistance.filter((monster) => {
      const monsterDist = distance(monster, this.myBase);
      const turnsBeforeHit = Math.trunc((monsterDist - 300) / 400);
      return turnsBeforeHit <= monster.health / 2 || monsterDist < 2000;
    });

    if (hero.isControlled) {
      hero.hasBeenControlled = 2;
    }
    if (hero.hasBeenControlled && this.myBase.canCast() && !hero.shieldLife) {
      return hero.shield(hero.id);
    }

    // hugeThreats = spiders that cannot be killed in time without spell
    if (this.myBase.canCast() && hugeThreats.length) {
      if (
        !hugeThreats[0].shieldLife &&
        distance(hugeThreats[0], hero) < WIND_RANGE
      ) {
        return hero.wind(2 * hero.x, 2 * hero.y);
      }
      const { x, y } = this.attackMonsterSmartly(hero, hugeThreats[0]);
      return hero.move(x, y, `ATK ${hugeThreats[0].id}`);
    }

    // shield ourself in defense
    if (
      enemyHeroClose.length &&
      this.myBase.canCast() &&
      !hero.shieldLife &&
      dangerousMonstersShielded.length
    ) {
      if (dangerousMonstersShielded.length) {
        return hero.shield(hero.id);
      }
    }

    const borderWindMonsters = monstersByDistanceTopOrBot.filter((monster) => {
      const distToMyBase = distance(monster, this.myBase);
      const distToHero = distance(monster, hero);
      return (
        distToMyBase > 2900 && distToMyBase < 5000 && distToHero < WIND_RANGE
      );
    });
    const borderControlMonsters = dangerousMonstersTopOrBot.filter(
      (monster) => {
        const futureDistToMyBase = distance(
          monster.nextPosition(),
          this.myBase
        );
        const distToHero = distance(monster, hero);
        return (
          futureDistToMyBase > 4601 &&
          futureDistToMyBase < 5000 &&
          distToHero < HERO_VISION
        );
      }
    );

    // WIND or CONTROL monsters in border
    if (this.turn > 100 && this.myBase.mana > 50)
      if (borderWindMonsters.length >= 2) {
        return hero.wind(2 * hero.x, 2 * hero.y);
      } else if (borderControlMonsters.length) {
        const target = borderControlMonsters[0];
        return hero.control(target.id, 2 * target.x, 2 * target.y);
      }

    // attack spiders heading to our base
    // OR attack spiders near our base
    if (dangerousMonstersTopOrBot.length) {
      const target = dangerousMonstersTopOrBot[0];
      const { x, y } = this.attackMonsterSmartly(hero, target);
      target.isNeutralized = true;
      return hero.move(x, y, `ATK ${target.id}`);
    }
    if (monstersByDistanceTopOrBot.length) {
      const target = monstersByDistanceTopOrBot[0];
      const { x, y } = this.attackMonsterSmartly(hero, target);
      return hero.move(x, y, `ATK ${target.id}`);
    }
    // if no spider around base, just patrol
    return hero.patrol();
  };

  actionHeroAttack = (hero: Hero): void => {
    const monstersInWindRangeForHero0 = this.monsters.filter(
      (monster) => distance(monster, hero) < WIND_RANGE
    );
    const monstersInRangeForHero0 = this.monsters.filter(
      (monster) =>
        distance(monster, hero) < HERO_VISION &&
        distance(monster, this.enemyBase) < 10000
    );

    if (this.turn < 50) {
      // FARM mana at beginning
      let prio = monstersInRangeForHero0.filter((monster) =>
        monster.isDangerousForEnemyBase()
      );
      if (!prio.length) {
        prio = monstersInRangeForHero0.filter((monster) =>
          monster.isDangerousForMyBase()
        );
      }
      if (!prio.length) {
        prio = monstersInRangeForHero0.filter((monster) => monster.isNeutral());
      }
      if (prio.length) {
        const { x, y } = this.attackMonsterSmartly(hero, prio[0]);
        return hero.move(x, y, "FARM");
      }
    }

    // PROTECT huge threats for enemy
    if (this.monstersToProtect.length) {
      const closeEnemyHeroesWind = this.enemyHeroes.filter(
        (enemyHero) =>
          distance(hero, enemyHero) < WIND_RANGE &&
          !enemyHero.isControlled &&
          !enemyHero.shieldLife
      );
      const closeEnemyHeroesControl = this.enemyHeroes.filter(
        (enemyHero) =>
          distance(hero, enemyHero) < HERO_VISION &&
          enemyHero.isControlled &&
          !enemyHero.shieldLife
      );
      if (this.myBase.mana > 30) {
        if (closeEnemyHeroesWind.length) {
          const enemyHero = closeEnemyHeroesWind[0];
          return hero.wind(MAX_X - 10 * enemyHero.x, MAX_Y - 10 * enemyHero.y);
        }
        if (closeEnemyHeroesControl.length) {
          const enemyHero = closeEnemyHeroesControl[0];
          return hero.control(
            enemyHero.id,
            MAX_X - 10 * enemyHero.x,
            MAX_Y - 10 * enemyHero.y
          );
        }
      }
      const coords = this.followMonster(
        this.monsters.find(
          (monster) => monster.id === this.monstersToProtect[0]
        ),
        hero
      );
      return hero.move(coords.x, coords.y);
    }

    // SHIELD high threat for enemy
    if (monstersInRangeForHero0.length) {
      const prio2 = monstersInRangeForHero0.filter((monster) =>
        monster.isDangerousForEnemyBase()
      );
      if (
        this.myBase.mana > 40 &&
        prio2.length &&
        distance(prio2[0], this.enemyBase) < 5100 &&
        !prio2[0].shieldLife &&
        prio2[0].health > 15
      ) {
        this.monstersToProtect.push(prio2[0].id);
        return hero.shield(prio2[0].id);
      }
    }

    // WIND plusieurs monstres proches de l'ennemi
    if (monstersInWindRangeForHero0.length) {
      const prio = monstersInWindRangeForHero0.filter(
        (monster) =>
          distance(monster, this.enemyBase) < 7200 && !monster.shieldLife
      );
      if (this.myBase.canCast() && prio.length >= 2) {
        return hero.wind(MAX_X, MAX_Y);
      }
    }

    if (monstersInRangeForHero0.length) {
      const prio0 = monstersInRangeForHero0.filter((monster) =>
        monster.isDangerousForMyBase()
      );
      const prio1 = monstersInRangeForHero0.filter((monster) =>
        monster.isNeutral()
      );

      if (this.myBase.mana > 100 && (prio0.length || prio1.length)) {
        // CONTROL du monstre proche
        let target: Monster;
        if (prio0.length && prio0[0].health > 16) {
          target = prio0[0];
        } else if (prio1.length && prio1[0].health > 16) {
          target = prio1[0];
        }
        if (target && !target.isControlled && !target.shieldLife) {
          if (distance(target, this.enemyBase) > 6000) {
            if (MAX_X - target.x > MAX_Y - target.y) {
              return hero.control(target.id, MAX_X - 4900, MAX_Y - 400);
            } else {
              return hero.control(target.id, MAX_X - 400, MAX_Y - 4900);
            }
          }
        }
      } else {
        // attaque des monstres proches
        if (prio0.length) {
          return hero.move(prio0[0].x, prio0[0].y, "ELSE");
        } else if (prio1.length) {
          return hero.move(prio1[0].x, prio1[0].y, "ELSE");
        }
      }
    }
    return hero.patrol();
  };

  joinMovingTarget = (
    hero: Hero,
    target: Monster
  ): { x: number; y: number; turnsBeforeReach: number } => {
    let turnsBeforeReach = 1;
    let newDist = distance(hero, target);
    let possibleHeroMove = HERO_ATTACK;
    let newTarget = {
      x: target.x + target.vx,
      y: target.y + target.vy,
      vx: target.vx,
      vy: target.vy,
    };
    while (newDist > possibleHeroMove) {
      turnsBeforeReach += 1;
      possibleHeroMove += HERO_ATTACK;
      newTarget.x += newTarget.vx;
      newTarget.y += newTarget.vy;
      newDist = distance(hero, newTarget);
    }
    return { x: newTarget.x, y: newTarget.y, turnsBeforeReach };
  };

  attackMonsterSmartly = (
    hero: Hero,
    target: Monster
  ): { x: number; y: number } => {
    const { x, y, turnsBeforeReach } = this.joinMovingTarget(hero, target);
    const monstersNearTarget = this.monsters
      .map((monster) => {
        const x = monster.x + turnsBeforeReach * monster.vx;
        const y = monster.y + turnsBeforeReach * monster.vy;
        return { x, y, id: monster.id };
      })
      .filter(
        (monster) =>
          monster.id !== target.id &&
          distance(monster, target) < 2 * HERO_ATTACK
      )
      .sort((a, b) => distance(a, target) - distance(b, target));

    if (monstersNearTarget.length) {
      const secondTarget = monstersNearTarget[0];
      const intersections = intersectionLineCircle(
        lineFrom2points(target, secondTarget),
        target,
        799
      );
      const goodIntersection = intersections.sort(
        (a, b) => distance(a, secondTarget) - distance(b, secondTarget)
      )[0];
      return {
        x: Math.round(goodIntersection.x),
        y: Math.round(goodIntersection.y),
      };
    } else {
      return { x, y };
    }
  };

  filterTopOrBottomMonsters = (hero: Hero, monsters: Monster[]): Monster[] => {
    if (hero.id % 3 === 1) {
      // keep only TOP SIDE monsters
      return monsters.filter((monster) => monster.x >= monster.y);
    } else if (hero.id % 3 === 2) {
      // keep only BOTTOM SIDE monsters
      return monsters.filter((monster) => monster.x <= monster.y);
    }
  };

  followMonster = (monster: Monster, hero: Hero): { x: number; y: number } => {
    const dist = distance(monster.nextPosition(), this.enemyBase);
    if (dist < 801) {
      return hero;
    }
    const sidePoints = intersectionTwoCircles(
      monster.nextPosition(),
      801,
      this.enemyBase,
      dist
    );
    const middlePoints = intersectionLineCircle(
      lineFrom2points(this.enemyBase, {
        x: this.enemyBase.x - 1,
        y: this.enemyBase.y - 1,
      }),
      this.enemyBase,
      dist
    );
    const middlePoint = middlePoints.filter((point) =>
      isPointInsideField(point)
    )[0];
    const sidePoint = sidePoints.sort(
      (a, b) => distance(a, middlePoint) - distance(b, middlePoint)
    )[0];

    let coords: { x: number; y: number };
    if (sidePoint && isPointInsideField(sidePoint)) {
      coords = sidePoint;
    } else {
      coords = middlePoint;
    }
    return { x: Math.round(coords.x), y: Math.round(coords.y) };
  };

  displayNextActions = (): void => {
    for (let i = 0; i < this.heroesPerPlayer; i++) {
      console.log(this.myHeroes[i].nextAction);
    }
  };
}

const [baseX, baseY] = readline().split(" ").map(Number); // The corner of the map representing your base
const heroesPerPlayer: number = Number(readline()); // Always 3
const gameSpider = new GameSpider(baseX, baseY, heroesPerPlayer);

// gameSpider loop
while (true) {
  const myBaseInput: number[] = readline().split(" ").map(Number);
  const enemyBaseInput: number[] = readline().split(" ").map(Number);
  gameSpider.newTurn(
    myBaseInput[0],
    myBaseInput[1],
    enemyBaseInput[0],
    enemyBaseInput[1]
  );

  const entityCount: number = Number(readline()); // Amount of heros and monsters you can see
  for (let i = 0; i < entityCount; i++) {
    const inputs: number[] = readline().split(" ").map(Number);
    gameSpider.addEntity(inputs);
  }

  gameSpider.chooseNextActions();
  gameSpider.displayNextActions();
}
