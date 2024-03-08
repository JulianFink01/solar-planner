import * as React from 'react';
import {useTranslation} from 'react-i18next';
import {Dimensions, ScrollView, StyleSheet, View} from 'react-native';
import {ThemeDark} from '../../themes/ThemeDark';
import {Button, IconButton, Text, TextInput} from 'react-native-paper';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import {Roof} from '../../models/Roof';
import {User} from '../../models/User';
import {CONTAINER_PADDING} from '../../constants/GlobalConstants';
import {useRealm} from '@realm/react';
import NumberAdder from '../../componentes/NumberAdder';
import {GlobalStyles} from '../../style/GlobalStyle';
import ChipPicker from '../../componentes/ChipPicker';
import Slider from '@react-native-community/slider';

interface Props {
  onUpdate: Function;
  onClose: Function;
}

function OpacitySlider(
  {onClose, onUpdate}: Props,
  ref: React.Ref<any>,
): React.JSX.Element {
  const {t} = useTranslation();
  const width = useSharedValue(0);
  const translatePanelX = useSharedValue(0);

  const [isBoxLeft, setIsBoxLeft] = React.useState<boolean>(false);
  const [opacity, setOpactiy] = React.useState<number>(1);
  const screenWidth = Dimensions.get('screen').width;
  const panelWidth = (screenWidth / 10) * 4;

  const animatedStyle = useAnimatedStyle(() => {
    return {
      position: 'absolute',
      height: 150,
      width: withTiming(width.value, {duration: 300}),
      overflow: 'hidden',
      right: 0,
      transform: [
        {translateX: withTiming(translatePanelX.value, {duration: 300})},
      ],
    };
  });

  React.useImperativeHandle(ref, () => ({
    open() {
      if (isBoxLeft) {
        translatePanelX.value = -1 * (screenWidth - panelWidth);
      } else {
        width.value = panelWidth;
      }
    },
    close() {
      if (isBoxLeft) {
        translatePanelX.value = -1 * (screenWidth + 150);
      } else {
        width.value = 0;
      }
    },
  }));

  React.useEffect(() => {
    if (isBoxLeft) {
      translatePanelX.value = -1 * (screenWidth - panelWidth);
    } else {
      translatePanelX.value = 0;
    }
  }, [isBoxLeft]);

  React.useEffect(() => {
    onUpdate(opacity);
  }, [opacity]);

  function ListTitle({text}: {text: string}) {
    return (
      <View style={{width: '100%', marginBottom: 10}}>
        <Text variant="bodyLarge">{text}</Text>
      </View>
    );
  }

  return (
    <Animated.View style={animatedStyle}>
      <View style={styles.innerView}>
        <View style={GlobalStyles.informationContainer}>
          <View style={styles.heading}>
            <Text variant="headlineSmall">{t('editor:opacity')}</Text>
            <View style={{display: 'flex', flexDirection: 'row'}}>
              <IconButton
                icon={isBoxLeft ? 'arrow-right' : 'arrow-left'}
                onPress={() => setIsBoxLeft(prevValue => !prevValue)}
              />
              <IconButton icon={'close'} onPress={() => onClose()} />
            </View>
          </View>
          <View style={{flex: 1}}>
            <Slider
              style={{width: '100%', height: 40}}
              minimumValue={0}
              maximumValue={1}
              value={1}
              onValueChange={setOpactiy}
              minimumTrackTintColor={ThemeDark.colors.primary}
              maximumTrackTintColor={ThemeDark.colors.backdrop}
            />
          </View>
        </View>
      </View>
    </Animated.View>
  );
}
const styles = StyleSheet.create({
  innerView: {
    flex: 1,
    position: 'relative',
  },
  heading: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  button: {
    marginTop: CONTAINER_PADDING,
    alignSelf: 'flex-end',
  },
});

export default React.forwardRef(OpacitySlider);
