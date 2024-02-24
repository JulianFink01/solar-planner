import * as React from 'react';
import {useTranslation} from 'react-i18next';
import {StyleSheet, View} from 'react-native';
import {GlobalStyles} from '../../style/GlobalStyle';
import {IconButton, Text} from 'react-native-paper';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import {Roof} from '../../models/Roof';
import {User} from '../../models/User';
import RoofViewContent from '../roofs/RoofViewContent';
import {RoofImage} from '../../models/RoofImage';

interface Props {
  onClose: Function;
  roof: Roof;
  roofImage: RoofImage;
  user: User;
}

function Information(
  {onClose, roof, user, roofImage}: Props,
  ref: React.Ref<any>,
): React.JSX.Element {
  const {t} = useTranslation();
  const width = useSharedValue(0);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      position: 'absolute',
      height: '100%',
      width: withTiming(width.value, {duration: 300}),
      overflow: 'hidden',
    };
  });

  React.useImperativeHandle(ref, () => ({
    open() {
      width.value = 450;
    },
    close() {
      width.value = 0;
    },
  }));

  return (
    <Animated.View style={animatedStyle}>
      <View style={GlobalStyles.informationContainer}>
        <View style={styles.contentView}>
          <View style={styles.heading}>
            <Text variant="bodyLarge">{t('editor:information')}</Text>
            <IconButton icon={'close'} onPress={() => onClose()} />
          </View>
          <RoofViewContent roofImage={roofImage} roof={roof} user={user} />
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
  contentView: {
    flex: 1,
    position: 'absolute',
    padding: 20,
    width: 400,
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  heading: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
});

export default React.forwardRef(Information);
