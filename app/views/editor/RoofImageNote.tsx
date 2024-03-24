import * as React from 'react';
import {useTranslation} from 'react-i18next';
import {Dimensions, StyleSheet, View} from 'react-native';
import {ThemeDark} from '../../themes/ThemeDark';
import {Button, IconButton, Text, TextInput} from 'react-native-paper';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import {CONTAINER_PADDING} from '../../constants/GlobalConstants';
import {useQuery, useRealm} from '@realm/react';
import {GlobalStyles} from '../../style/GlobalStyle';
import {SolarPanelType} from '../../models/SolarPanelType';
import {RoofImage} from '../../models/RoofImage';

interface Props {
  roofImage: RoofImage;
  onClose: Function;
}

function RoofImageNote(
  {onClose, roofImage}: Props,
  ref: React.Ref<any>,
): React.JSX.Element {
  const {t} = useTranslation();
  const width = useSharedValue(0);
  const translatePanelX = useSharedValue(0);
  const realm = useRealm();

  const [isBoxLeft, setIsBoxLeft] = React.useState<boolean>(false);
  const [note, setNote] = React.useState(roofImage?.notes);

  const screenWidth = Dimensions.get('screen').width;
  const panelWidth = 500;

  React.useEffect(() => {
    setNote(roofImage?.notes);
  }, [roofImage]);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      position: 'absolute',
      height: '100%',
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

  function update() {
    if (roofImage != null) {
      realm.write(() => {
        roofImage.notes = note;
      });
      onClose();
    }
  }

  return (
    <Animated.View style={animatedStyle}>
      <View style={styles.innerView}>
        <View style={{...GlobalStyles.informationContainer, padding: 0}}>
          <View style={styles.heading}>
            <Text variant="headlineSmall">{t('users:notes')}</Text>
            <View style={{display: 'flex', flexDirection: 'row'}}>
              <IconButton
                icon={isBoxLeft ? 'arrow-right' : 'arrow-left'}
                onPress={() => setIsBoxLeft(prevValue => !prevValue)}
              />
              <IconButton icon={'close'} onPress={() => onClose()} />
            </View>
          </View>

          <TextInput
            style={styles.notesContainer}
            textColor="black"
            value={note}
            multiline
            onChangeText={setNote}
          />

          <Button
            icon="account-sync"
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
    position: 'relative',
  },
  heading: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingLeft: CONTAINER_PADDING,
  },
  button: {
    marginTop: CONTAINER_PADDING,
    alignSelf: 'flex-start',
    marginLeft: CONTAINER_PADDING,
    marginBottom: 4 * CONTAINER_PADDING,
  },
  inputContainer: {
    marginBottom: CONTAINER_PADDING * 2,
    width: '95%',
  },

  notesContainer: {
    flex: 1,
    backgroundColor: '#ffe57f',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'black',
  },
});

export default React.forwardRef(RoofImageNote);
