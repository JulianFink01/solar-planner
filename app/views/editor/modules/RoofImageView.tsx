import * as React from 'react';
import Realm from 'realm';
import {
  Dimensions,
  ImageBackground,
  ImageLoadEventData,
  NativeSyntheticEvent,
  StyleSheet,
} from 'react-native';
import ViewPainter from './ViewPainter';
import {Roof} from '../../../models/Roof';
import {User} from '../../../models/User';
import {RoofImage} from '../../../models/RoofImage';
var RNFS = require('react-native-fs');

type Props = {
  roof: Roof;
  roofImage: RoofImage;
  user: User;
  debugView: boolean;
  lockMode: boolean;
  displayGrid: boolean;
  opacity: number;
  hasActivePanel: (val: boolean) => any;
  onSolarPanelsUpdate: (panels: SolarPanelMinimal[]) => any;
};

function RoofImageView(
  {
    user,
    roof,
    debugView,
    lockMode,
    onSolarPanelsUpdate,
    displayGrid,
    roofImage,
    opacity,
    hasActivePanel,
  }: Props,
  ref: React.Ref<any>,
): React.JSX.Element {
  const viewPainter = React.useRef<any>(null);

  const [imageSize, setImageSize] = React.useState<Dimension>();

  function onImageLoad(event: NativeSyntheticEvent<ImageLoadEventData>) {
    const width = event?.nativeEvent?.source?.width;
    const heigth = event?.nativeEvent?.source?.height;

    const screenWidth = Dimensions.get('screen').width;

    // calculate ratio betwen screen witdth and imageWidth
    const ratio = screenWidth / width; // we know screen width is x bigger then width

    const imageWidth = screenWidth;
    const imageHeight = heigth * ratio;

    const dimensions: Dimension = {width: imageWidth, height: imageHeight};
    setImageSize(dimensions);
  }

  React.useImperativeHandle(ref, () => ({
    regenerateGrid(
      panelPlacement: 'horizontal' | 'vertical',
      placementHorizontal:
        | 'align-horizontal-left'
        | 'align-horizontal-center'
        | 'align-horizontal-right',
      placementVertical:
        | 'align-vertical-top'
        | 'align-vertical-center'
        | 'align-vertical-bottom',
      save: boolean,
    ) {
      regenerateGrid(panelPlacement, placementHorizontal, placementVertical);
    },
    save() {
      viewPainter.current.save();
    },
    addNewPanel(panelPlacement: 'horizontal' | 'vertical') {
      viewPainter.current?.addNewPanel(panelPlacement);
    },
    deleteActivePanel() {
      viewPainter.current.deleteActivePanel();
    },
    presentSnackBar(message: string) {
      viewPainter.current?.presentSnackBar(message);
    },
  }));

  function regenerateGrid(
    panelPlacement: 'horizontal' | 'vertical',
    placementHorizontal:
      | 'align-horizontal-left'
      | 'align-horizontal-center'
      | 'align-horizontal-right',
    placementVertical:
      | 'align-vertical-top'
      | 'align-vertical-center'
      | 'align-vertical-bottom',
  ) {
    viewPainter?.current?.regenerateGrid(
      panelPlacement,
      placementHorizontal,
      placementVertical,
    );
  }

  if (!user || !roof) {
    return <></>;
  }

  return (
    <ImageBackground
      onLoad={onImageLoad}
      resizeMode="contain"
      style={{flex: 1, maxHeight: imageSize?.height}}
      source={{uri: `${RNFS.DocumentDirectoryPath}/${roofImage.src}`}}>
      {imageSize != null && (
        <ViewPainter
          onSolarPanelsUpdate={onSolarPanelsUpdate}
          hasActivePanel={hasActivePanel}
          opacity={opacity}
          key={'viewpainter'}
          roofImage={roofImage}
          ref={viewPainter}
          debugView={debugView}
          roof={roof}
          lockMode={lockMode}
          imageSize={imageSize}
          displayGrid={displayGrid}
        />
      )}
    </ImageBackground>
  );
}

export default React.forwardRef(RoofImageView);
