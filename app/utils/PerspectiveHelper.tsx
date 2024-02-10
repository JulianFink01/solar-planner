const math = require('mathjs'); // sicherstellen, dass mathjs installiert ist (npm install mathjs)

type Point = {
  x: number;
  y: number;
};



export function transforMatrix(allScreen: Point[], relativeToScreen: Point[], newRelative: Point[]): Point[] {

  console.log(allScreen.length)
  console.log(relativeToScreen.length)
  console.log(newRelative.length)

  const matrix = calculateTransformationMatrix(allScreen, relativeToScreen);
  const formD = applyTransformation(newRelative, matrix);
  return formD;
}

function calculateTransformationMatrix(A: Point[], B: Point[]): math.Matrix {
  // Umwandlung der Punkte in eine Matrix für A und B
  const AMatrix = math.matrix(A.map(p => [p.x, p.y, 1]));
  const BMatrixX = math.matrix(B.map(p => p.x));
  const BMatrixY = math.matrix(B.map(p => p.y));

  // Verwendung der Pseudoinversen, da AMatrix nicht quadratisch ist
  const AMatrixPseudoInverse = math.pinv(AMatrix);

  // Berechnung der Transformationskoeffizienten für X und Y
  const transformX = math.multiply(AMatrixPseudoInverse, BMatrixX).toArray();
  const transformY = math.multiply(AMatrixPseudoInverse, BMatrixY).toArray();

  // Aufbau der Transformationsmatrix
  const transformationMatrix = [
      [transformX[0], transformX[1], transformX[2]],
      [transformY[0], transformY[1], transformY[2]],
      [0, 0, 1] // Homogene Koordinaten für affine Transformationen
  ];

  return math.matrix(transformationMatrix);
}

// Wende die Transformationsmatrix auf Form C an, um Form D zu erhalten
function applyTransformation(C: Point[], transformationMatrix: math.Matrix): Point[] {
  return C.map(point => {
    const result = math.multiply([point.x, point.y, 1], transformationMatrix).toArray();
    return { x: result[0], y: result[1] };
});
}



export function pointsToSvg(points: {x: number, y: number}[]) {
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