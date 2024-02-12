import { point } from "@shopify/react-native-skia";

const numeric = require('numeric');

type Point = {
  x: number;
  y: number;
};


// allScreen ist der ganze View Bereich
// relativeToScreen ein Rechteck welches im View plaziert wurde
// trapezeoid ist die Form welche vom User ausgewählt wurde
// Der Code vergleicht die Transformation von allScreen zu Trapezeoid und plaziert das Rechteck relativeToScreen in gleichen Verhältniss zum trapezeoid
export function transforMatrix(allScreen: Point[], relativeToScreen: Point[], trapezeoid: Point[]): Point[] {
  const H = calculateHomographyMatrix(allScreen, trapezeoid);
  return [applyHomography(H, relativeToScreen[0]),applyHomography(H, relativeToScreen[1]),applyHomography(H, relativeToScreen[2]),applyHomography(H, relativeToScreen[3])]
}


function calculateHomographyMatrix(srcPoints: Point[], dstPoints: Point[]) {
  if (srcPoints.length !== 4 || dstPoints.length !== 4) {
      throw new Error('Es werden genau vier korrespondierende Punkte benötigt.');
  }

  let A = [];
  for (let i = 0; i < 4; i++) {
      const { x: x1, y: y1 } = srcPoints[i];
      const { x: x2, y: y2 } = dstPoints[i];

      A.push([x1, y1, 1, 0, 0, 0, -x2 * x1, -x2 * y1]);
      A.push([0, 0, 0, x1, y1, 1, -y2 * x1, -y2 * y1]);
  }

  let rhs: any = [];
  dstPoints.forEach(point => {
      rhs.push(point.x);
      rhs.push(point.y);
  });

  // Verwenden Sie numeric.js, um das Gleichungssystem zu lösen
  let solution = numeric.solve(A, rhs);

  // Umformen der Lösung in eine 3x3 Homographie-Matrix
  let H = [
      [solution[0], solution[1], solution[2]],
      [solution[3], solution[4], solution[5]],
      [solution[6], solution[7], 1] // Setzen Sie den letzten Wert auf 1 für homogene Koordinaten
  ];

  return H;
}

function applyHomography(H: any[][], point: Point) {
  let result = numeric.dot(H, [point.x, point.y, 1]);
  return {
      x: result[0] / result[2],
      y: result[1] / result[2]
  };
}

export function pointsToSvg(points: {x: number, y: number}[]) {
    if(points.length == 0){
      return "";
    }

    let pathData = "M";

    for (let i = 0; i < points.length; i++) {
        pathData += ` ${points[i].x} ${points[i].y}`;
        if(i < points.length - 2){
          pathData += " L";
        }
    }
    pathData += " Z";
    return pathData;
  }


export function getMaxCursorCoordinates(imageSize: {width: number, height: number}): {x: number, y: number}{
    return {x: imageSize.width, y: imageSize.height}
  }

  