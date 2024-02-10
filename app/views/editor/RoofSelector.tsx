import * as React from 'react';
import { StackScreenProps } from '@react-navigation/stack';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, {  runOnJS, useAnimatedStyle, useSharedValue } from 'react-native-reanimated';
import { Blur, Canvas, Circle, DiffRect, FractalNoise, Group, Path, Rect, Skia, Turbulence, point, rect, rrect, sub } from "@shopify/react-native-skia";
import { View } from 'react-native';
import Point from './Point';
import { ThemeDark } from '../../themes/ThemeDark';
import { pointsToSvg, transforMatrix } from '../../utils/PerspectiveHelper';


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

        const width2 = imageSize.width; //width; //Math.max(points[1].x - points[0].x, points[2].x - points[3].x);
        const height2 = imageSize.height; //Math.max(points[3].y - points[0].y, points[2].y - points[1].y);
        // Wir plazieren alles in einem Rechteck die Transformation übernimmt den Rest
        const rectanglePoints: PointInterface[] = [{x:0, y: 0}, 
                                                   {x:0 + width2, y: 0 }, 
                                                   {x:0 + width2, y: 0 + height2}, 
                                                   {x:0, y: 0 + height2}];    
                                                                                                                                                      
        // Jeden einzelnen für die neue Form herausfinden und innenabstand hinzufügen
        const innerSpace = 10;
        const pointInRectangle1: PointInterface = {x: rectanglePoints[0].x + innerSpace, y: rectanglePoints[0].y + innerSpace};
        const pointInRectangle2: PointInterface = {x: rectanglePoints[1].x - innerSpace, y: rectanglePoints[1].y + innerSpace};
        const pointInRectangle3: PointInterface = {x: rectanglePoints[2].x - innerSpace, y: rectanglePoints[2].y - innerSpace};
        const pointInRectangle4: PointInterface = {x: rectanglePoints[3].x + innerSpace, y: rectanglePoints[3].y - innerSpace};

        const transformedPoints: PointInterface[] = transforMatrix(rectanglePoints,[pointInRectangle1, pointInRectangle2, pointInRectangle3, pointInRectangle4], points);


        return (
          <>
              <Path path={pointsToSvg(transformedPoints)} opacity={1} style="stroke" strokeJoin="round" color={'red'} strokeWidth={3}/>
              <Path path={pointsToSvg([pointInRectangle1, pointInRectangle2, pointInRectangle3, pointInRectangle4])} opacity={1} style="stroke" strokeJoin="round" color={'red'} strokeWidth={3}/>
              <Path path={pointsToSvg(rectanglePoints)} opacity={1} style="stroke" strokeJoin="round" color={'green'} strokeWidth={3}/>
             
              <Point maxCursorCoordinates={getMaxCursorCoordinates()} color={ThemeDark.colors.background} hidden={false} x={transformedPoints[0].x} y={transformedPoints[0].y} radius={5}  />
              <Point maxCursorCoordinates={getMaxCursorCoordinates()} color={ThemeDark.colors.background} hidden={false} x={transformedPoints[1].x} y={transformedPoints[1].y} radius={5}  />
              <Point maxCursorCoordinates={getMaxCursorCoordinates()} color={ThemeDark.colors.background} hidden={false} x={transformedPoints[2].x} y={transformedPoints[2].y} radius={5} />
              <Point maxCursorCoordinates={getMaxCursorCoordinates()} color={ThemeDark.colors.background} hidden={false} x={transformedPoints[3].x} y={transformedPoints[3].y} radius={5} />


              <Point maxCursorCoordinates={getMaxCursorCoordinates()} color={'green'} hidden={false} x={pointInRectangle1.x} y={pointInRectangle1.y} radius={5}  />
              <Point maxCursorCoordinates={getMaxCursorCoordinates()} color={'green'} hidden={false} x={pointInRectangle2.x} y={pointInRectangle2.y} radius={5}  />
              <Point maxCursorCoordinates={getMaxCursorCoordinates()} color={'green'} hidden={false} x={pointInRectangle3.x} y={pointInRectangle3.y} radius={5} />
              <Point maxCursorCoordinates={getMaxCursorCoordinates()} color={'green'} hidden={false} x={pointInRectangle4.x} y={pointInRectangle4.y} radius={5} />

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