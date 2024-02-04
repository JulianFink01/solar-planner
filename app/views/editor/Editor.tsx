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
import {  Appbar, Avatar, Button, Card, List, Text} from 'react-native-paper';
import { GlobalStyles } from '../../style/GlobalStyle';
import AppBar from '../../componentes/appBar/AppBar';
import { StackScreenProps } from '@react-navigation/stack';
import {Canvas, Circle, Fill, Path, Skia} from "@shopify/react-native-skia";
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, { useAnimatedStyle, useSharedValue } from 'react-native-reanimated';
import RoofSelector from './RoofSelector';
import Information from './Information';
import { ThemeDark } from '../../themes/ThemeDark';


function Editor({navigation, changeTab}: StackScreenProps): React.JSX.Element {

  const { t } = useTranslation();
  const [imageSize, setImageSize] = React.useState<Dimension>();

  const [lockMode, setLockMode] = React.useState<boolean>(false); // prevents anything from being modified
  const [displayGrid, setDisplayGrid] = React.useState<boolean>(true); // if alse also prevents anything from being modified. If true the roof wil get higliited
  const [displayInfo, setDisplayInfo] = React.useState<boolean>(true); // If true displays a information modal for the roof

  const information = React.useRef<any>(null);

  React.useEffect(() => {
    if(displayInfo){
      information.current.open();
    }else {
      information.current.close();
    }
  }, [displayInfo]);

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

  const activeColor = ThemeDark.colors.inversePrimary;
  const inactiveColor = ThemeDark.colors.outline;

  return (

    <View style={GlobalStyles.pageWrapper}>
      <AppBar title={t('editor:title')}>
        <Appbar.Action icon={displayInfo ? 'information-off' : 'information'} color={displayInfo ? activeColor : inactiveColor} onPress={() => {setDisplayInfo(!displayInfo)}} />
        <Appbar.Action icon={!lockMode ?'lock' : 'lock-open' } color={lockMode ? activeColor : inactiveColor} onPress={() => {setLockMode(!lockMode)}} />
        <Appbar.Action icon={displayGrid ? 'grid-off' : 'grid'} color={displayGrid ? inactiveColor : activeColor} onPress={() => {setDisplayGrid(!displayGrid)}} />
        <Appbar.Action style={{backgroundColor: ThemeDark.colors.primary}} color={ThemeDark.colors.background} icon={'content-save'} onPress={() => {save()}} />
      </AppBar>
    

      <View  style={{
          width: '100%',
          height: '100%',
          position: 'relative',
        }}>
          <ImageBackground 
              onLoad={onImageLoad}
              resizeMode="contain" 
              style={{flex: 1, height: '90%'}} 
              source={{uri: 'https://st2.depositphotos.com/20602302/47738/i/450/depositphotos_477380366-stock-photo-half-cleaned-house-roof-shows.jpg'}}>
                {imageSize != null && <RoofSelector
                                          lockMode={lockMode}
                                          imageSize={imageSize}
                                          displayGrid={displayGrid}
                                        />}
                <Information ref={information} onClose={() => {setDisplayInfo(false)}}/>                        
          </ImageBackground>
      </View>
  </View>
  );
}

const styles = StyleSheet.create({
 
});

export default Editor;
