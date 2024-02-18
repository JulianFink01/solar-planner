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
import AreaPicker from './AreaPicker';
import { SolarPanelMinimal } from '../../../mapper/SolarPanelMinimal';
import { useRealm } from '@realm/react';
import { RoofImage } from '../../../models/RoofImage';
import { SolarPanel } from '../../../models/SolarPanel';
import { RoofPoint } from '../../../models/RoofPoint';
import SuccessSnackbar from '../../../componentes/SuccessSnackbar';
import { useTranslation } from 'react-i18next';
import Realm from 'realm';
import { CONTAINER_PADDING } from '../../../constants/GlobalConstants';



interface Props {
  imageSize: Dimension,
  roofImage: RoofImage,
  lockMode: boolean,
  debugView: boolean,
  displayGrid: boolean,
  roof: Roof,
}

function ViewPainter({imageSize, lockMode, roofImage, displayGrid, roof, debugView}: Props, ref: React.Ref<any>): React.JSX.Element {

    const realm = useRealm();
    const snackbBar = React.useRef<any>(null);
    const {t} = useTranslation();

    React.useImperativeHandle(ref, () => ({
      regenerateGrid(panelPlacement: 'horizontal' | 'vertical', placementHorizontal: string, placementVertical: 'string'){
        areaPicker.current.regenerateGrid(panelPlacement, placementHorizontal, placementVertical);
      },
      save(){
        const data: {roofPoints: PointInterface[], solarPanels: SolarPanelMinimal[]} = areaPicker.current.getState();
        realm.write(() => {
          if(roofImage?.roofPoints?.length > 0){
            realm.delete(roofImage.roofPoints);
          }

          for(let panel of data.solarPanels){
            const newPanel = realm.create(SolarPanel, {
              _id: new Realm.BSON.UUID(),
              startX: panel.startX,
              startY: panel.startY,
              placement: panel.placement
            });
            roofImage.solarPanels.push(newPanel);
          }
        
        
          if(roofImage?.solarPanels?.length > 0){
            realm.delete(roofImage.solarPanels);
          }
          for(let point of data.roofPoints){
            const newPoint = realm.create(RoofPoint, {
              _id: new Realm.BSON.UUID(),
              x: point.x,
              y: point.y
            });

            roofImage.roofPoints.push(newPoint);
        }

          
        })

        snackbBar?.current?.present(t('common:savedChanges'));
      }
    }));
  
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
                  roofImage={roofImage}
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
          <View style={{marginLeft: CONTAINER_PADDING, paddingRight: CONTAINER_PADDING}}>
            <SuccessSnackbar ref={snackbBar}/>
          </View>
        </View>
    );
} 

export default  React.forwardRef(ViewPainter);