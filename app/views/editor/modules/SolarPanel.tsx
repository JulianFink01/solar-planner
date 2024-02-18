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
import { SolarPanelMinimal } from '../../../mapper/SolarPanelMinimal';
import TransformedPath from './TransformedPath';


const POINT_RADIUS = 10;


interface Props {
    allScreen: PointInterface[], 
    solarPanel: SolarPanelMinimal, 
    debugView: boolean,
    displayGrid: boolean,
    roofPoints: PointInterface[],
    imageSize: {width: number, height: number},
    roof: Roof,
}
function SolarPanel({imageSize, roof, allScreen,solarPanel,displayGrid, debugView, roofPoints}: Props){

  const oneZentimeterHorizontal = imageSize.width / roof.width / 100;
  const oneZentimeterVertical = imageSize.height / roof.height / 100;

    return (
      <>

        <TransformedPath
                pathStyle='fill'
                strokeWidth={3}
                color='white'
                debugView={debugView}
                allScreen={allScreen}
                roofPoints={roofPoints}
                points={solarPanel.getCoordinates(roof.distanceBetweenPanelsCM, oneZentimeterHorizontal, oneZentimeterVertical)}
                      />

          {displayGrid && false && <TransformedPath
                            strokeWidth={1}
                            color='yellow'
                            debugView={debugView}
                            allScreen={allScreen}
                            roofPoints={roofPoints}
                            points={solarPanel.getWrapperCoordinates(roof.distanceBetweenPanelsCM,  oneZentimeterHorizontal, oneZentimeterVertical)}
                            />  }

    
              
        {debugView && <Path path={pointsToSvg(solarPanel.getCoordinates(roof.distanceBetweenPanelsCM, oneZentimeterHorizontal, oneZentimeterVertical))} 
                            opacity={1} 
                            style="stroke" 
                            strokeJoin="round" 
                            color={'green'} 
                            strokeWidth={3}/>}
      </>
    );
  }
export default SolarPanel;