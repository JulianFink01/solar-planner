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
import { RoofImage } from '../../models/RoofImage';

type Props = {
    roof: Roof,
    roofImage: RoofImage,
    user: User,
    debugView: boolean,
    lockMode: boolean,
    displayGrid: boolean,
}

function RoofImageView({user, roof,  debugView, lockMode, displayGrid, roofImage}: Props, ref: React.Ref<any>): React.JSX.Element {

  const viewPainter = React.useRef<any>(null);

  const [imageSize, setImageSize] = React.useState<Dimension>();

 

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

  React.useImperativeHandle(ref, () => ({
    regenerateGrid(panelPlacement: 'horizontal' | 'vertical', placementHorizontal: string, placementVertical: 'string'){
        viewPainter.current.regenerateGrid(panelPlacement, placementHorizontal, placementVertical);
    },
    save(){
        viewPainter.current.save();
    }
  }));


  function regenerateGrid(panelPlacement: 'horizontal' | 'vertical', placementHorizontal: string, placementVertical: 'string'){
    viewPainter.current.regenerateGrid(panelPlacement, placementHorizontal, placementVertical);
  }

  if(!user || !roof){
    return <></>;
  }


  return (

    <ImageBackground 
              onLoad={onImageLoad}
              resizeMode="contain"
              style={{flex: 1, maxHeight: imageSize?.height}} 
              source={{uri: roofImage.src}}>
                {imageSize != null && <ViewPainter
                                          roofImage={roofImage}
                                          ref={viewPainter}
                                          debugView={debugView}
                                          roof={roof}
                                          lockMode={lockMode}
                                          imageSize={imageSize}
                                          displayGrid={displayGrid}
                                        />}
                      
          </ImageBackground>
  );
}

const styles = StyleSheet.create({
 
});


export default  React.forwardRef(RoofImageView);
