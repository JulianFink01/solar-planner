import * as React from 'react';
import {useTranslation} from 'react-i18next';
import {StyleSheet, View} from 'react-native';
import {Appbar, IconButton, Text} from 'react-native-paper';
import {GlobalStyles} from '../../style/GlobalStyle';
import AppBar from '../../componentes/appBar/AppBar';
import {StackScreenProps} from '@react-navigation/stack';
import Information from './Information';
import {ThemeDark} from '../../themes/ThemeDark';
import {Roof} from '../../models/Roof';
import {User} from '../../models/User';
import {useObject} from '@realm/react';
import EditorSettings from './EditorSettings';
import Realm from 'realm';
import RoofImageView from './modules/RoofImageView';
import {RoofImage} from '../../models/RoofImage';

function Editor({navigation, route}: StackScreenProps<any>): React.JSX.Element {
  const {t} = useTranslation();

  const roofId = route?.params?.roof?._id;
  const userId = route.params?.user?._id;

  const roof = useObject(Roof, new Realm.BSON.UUID(roofId));
  const user = useObject(User, new Realm.BSON.UUID(userId));

  const [lockMode, setLockMode] = React.useState<boolean>(false); // prevents anything from being modified
  const [displayEditorSettings, setDisplayEditorSettings] =
    React.useState<boolean>(false); // prevents anything from being modified
  const [displayGrid, setDisplayGrid] = React.useState<boolean>(true); // if alse also prevents anything from being modified. If true the roof wil get higliited
  const [displayInfo, setDisplayInfo] = React.useState<boolean>(false); // If true displays a information modal for the roof
  const [debugView, setDebugView] = React.useState<boolean>(false); // If true displays the non transformed Matrix in color green
  const [selectedImage, setSelectedImage] = React.useState<RoofImage>(
    roof?.roofImages[0],
  );

  const roofImageView = React.useRef<any>(null);
  const information = React.useRef<any>(null);
  const editorSettings = React.useRef<any>(null);

  React.useEffect(() => {
    if (displayInfo) {
      information.current.open();
    } else {
      information.current.close();
    }
  }, [displayInfo]);

  React.useEffect(() => {
    if (displayEditorSettings) {
      editorSettings.current.open();
    } else {
      editorSettings.current.close();
    }
  }, [displayEditorSettings]);

  function save() {
    roofImageView.current.save();
  }

  function regenerateGrid(
    panelPlacement: 'horizontal' | 'vertical',
    placementHorizontal: string,
    placementVertical: 'string',
    save: boolean,
  ) {
    roofImageView.current.regenerateGrid(
      panelPlacement,
      placementHorizontal,
      placementVertical,
      save,
    );
  }

  const activeColor = ThemeDark.colors.inversePrimary;
  const inactiveColor = ThemeDark.colors.outline;

  if (!user || !roof) {
    return <></>;
  }

  function Title() {
    const activeIndex = roof?.roofImages.indexOf(selectedImage) ?? -9999999;

    function moveRight() {
      if ((roof?.roofImages?.length ?? -9999) > 0) {
        let newIndex = activeIndex + 1;
        if (newIndex >= roof?.roofImages.length) {
          newIndex = 0;
        }
        setSelectedImage(roof?.roofImages[newIndex]);
      }
    }

    function moveLeft() {
      if ((roof?.roofImages?.length ?? -9999) > 0) {
        let newIndex = activeIndex - 1;
        if (newIndex < 0) {
          newIndex = roof?.roofImages.length - 1;
        }
        setSelectedImage(roof?.roofImages[newIndex]);
      }
    }

    return (
      <View
        style={{display: 'flex', flexDirection: 'row', alignItems: 'center'}}>
        <Text variant="titleLarge">{t('editor:title')}</Text>
        {roof?.roofImages?.length > 1 && (
          <View
            style={{
              marginLeft: 100,
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'center',
            }}>
            <IconButton icon={'arrow-left'} onPress={moveLeft} />
            <Text variant="titleLarge">
              {t('roofs:image')} {activeIndex + 1}/{roof?.roofImages.length}
            </Text>
            <IconButton icon={'arrow-right'} onPress={moveRight} />
          </View>
        )}
      </View>
    );
  }

  return (
    <View style={GlobalStyles.pageWrapper}>
      <AppBar
        title={<Title />}
        left={
          <Appbar.Action
            icon={'arrow-left'}
            onPress={() => {
              navigation.goBack();
            }}
          />
        }>
        <Appbar.Action
          icon={debugView ? 'eye-outline' : 'eye'}
          color={debugView ? activeColor : inactiveColor}
          onPress={() => {
            setDebugView(!debugView);
          }}
        />
        <Appbar.Action
          icon={displayEditorSettings ? 'tape-measure' : 'application-settings'}
          color={displayEditorSettings ? activeColor : inactiveColor}
          onPress={() => {
            setDisplayEditorSettings(!displayEditorSettings);
          }}
        />
        <Appbar.Action
          icon={displayInfo ? 'information-off' : 'information'}
          color={displayInfo ? activeColor : inactiveColor}
          onPress={() => {
            setDisplayInfo(!displayInfo);
          }}
        />
        <Appbar.Action
          icon={!lockMode ? 'lock' : 'lock-open'}
          color={lockMode ? activeColor : inactiveColor}
          onPress={() => {
            setLockMode(!lockMode);
          }}
        />
        <Appbar.Action
          icon={displayGrid ? 'grid-off' : 'grid'}
          color={displayGrid ? inactiveColor : activeColor}
          onPress={() => {
            setDisplayGrid(!displayGrid);
          }}
        />
        <Appbar.Action
          style={{backgroundColor: ThemeDark.colors.primary}}
          color={ThemeDark.colors.background}
          icon={'content-save'}
          onPress={() => {
            save();
          }}
        />
      </AppBar>

      <View
        style={{
          flex: 1,
          position: 'relative',
        }}>
        <RoofImageView
          key={selectedImage.src}
          ref={roofImageView}
          roof={roof}
          roofImage={selectedImage}
          user={user}
          displayGrid={displayGrid}
          debugView={debugView}
          lockMode={lockMode}
        />

        <Information
          ref={information}
          onClose={() => {
            setDisplayInfo(false);
          }}
          user={user}
          roof={roof}
          roofImage={selectedImage}
        />
        <EditorSettings
          ref={editorSettings}
          regenerateGrid={regenerateGrid}
          onClose={() => {
            setDisplayEditorSettings(false);
          }}
          user={user}
          roof={roof}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({});

export default Editor;
