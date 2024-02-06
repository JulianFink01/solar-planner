export function transformPointInRectangleToTrapez(rectanglePoint: number[], 
                                                  rectangleTopLeft: number[], 
                                                  rectangleTopRight: number[], 
                                                  rectangleBottomRight: number[], 
                                                  rectangleBottomLeft: number[], 
                                                  trapezTopLeft: number[], 
                                                  trapezTopRight: number[], 
                                                  trapezBottomRight: number[],
                                                  trapezBottomLeft: number[],) {
   // Vektorrechnung für die Seiten des Rechtecks
   var v1 = [rectangleTopRight[0] - rectangleTopLeft[0], rectangleTopRight[1] - rectangleTopLeft[1]];
   var v2 = [rectangleBottomLeft[0] - rectangleTopLeft[0], rectangleBottomLeft[1] - rectangleTopLeft[1]];

   // Punktvektor im Rechteck
   var pointVector = [rectanglePoint[0] - rectangleTopLeft[0], rectanglePoint[1] - rectangleTopLeft[1]];

   // Berechne Skalarprodukte
   var dotV1V1 = dotProduct(v1, v1);
   var dotV1V2 = dotProduct(v1, v2);
   var dotV2V2 = dotProduct(v2, v2);
   var dotPointV1 = dotProduct(pointVector, v1);
   var dotPointV2 = dotProduct(pointVector, v2);

   // Berechne Determinante der Matrix
   var det = dotV1V1 * dotV2V2 - dotV1V2 * dotV1V2;

   // Berechne inverse Matrix
   var invDet = 1 / det;
   var u = (dotV2V2 * dotPointV1 - dotV1V2 * dotPointV2) * invDet;
   var v = (dotV1V1 * dotPointV2 - dotV1V2 * dotPointV1) * invDet;

   // Transformiere den Punkt in das Trapez
   var trapezPointX = trapezTopLeft[0] + u * (trapezTopRight[0] - trapezTopLeft[0]) + v * (trapezBottomLeft[0] - trapezTopLeft[0]);
   var trapezPointY = trapezTopLeft[1] + u * (trapezTopRight[1] - trapezTopLeft[1]) + v * (trapezBottomLeft[1] - trapezTopLeft[1]);

   return [trapezPointX, trapezPointY];
}

// Hilfsfunktion für das Skalarprodukt zweier Vektoren
function dotProduct(v1: number[], v2: number[]) {
    return v1[0] * v2[0] + v1[1] * v2[1];
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