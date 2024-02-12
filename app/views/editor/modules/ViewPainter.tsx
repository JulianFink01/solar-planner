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
import SolarPanel from './SolarPanel';
import AreaPicker from './AreaPicker';




interface Props {
  imageSize: Dimension,
  lockMode: boolean,
  debugView: boolean,
  displayGrid: boolean,
  roof: Roof
}

function ViewPainter({imageSize, lockMode, displayGrid, roof, debugView}: Props, ref: React.Ref<any>): React.JSX.Element {


  
    const areaPicker = React.useRef<any>(null);

    const [areaPickerPoints, setAreaPickerPoints] = React.useState<PointInterface[]>([]);

    function handlePan(e: any){
      if(lockMode || !displayGrid){
        return;
      }
      const x = e.x;
      const y = e.y;
      areaPicker.current.onGestureStart(x,y, 50);
    }

    function onGestureEnd(){
      areaPicker.current.onGestureEnd();
    }
    
    const gesture = Gesture.Pan().onChange((e) => {
                                    runOnJS(handlePan)(e);
                                  })
                                  .onEnd(() => {
                                    runOnJS(onGestureEnd)();
                                  });
    
    const shape = Skia.Path.MakeFromSVGString(
      pointsToSvg(areaPickerPoints)
    )!;  
    
    return (
        <View style={{width: imageSize.width, height: imageSize.height,}}>
          <GestureDetector gesture={gesture}>
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
                <AreaPicker 
                  onUpdate={(points) => {
                    setAreaPickerPoints(points)
                  }}
                  ref={areaPicker}                
                  debugView={debugView}
                  displayGrid={displayGrid}
                  imageSize={imageSize}
                  lockMode={lockMode}
                  roof={roof}
                ></AreaPicker>
          </Canvas>
          </GestureDetector>
        </View>
    );
} 

export default  React.forwardRef(ViewPainter);