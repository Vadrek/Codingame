/*
si on veut focus une araignée M1 avec le heros H et attaquer les autres (M2, M3...) si elles sont à côté :
si M1 est < 800 du héros :
    lister les monstres < 1600 de M1
    pour chaque, calculer milieu, par exemple cords du centre de [M1,M2]
    regarder combien d'araignées sont < 800 de ce centre
sinon si M1 < 1600 du héros :
calculer les centres avec les coords n+1 des araignées (x+vx, y+vy)
sinon se diriger vers M1
*/

function intersectionTwoCirclesBad(
  { x: xA, y: yA }: { x: number; y: number },
  rA: number,
  { x: xB, y: yB }: { x: number; y: number },
  rB: number
): { x: number; y: number }[] {
  const A = 2 * (xB - xA);
  const B = 2 * (yB - yA);
  const C = (xB - xA) ** 2 + (yB - yA) ** 2 + rA ** 2 - rB ** 2;
  const delta =
    (2 * A * C) ** 2 - 4 * (A ** 2 + B ** 2) * (C ** 2 - B ** 2 * rB ** 2);
  // results M1(x1, y1) and M2(x2,y2)
  if (delta < 0) {
    return [];
  } else {
    const x1 = xA + (2 * A * C - Math.sqrt(delta)) / (2 * (A ** 2 + B ** 2));
    const x2 = xA + (2 * A * C + Math.sqrt(delta)) / (2 * (A ** 2 + B ** 2));
    let y1;
    let y2;
    if (B !== 0) {
      y1 = yA + (C - A * (x1 - xA)) / B;
      y2 = yA + (C - A * (x2 - xA)) / B;
    } else {
      y1 = yA + B / 2 + Math.sqrt(rB ** 2 - ((2 * C - A ** 2) / (2 * A)) ** 2);
      y2 = yA + B / 2 - Math.sqrt(rB ** 2 - ((2 * C - A ** 2) / (2 * A)) ** 2);
    }
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

function lineFrom2pointsTest(
  { x: x1, y: y1 }: { x: number; y: number },
  { x: x2, y: y2 }: { x: number; y: number }
): { a: number; b: number; c: number } {
  // line: ax +by + c = 0, it returns [a,b,c]
  console.log("in lineFrom2points, equation droite");
  if (x1 === x2) {
    console.log("x =", x1);
    return { a: 1, b: 0, c: -x1 };
  } else {
    console.log(
      `y = ${(y2 - y1) / (x2 - x1)}x + ${(x2 * y1 - x1 * y2) / (x2 - x1)}`
    );
    return { a: y2 - y1, b: x1 - x2, c: x2 * y1 - x1 * y2 };
  }
}

function intersectionLineCircleTest(
  { a, b, c }: { a: number; b: number; c: number },
  { x: xc, y: yc }: { x: number; y: number },
  r: number
): { x: number; y: number }[] {
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
}

function intersectionTwoCirclesTest(
  { x: x1, y: y1 }: { x: number; y: number },
  r1: number,
  { x: x2, y: y2 }: { x: number; y: number },
  r2: number
): { x: number; y: number }[] {
  // line : ax + by + c = 0
  const lineBetweenintersections = {
    a: x1 - x2,
    b: y1 - y2,
    c: (r1 ** 2 - r2 ** 2 - x1 ** 2 + x2 ** 2 - y1 ** 2 + y2 ** 2) / 2,
  };
  return intersectionLineCircleTest(
    lineBetweenintersections,
    { x: x1, y: y1 },
    r1
  );
}

const distanceTest = (
  { x: xA, y: yA }: { x: number; y: number },
  { x: xB, y: yB }: { x: number; y: number }
): number => {
  return Math.sqrt(Math.pow(xA - xB, 2) + Math.pow(yA - yB, 2));
};

function main() {
  const p1 = { x: 314, y: 3869 };
  const r1 = 799;
  const p2 = { x: 1449, y: 3837 };
  const r2 = 2;

  // const res = intersectionTwoCirclesBad(p1, r1, p2, r2);
  // console.log("res", res);
  // console.log("lineFrom2points", lineFrom2points(p1, p2));
  console.log("distance p1 p2", distanceTest(p1, p2));
  console.log(
    "intersectionLineCircle",
    intersectionLineCircleTest(lineFrom2pointsTest(p1, p2), p1, r1)
  );
  // console.log(
  //   "intersectionTwoCirclesTest",
  //   intersectionTwoCirclesTest(p1, r1, p2, r2)
  // );
}

main();
