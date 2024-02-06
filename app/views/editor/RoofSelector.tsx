import * as React from 'react';
import { StackScreenProps } from '@react-navigation/stack';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, {  runOnJS, useAnimatedStyle, useSharedValue } from 'react-native-reanimated';
import { Blur, Canvas, Circle, DiffRect, FractalNoise, Group, Path, Rect, Skia, Turbulence, rect, rrect } from "@shopify/react-native-skia";
import { View } from 'react-native';
import Point from './Point';
import { ThemeDark } from '../../themes/ThemeDark';
import { pointsToSvg, transformPointInRectangleToTrapez } from '../../utils/PerspectiveHelper';


const POINT_RADIUS = 10;


interface Props {
  imageSize: Dimension,
  lockMode: boolean,
  displayGrid: boolean
}

function RoofSelector({imageSize, lockMode, displayGrid}: Props, ref: React.Ref): React.JSX.Element {


    const pointLeftTop = React.useRef<any>(null);
    const pointLeftBottom = React.useRef<any>(null);
    const pointRightTop = React.useRef<any>(null);
    const pointRightBottom = React.useRef<any>(null);

    const [startX, setStartX] = React.useState<number>(50);
    const [startY, setStartY] = React.useState<number>(50);

    const [width, setWidth] = React.useState<number>(imageSize.width -100);
    const [height, setHeight] = React.useState<number>(imageSize.height - 100);

    const [points, setPoints] = React.useState<PointInterface[]>([{x: startX, y: startY, radius: POINT_RADIUS}, // leftTop
                                                                  {x: startX + width, y: startY, radius: POINT_RADIUS},  // rightTop
                                                                  {x: startX + width, y: startY + height, radius: POINT_RADIUS},  // rightBottom
                                                                  {x: startX, y: startY + height, radius: POINT_RADIUS}]); // leftTop
    function getMaxCursorCoordinates(): {x: number, y: number}{
      return {x: imageSize.width, y: imageSize.height}
    }

    function Points(){
      return (
        <>
          <Path path={pointsToSvg(points)} opacity={displayGrid ? 1 : 0} style="stroke" strokeJoin="round" color={ThemeDark.colors.inverseSurface} strokeWidth={3}/>
          <Point maxCursorCoordinates={getMaxCursorCoordinates()} color={ThemeDark.colors.primary} hidden={lockMode || !displayGrid} ref={pointLeftTop} x={points[0].x} y={points[0].y} radius={points[0].radius}  />
          <Point maxCursorCoordinates={getMaxCursorCoordinates()} color={ThemeDark.colors.primary} hidden={lockMode || !displayGrid} ref={pointRightTop} x={points[1].x} y={points[1].y} radius={points[1].radius}  />
          <Point maxCursorCoordinates={getMaxCursorCoordinates()} color={ThemeDark.colors.primary} hidden={lockMode || !displayGrid} ref={pointRightBottom} x={points[2].x} y={points[2].y} radius={points[2].radius} />
          <Point maxCursorCoordinates={getMaxCursorCoordinates()} color={ThemeDark.colors.primary} hidden={lockMode || !displayGrid} ref={pointLeftBottom} x={points[3].x} y={points[3].y} radius={points[3].radius} />
        </>
      );
    }

    function Selection(){
        const shape = Skia.Path.MakeFromSVGString(
         pointsToSvg(points)
        )!;

        return (
          <Canvas style={{ width: '100%',height:'100%', }}>
              <Group
                clip={shape} 
                color="black"
                opacity={displayGrid ? 1 : 0}
                invertClip
                >
                  <Rect color={ThemeDark.colors.background} 
                        opacity={0.35}
                        width={imageSize.width} 
                        height={imageSize.height} />
                </Group>
                <Points />
                <WorkingArea />
          </Canvas>
        );
      };

      function WorkingArea(){


        // Wir plazieren alles in einem Rechteck die Transformation übernimmt den Rest
        const rectanglePoints: number[][] = [[points[0].x, points[0].y], 
                                             [points[0].x + width, points[0].y], 
                                             [points[0].x + width, points[0].y + height], 
                                             [points[0].x, points[0].y + height]];
        // Wir definieren die Koordinaten vom Trapez für die Matrix
        const targetPoints: number[][] = [[points[0].x, points[0].y], 
                                          [points[1].x, points[1].y], 
                                          [points[2].x, points[2].y], 
                                          [points[3].x, points[3].y]]; 

        // Jeden einzelnen für die neue Form herausfinden und innenabstand hinzufügen
        const innerSpace = 10;
        const pointInRectangle1: number[] = [rectanglePoints[0][0] + innerSpace, rectanglePoints[0][1] + innerSpace];
        const pointInRectangle2: number[] = [rectanglePoints[1][0] - innerSpace, rectanglePoints[1][1] + innerSpace];
        const pointInRectangle3: number[] = [rectanglePoints[2][0] - innerSpace, rectanglePoints[2][1] - innerSpace];
        const pointInRectangle4: number[] = [rectanglePoints[3][0] + innerSpace, rectanglePoints[3][1] - innerSpace];

        const transformedPoint1: number[] = transformPointInRectangleToTrapez(pointInRectangle1, rectanglePoints[0], rectanglePoints[1], rectanglePoints[2], rectanglePoints[3], targetPoints[0], targetPoints[1], targetPoints[2], targetPoints[3]);
        const transformedPoint2: number[] = transformPointInRectangleToTrapez(pointInRectangle2, rectanglePoints[0], rectanglePoints[1], rectanglePoints[2], rectanglePoints[3], targetPoints[0], targetPoints[1], targetPoints[2], targetPoints[3]);
        const transformedPoint3: number[] = transformPointInRectangleToTrapez(pointInRectangle3, rectanglePoints[0], rectanglePoints[1], rectanglePoints[2], rectanglePoints[3], targetPoints[0], targetPoints[1], targetPoints[2], targetPoints[3]);
        const transformedPoint4: number[] = transformPointInRectangleToTrapez(pointInRectangle4, rectanglePoints[0], rectanglePoints[1], rectanglePoints[2], rectanglePoints[3], targetPoints[0], targetPoints[1], targetPoints[2], targetPoints[3]);

        function mapPoint(pt: number[]): {x: number, y: number}{
          return {x: Math.round(pt[0]), y: Math.round(pt[1])};
        }

        const ps = [mapPoint(transformedPoint1), mapPoint(transformedPoint2), mapPoint(transformedPoint3),mapPoint(transformedPoint4)];
        const ps2 = [mapPoint(rectanglePoints[0]), mapPoint(rectanglePoints[1]), mapPoint(rectanglePoints[2]),mapPoint(rectanglePoints[3])];
        return (
          <>
              <Path path={pointsToSvg(ps)}
               opacity={1} style="stroke" strokeJoin="round" color={'red'} strokeWidth={3}/>
              <Point maxCursorCoordinates={getMaxCursorCoordinates()} color={ThemeDark.colors.background} hidden={false} x={transformedPoint1[0]} y={transformedPoint1[1]} radius={5}  />
              <Point maxCursorCoordinates={getMaxCursorCoordinates()} color={ThemeDark.colors.background} hidden={false} x={transformedPoint2[0]} y={transformedPoint2[1]} radius={5}  />
              <Point maxCursorCoordinates={getMaxCursorCoordinates()} color={ThemeDark.colors.background} hidden={false} x={transformedPoint3[0]} y={transformedPoint3[1]} radius={5} />
              <Point maxCursorCoordinates={getMaxCursorCoordinates()} color={ThemeDark.colors.background} hidden={false} x={transformedPoint4[0]} y={transformedPoint4[1]} radius={5} />
          </>
        );
      }

      function checkForCollsion(x: number, y: number, radius: number){
        if(pointLeftTop.current.collides({x, y, radius})){
          return;
        }else if(pointLeftBottom.current.collides({x, y, radius})){
          return;
        }else if(pointRightTop.current.collides({x, y, radius})){
          return;
        }
        pointRightBottom.current.collides({x, y, radius});
      }
    
      function updatePoints(){
        const newPoints = [...points];
        newPoints[0] = pointLeftTop.current.getState();
        newPoints[1] = pointRightTop.current.getState();
        newPoints[2] = pointRightBottom.current.getState();
        newPoints[3] = pointLeftBottom.current.getState();
        setPoints(newPoints);
      }

      function handlePan(e: any){
        if(lockMode || !displayGrid){
          return;
        }
        const x = e.x;
        const y = e.y;
        checkForCollsion(x,y, 50);
      }
    
      const gesture = Gesture.Pan().onChange((e) => {
                                      
                                      runOnJS(handlePan)(e);
                                    })
                                    .onEnd(() => {
                                      runOnJS(updatePoints)();
                                    });

    return (
        <View style={{width: imageSize.width, height: imageSize.height,}}>
          <GestureDetector gesture={gesture}>
            <Selection />
          </GestureDetector>
        </View>
    );
} 

export default  React.forwardRef(RoofSelector);