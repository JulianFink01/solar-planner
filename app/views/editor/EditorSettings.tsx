import * as React from 'react';
import { useTranslation } from 'react-i18next';
import {
  Dimensions,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';
import { ThemeDark } from '../../themes/ThemeDark';
import { Button, IconButton, Text, TextInput } from 'react-native-paper';
import Animated, { useAnimatedStyle, useSharedValue, withSpring, withTiming } from 'react-native-reanimated';
import { Roof } from '../../models/Roof';
import { User } from '../../models/User';
import { CONTAINER_PADDING } from '../../constants/GlobalConstants';
import { useRealm } from '@realm/react';
import NumberAdder from '../../componentes/NumberAdder';
import { GlobalStyles } from '../../style/GlobalStyle';
import ChipPicker from '../../componentes/ChipPicker';


interface Props {
  onClose: Function,
  roof: Roof,
  user: User,
  regenerateGrid: (panelPlacement: 'horizontal' | 'vertical', placementHorizontal: string, placementVertical: 'string') => any
};

function EditorSettings({onClose, roof, user, regenerateGrid}: Props, ref: React.Ref<any>): React.JSX.Element {

  const { t } = useTranslation();
  const width = useSharedValue(0);
  const translatePanelX = useSharedValue(0);
  const realm = useRealm();

  const [isBoxLeft, setIsBoxLeft] = React.useState<boolean>(false);
  
  const panelPlacement = React.useRef<any>(null);
  const horizontalPlacement = React.useRef<any>(null);
  const verticalPlacement = React.useRef<any>(null);
  const innerMarginPickerTop = React.useRef<any>(null);
  const innerMarginPickerRight = React.useRef<any>(null);
  const innerMarginPickerBottom = React.useRef<any>(null);
  const innerMarginPickerLeft = React.useRef<any>(null);
  const panelDistancePicker = React.useRef<any>(null);
  const roofWidth = React.useRef<any>(null);
  const roofHeight = React.useRef<any>(null);


  const placementValues = [{icon: 'panorama-vertical', title: t('common:vertical'), value: 'vertical'},
                          {icon: 'panorama-horizontal', title: t('common:horizontal'), value: 'horizontal'}, 
                           ];

  const horizontalPlacements = [{icon: 'align-horizontal-left', title: t('common:horizontal'), value: 'align-horizontal-left'}, 
                                {icon: 'align-horizontal-center', title: t('common:vertical'), value: 'align-horizontal-center'},
                                {icon: 'align-horizontal-right', title: t('common:vertical'), value: 'align-horizontal-right'}];
                                

  const verticalPlacements =   [{icon: 'align-vertical-top', title: t('common:horizontal'), value: 'align-horizontal-left'}, 
                                {icon: 'align-vertical-center', title: t('common:vertical'), value: 'align-horizontal-center'},
                                {icon: 'align-vertical-bottom', title: t('common:vertical'), value: 'align-horizontal-right'}];

  const screenWidth = Dimensions.get('screen').width;
  const panelWidth = screenWidth / 4 * 3;

  const animatedStyle = useAnimatedStyle(() => {
    return {
      position: 'absolute',
      height: '100%',
      width: withTiming(width.value, {duration: 300}),
      overflow: 'hidden',
      right: 0,
      transform: [{translateX: withTiming(translatePanelX.value, {duration: 300})}]
    }
  });

  React.useImperativeHandle(ref, () => ({
    open(){
      if(isBoxLeft){
        translatePanelX.value = -1 * (screenWidth - panelWidth);
      } else {
         width.value = panelWidth;
      }
    },
    close(){
       if(isBoxLeft){
          translatePanelX.value = -1 * (screenWidth + 150);
       } else {
          width.value = 0;
       }
    }
   }));
  
   React.useEffect(() => {
    if(isBoxLeft){
      translatePanelX.value = -1 * (screenWidth - panelWidth);
    } else {
      translatePanelX.value = 0;
    }
   }, [isBoxLeft]);

  function update(){
    if(roof != null){
      realm.write(() => {
        roof.innerMarginTop = innerMarginPickerTop.current.getState();
        roof.innerMarginBottom = innerMarginPickerBottom.current.getState();
        roof.innerMarginLeft = innerMarginPickerLeft.current.getState();
        roof.innerMarginRight = innerMarginPickerRight.current.getState();
        roof.distanceBetweenPanelsCM = panelDistancePicker.current.getState();
        roof.height = roofHeight.current.getState();
        roof.width = roofWidth.current.getState();
      });
    }
  } 

  function ListTitle({text}: {text: string}){
    return <View style={{width: '100%', marginBottom: 10}}>
              <Text variant='bodyLarge'>
                {text}
              </Text>
          </View>
    }

  function triggerRegenerate(){
    regenerateGrid(panelPlacement.current.getState(), horizontalPlacement.current.getState(), verticalPlacement.current.getState());
  }  

  return (
    <Animated.View style={animatedStyle}>
      <View style={styles.innerView}>
        <View style={GlobalStyles.informationContainer}>
          <View style={styles.heading}>
            <Text variant='headlineSmall'>{t('settings:title')}</Text>
            <View style={{display: 'flex', flexDirection: 'row'}}>
              <IconButton icon={isBoxLeft ? 'arrow-right' : 'arrow-left'} onPress={() => setIsBoxLeft((prevValue) => !prevValue)}/>
              <IconButton icon={'close'} onPress={() => onClose()}/>
            </View>
          </View>
          
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', flexWrap: 'wrap'}}></View>
          <ScrollView contentContainerStyle={{ flexDirection: 'row', justifyContent: 'space-between', flexWrap: 'wrap'}}>
           
            <View style={{flexDirection: 'row', justifyContent: 'space-between', flexWrap: 'wrap', width: '60%', borderRightWidth: 1, borderRightColor: 'white'}}>
              

              <ListTitle text={t('editor:innerMargin')}/>
              <NumberAdder 
                ref={innerMarginPickerTop}
                key='innerMarginTop'
                label={t('editor:innerMarginTop')}
                initialValue={roof.innerMarginTop}
              />
              <NumberAdder 
                ref={innerMarginPickerRight}
                key='innerMarginRight'
                label={t('editor:innerMarginRight')}
                initialValue={roof.innerMarginRight}
              />
              <NumberAdder 
                ref={innerMarginPickerBottom}
                key='innerMarginBottom'
                label={t('editor:innerMarginBottom')}
                initialValue={roof.innerMarginBottom}
              />
              <NumberAdder 
                ref={innerMarginPickerLeft}
                key='innerMarginLeft'
                label={t('editor:innerMarginLeft')}
                initialValue={roof.innerMarginLeft}
              />
              <ListTitle text={t('roofs:roof_dimensions')} />
         
              <NumberAdder 
                ref={roofWidth}
                key='roofWidth'
                label={t('roofs:width')}
                initialValue={roof.width}
              /> 
              <NumberAdder 
                ref={roofHeight}
                key='roofHeight'
                label={t('roofs:height')}
                initialValue={roof.height}
              /> 
              <ListTitle text={t('common:more')} />
             
              <NumberAdder 
                ref={panelDistancePicker}
                onUpdate={() => {update()}}
                key='panelDistancePicker'
                label={t('editor:panelDistance')}
                initialValue={roof.distanceBetweenPanelsCM}
              /> 
              </View>
              <View style={{flexDirection: 'row', justifyContent: 'space-between', flexWrap: 'wrap', width: '40%', paddingLeft: 15}}>
                <ListTitle text={t('editor:autoFill')} />
                <Text variant="labelSmall">{t('editor:panelPlacement')}</Text>
                <ChipPicker
                  ref={panelPlacement} 
                  items={placementValues}
                  initialValue={placementValues[0].value}
                />
               
                 <Text variant="labelSmall">{t('editor:placementHorizontal')}</Text>
                 <ChipPicker
                  ref={horizontalPlacement} 
                  items={horizontalPlacements}
                  initialValue={horizontalPlacements[0].value}
                />
                <Text variant="labelSmall">{t('editor:placementVertical')}</Text>
                <ChipPicker
                  ref={verticalPlacement} 
                  items={verticalPlacements}
                  initialValue={verticalPlacements[0].value}
                />
            </View>
          </ScrollView>

         <View style={{display: 'flex', flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'space-between'}}>
           
            <Button icon="account-sync" 
                mode="contained"
                style={styles.button}
                buttonColor={ThemeDark.colors.inverseSurface}
                onPress={update}>
                  {t('common:save')}
            </Button>  
            <Button icon="refresh" 
                mode="contained"
                style={{...styles.button, marginRight: 10}}
                buttonColor={ThemeDark.colors.primary}
                onPress={triggerRegenerate}>
                  {t('editor:regenerate')}
            </Button>  
         </View>
        </View>
      </View>
    </Animated.View>
  );
}
const styles = StyleSheet.create({
  
  innerView: {
    flex: 1,
    position: 'relative'
  },
  heading: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  button: {
    marginTop: CONTAINER_PADDING,
    alignSelf: 'flex-end'
  },
});

export default React.forwardRef(EditorSettings);
