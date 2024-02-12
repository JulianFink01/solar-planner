import * as React from 'react';
import { useTranslation } from 'react-i18next';
import {
  Dimensions,
  Easing,
  StyleSheet,
  View,
} from 'react-native';
import { GlobalStyles } from '../../style/GlobalStyle';
import { Blur, Canvas, Rect } from '@shopify/react-native-skia';
import { ThemeDark } from '../../themes/ThemeDark';
import { Button, IconButton, Text, TextInput } from 'react-native-paper';
import Animated, { useAnimatedStyle, useSharedValue, withSpring, withTiming } from 'react-native-reanimated';
import { Roof } from '../../models/Roof';
import { User } from '../../models/User';
import RoofViewContent from '../roofs/RoofViewContent';
import { CONTAINER_PADDING } from '../../constants/GlobalConstants';
import { useRealm } from '@realm/react';


interface Props {
  onClose: Function,
  roof: Roof,
  user: User,
};

function EditorSettings({onClose, roof, user}: Props, ref: React.Ref<any>): React.JSX.Element {

  const { t } = useTranslation();
  const width = useSharedValue(0);
  const realm = useRealm();

  const[innerMargin, setInnerMargin] = React.useState<number>(roof.innerMarginCM);
  const[panelDistance, setPanelDistance] = React.useState<number>(roof.distanceBetweenPanelsCM);
  
  const animatedStyle = useAnimatedStyle(() => {
    return {
      position: 'absolute',
      height: '100%',
      width: withTiming(width.value, {duration: 300}),
      overflow: 'hidden',
      right: 0
    }
  });

  React.useImperativeHandle(ref, () => ({
    open(){
      width.value = 450;
    },
    close(){
       width.value = 0;
    }
   }));

  function update(){
    if(roof != null){
      realm.write(() => {
        roof.innerMarginCM = innerMargin;
        roof.distanceBetweenPanelsCM = panelDistance;
      });
    }
  } 

  return (
    <Animated.View style={animatedStyle}>
      <View style={styles.innerView}>
        <View style={styles.contentView}>
          <View style={styles.heading}>
            <Text variant='bodyLarge'>{t('settings:title')}</Text>
            <IconButton icon={'close'} onPress={() => onClose()}/>
          </View>
          
          <View style={{flex: 1}}>
            <TextInput
                style={styles.inputContainer}
                label={t('editor:innerMargin')}
                value={innerMargin + ''}
                onChangeText={(val) => setInnerMargin(parseFloat(val))}
              />

            <TextInput
              style={styles.inputContainer}
              label={t('editor:panelDistance')}
              value={panelDistance + ''}
              onChangeText={(val) => setPanelDistance(parseFloat(val))}
            />  
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
  contentView: {
    flex: 1,
    position: 'absolute',
    padding: 20,
    width: '100%',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    opacity: 1,
    backgroundColor: ThemeDark.colors.background
  },
  heading: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  inputContainer: {
   marginBottom: CONTAINER_PADDING,
   width: '95%'
  },
  button: {
    marginTop: CONTAINER_PADDING,
    width: '44%',
    alignSelf: 'flex-end'
  },
});

export default React.forwardRef(EditorSettings);
