import * as React from 'react';
import { StackScreenProps } from '@react-navigation/stack';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, {  runOnJS, useAnimatedStyle, useSharedValue } from 'react-native-reanimated';
import { Blur, Canvas, Circle, DiffRect, FractalNoise, Group, Path, Rect, Skia, Turbulence, rect, rrect } from "@shopify/react-native-skia";
import { View } from 'react-native';
import Point from './Point';
import { ThemeDark } from '../../themes/ThemeDark';


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

    function pointsToSvg(points: Point[]) {
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

    function Points(){
      return (
        <>
          <Path path={pointsToSvg(points)} opacity={displayGrid ? 1 : 0} style="stroke" strokeJoin="round" color={ThemeDark.colors.inverseSurface} strokeWidth={3}/>
          <Point hidden={lockMode || !displayGrid} ref={pointLeftTop} x={points[0].x} y={points[0].y} radius={points[0].radius}  />
          <Point hidden={lockMode || !displayGrid} ref={pointRightTop} x={points[1].x} y={points[1].y} radius={points[1].radius}  />
          <Point hidden={lockMode || !displayGrid} ref={pointRightBottom} x={points[2].x} y={points[2].y} radius={points[2].radius} />
          <Point hidden={lockMode || !displayGrid} ref={pointLeftBottom} x={points[3].x} y={points[3].y} radius={points[3].radius} />
        </>
      );
    }

    function Selection(){
        const star = Skia.Path.MakeFromSVGString(
         pointsToSvg(points)
        )!;

        return (
          <Canvas style={{ width: '100%',height:'100%', marginTop: 13}}>
              <Group
                clip={star} 
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
          </Canvas>
        );
      };

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
        <View style={{flex: 1}}>
          <GestureDetector gesture={gesture}>
            <Selection />
          </GestureDetector>
        </View>
    );
} 

export default  React.forwardRef(RoofSelector);