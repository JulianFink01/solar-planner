import * as React from 'react';
import { useTranslation } from 'react-i18next';
import {
  Dimensions,
  ImageBackground,
  ImageLoadEventData,
  NativeSyntheticEvent,
  Platform,
  ScrollView,
  StyleSheet,
  View,
  useWindowDimensions,
} from 'react-native';
import {  Appbar} from 'react-native-paper';
import { GlobalStyles } from '../../style/GlobalStyle';
import AppBar from '../../componentes/appBar/AppBar';
import { StackScreenProps } from '@react-navigation/stack';
import ViewPainter from './modules/ViewPainter';
import Information from './Information';
import { ThemeDark } from '../../themes/ThemeDark';
import { Roof } from '../../models/Roof';
import { User } from '../../models/User';
import { useObject } from '@realm/react';
import EditorSettings from './EditorSettings';
import Realm from 'realm';

function Editor({navigation, changeTab, route}: StackScreenProps): React.JSX.Element {

  const { t } = useTranslation();
  const [imageSize, setImageSize] = React.useState<Dimension>();

  const roofId = route?.params?.roof?._id;
  const userId = route.params?.user?._id;

  const roof = roofId ? useObject(Roof, new Realm.BSON.UUID(roofId)): null;
  const user = userId ? useObject(User, new Realm.BSON.UUID(userId)): null;

  const [lockMode, setLockMode] = React.useState<boolean>(false); // prevents anything from being modified
  const [displayEditorSettings, setDisplayEditorSettings] = React.useState<boolean>(false); // prevents anything from being modified
  const [displayGrid, setDisplayGrid] = React.useState<boolean>(true); // if alse also prevents anything from being modified. If true the roof wil get higliited
  const [displayInfo, setDisplayInfo] = React.useState<boolean>(false); // If true displays a information modal for the roof
  const [debugView, setDebugView] = React.useState<boolean>(false); // If true displays the non transformed Matrix in color green


  const viewPainter = React.useRef<any>(null);
  const information = React.useRef<any>(null);
  const editorSettings = React.useRef<any>(null);

  React.useEffect(() => {
    if(displayInfo){
      information.current.open();
    }else {
      information.current.close();
    }
  }, [displayInfo]);

  React.useEffect(() => {
    if(displayEditorSettings){
      editorSettings.current.open();
    }else {
      editorSettings.current.close();
    }
  }, [displayEditorSettings]);

  function onImageLoad(event: NativeSyntheticEvent<ImageLoadEventData>){

      const width = event?.nativeEvent?.source?.width;
      const heigth = event?.nativeEvent?.source?.height;

      const screenWidth = Dimensions.get('screen').width;

      // calculate ratio betwen screen witdth and imageWidth
      const ratio = screenWidth / width; // we know screen width is x bigger then width
      
      const imageWidth = screenWidth;
      const imageHeight = heigth * ratio;

      const dimensions: Dimension = {width: imageWidth , height: imageHeight};
      setImageSize(dimensions);
  }

  function save(){

  }

  function regenerateGrid(panelPlacement: 'horizontal' | 'vertical', placementHorizontal: string, placementVertical: 'string'){
    viewPainter.current.regenerateGrid(panelPlacement, placementHorizontal, placementVertical);
  }

  const activeColor = ThemeDark.colors.inversePrimary;
  const inactiveColor = ThemeDark.colors.outline;

  if(!user || !roof){
    return <></>;
  }

  return (

    <View style={GlobalStyles.pageWrapper}>
      <AppBar title={t('editor:title')} left={<Appbar.Action icon={'arrow-left'} onPress={() => {navigation.goBack()}} />}>
        <Appbar.Action icon={debugView ? 'eye-outline' : 'eye'} color={debugView ? activeColor : inactiveColor} onPress={() => {setDebugView(!debugView)}} />
        <Appbar.Action icon={displayEditorSettings ? 'tape-measure' : 'tape-measure'} color={displayEditorSettings ? activeColor : inactiveColor} onPress={() => {setDisplayEditorSettings(!displayEditorSettings)}} />
        <Appbar.Action icon={displayInfo ? 'information-off' : 'information'} color={displayInfo ? activeColor : inactiveColor} onPress={() => {setDisplayInfo(!displayInfo)}} />
        <Appbar.Action icon={!lockMode ?'lock' : 'lock-open' } color={lockMode ? activeColor : inactiveColor} onPress={() => {setLockMode(!lockMode)}} />
        <Appbar.Action icon={displayGrid ? 'grid-off' : 'grid'} color={displayGrid ? inactiveColor : activeColor} onPress={() => {setDisplayGrid(!displayGrid)}} />
      </AppBar>
    

      <View  style={{
          flex: 1,
          position: 'relative',
        }}>
          <ImageBackground 
              onLoad={onImageLoad}
              resizeMode="contain"
              style={{flex: 1, maxHeight: imageSize?.height}} 
              source={{uri: 'https://st2.depositphotos.com/20602302/47738/i/450/depositphotos_477380366-stock-photo-half-cleaned-house-roof-shows.jpg'}}>
                {imageSize != null && <ViewPainter
                                          ref={viewPainter}
                                          debugView={debugView}
                                          roof={roof}
                                          lockMode={lockMode}
                                          imageSize={imageSize}
                                          displayGrid={displayGrid}
                                        />}
                <Information  ref={information} 
                              onClose={() => {setDisplayInfo(false)}}
                              user={user}
                              roof={roof}
                              /> 
                <EditorSettings  ref={editorSettings} 
                                 regenerateGrid={regenerateGrid}
                                 onClose={() => {setDisplayEditorSettings(false)}}
                                 user={user}
                                 roof={roof}
                                 />                        
          </ImageBackground>
      </View>
  </View>
  );
}

const styles = StyleSheet.create({
 
});

export default Editor;
