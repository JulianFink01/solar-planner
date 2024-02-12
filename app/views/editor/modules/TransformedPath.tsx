import * as React from 'react';
import { StackScreenProps } from '@react-navigation/stack';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, {  runOnJS, useAnimatedStyle, useSharedValue } from 'react-native-reanimated';
import { Blur, Canvas, Circle, DiffRect, FractalNoise, Group, Path, Rect, Skia, Turbulence, point, rect, rrect, sub } from "@shopify/react-native-skia";
import { View } from 'react-native';
import Point from '../Point';
import { ThemeDark } from '../../../themes/ThemeDark';
import { pointsToSvg, transforMatrix } from '../../../utils/PerspectiveHelper';
import { all } from 'mathjs';
import { Roof } from '../../../models/Roof';


const POINT_RADIUS = 10;


interface Props {
    allScreen: PointInterface[], 
    roofPoints: PointInterface[],
    debugView: boolean,
    points: {x: number, y: number}[],
    color: string,
    strokeWidth: number
}
function TransformedPath({allScreen,strokeWidth, points,debugView, roofPoints, color}: Props){


    const transformedPoints: PointInterface[] = transforMatrix(allScreen, points, roofPoints);
   
    return (<>
              <Path path={pointsToSvg(transformedPoints)} opacity={1} style="stroke" strokeJoin="round" color={color} strokeWidth={strokeWidth}/>
              {debugView && <Path path={pointsToSvg(points)} opacity={1} style="stroke" strokeJoin="round" color={'green'} strokeWidth={5}/>}    
            </>);
  }

TransformedPath.defaultProps = {
  color: 'white',
  strokeWidth: 3
}
  
export default TransformedPath;