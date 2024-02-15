import * as React from 'react';
import { useTranslation } from 'react-i18next';
import {
  Dimensions,
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


interface Props {
  onClose: Function,
  roof: Roof,
  user: User,
};

function EditorSettings({onClose, roof, user}: Props, ref: React.Ref<any>): React.JSX.Element {

  const { t } = useTranslation();
  const width = useSharedValue(0);
  const translatePanelX = useSharedValue(0);
  const realm = useRealm();

  const [isBoxLeft, setIsBoxLeft] = React.useState<boolean>(false);
  
  const innerMarginPicker = React.useRef<any>(null);
  const panelDistancePicker = React.useRef<any>(null);
  const roofWidth = React.useRef<any>(null);
  const roofHeight = React.useRef<any>(null);


  const panelWidth = 450;
  const screenWidth = Dimensions.get('screen').width;

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
        roof.innerMarginCM = innerMarginPicker.current.getState();
        roof.distanceBetweenPanelsCM = panelDistancePicker.current.getState();
        roof.height = roofHeight.current.getState();
        roof.width = roofWidth.current.getState();
      });
    }
  } 

  return (
    <Animated.View style={animatedStyle}>
      <View style={styles.innerView}>
        <View style={GlobalStyles.informationContainer}>
          <View style={styles.heading}>
            <Text variant='bodyLarge'>{t('settings:title')}</Text>
            <View style={{display: 'flex', flexDirection: 'row'}}>
              <IconButton icon={isBoxLeft ? 'arrow-right' : 'arrow-left'} onPress={() => setIsBoxLeft((prevValue) => !prevValue)}/>
              <IconButton icon={'close'} onPress={() => onClose()}/>
            </View>
          </View>
          
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', flexWrap: 'wrap'}}>
           
            <NumberAdder 
              onUpdate={() => {update()}}
              ref={innerMarginPicker}
              key='innerMarginPicker'
              label={t('editor:innerMargin')}
              initialValue={roof.innerMarginCM}
            />
            <NumberAdder 
              ref={panelDistancePicker}
              onUpdate={() => {update()}}
              key='panelDistancePicker'
              label={t('editor:panelDistance')}
              initialValue={roof.distanceBetweenPanelsCM}
            /> 
             <NumberAdder 
              ref={roofWidth}
              onUpdate={() => {update()}}
              key='roofWidth'
              label={t('roofs:width')}
              initialValue={roof.width}
            /> 
             <NumberAdder 
              ref={roofHeight}
              onUpdate={() => {update()}}
              key='roofHeight'
              label={t('roofs:height')}
              initialValue={roof.height}
            /> 
          </View>

          <View style={{flex: 1}}>

          </View>

          <Button icon="account-sync" 
              mode="contained"
              style={styles.button}
              buttonColor={ThemeDark.colors.inverseSurface}
              onPress={update}>
                {t('common:save')}
          </Button>  
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
    width: '44%',
    alignSelf: 'flex-end'
  },
});

export default React.forwardRef(EditorSettings);
