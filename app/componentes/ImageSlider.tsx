import * as React from 'react';
import {
  Animated,
  Dimensions,
  Image,
  Keyboard,
  StyleSheet,
  View,
} from 'react-native';
import {PanGestureHandler} from 'react-native-gesture-handler';
import {GestureEvent} from 'react-native-gesture-handler/lib/typescript/handlers/gestureHandlerCommon';
import Value = Animated.Value;
import {IconButton, Text} from 'react-native-paper';
import {ThemeDark} from '../themes/ThemeDark';
var RNFS = require('react-native-fs');

interface ImageSliderProps {
  images: string[];
  removeImage: (url: string) => any;
  width: number;
}

interface ImageSliderState {
  currentTranslationX: Value;
  translationX: Value;
  currentActiveFileIndex: number;
}

class ImageSlider extends React.Component<ImageSliderProps, ImageSliderState> {
  state = {
    translationX: new Animated.Value(0),
    currentTranslationX: new Animated.Value(0),
    currentActiveFileIndex: 0,
  };
  imageContainers = [];
  windowWidth = Dimensions.get('window').width;

  sliderRef: React.RefObject<PanGestureHandler>;

  constructor(props: ImageSliderProps) {
    super(props);
    // @ts-ignore
    this.props = props;
    this.sliderRef = React.createRef();
  }

  onGesture(event: any) {
    if (this.props.images.length > 1) {
      // @ts-ignore
      const value =
        this.state.translationX._value + event.nativeEvent.translationX;
      this.state.currentTranslationX.setValue(value);
    }
  }

  removeImage(url: string, index: number) {
    this.props.removeImage(url, index);
  }

  onEnded(event: GestureEvent) {
    if (this.props.images.length > 1) {
      // @ts-ignore
      let translationX: number = this.state.translationX._value;
      if (translationX < 0) {
        translationX *= -1;
      }
      let newValue: number;

      if (event.nativeEvent.translationX < 0) {
        // Swipe Left
        newValue = (translationX + this.props.width) * -1;
      } else {
        // Swipe Right
        newValue = (translationX - this.props.width) * -1;
      }

      //reset front / back
      if (newValue > 0) {
        newValue = 0;
      } else if (
        newValue <
        this.props.width * (this.props.images.length - 1) * -1
      ) {
        newValue += this.props.width - ((-1 * newValue) % this.props.width);
      }

      this.state.translationX.setValue(newValue);

      // calculate index
      const absoluteValue = newValue < 0 ? newValue * -1 : newValue;
      this.setState(s => ({
        ...s,
        currentActiveFileIndex: absoluteValue / this.props.width,
      }));

      Animated.timing(this.state.currentTranslationX, {
        toValue: newValue,
        duration: 200,
        useNativeDriver: true,
      }).start();
    }
  }

  close() {
    Keyboard.dismiss();
  }

  render() {
    return (
      <View style={{flex: 1, position: 'relative', width: this.props.width}}>
        <View style={styles.absoluteHeader}>
          <View>
            {this.props.images.length > 0 && (
              <IconButton
                iconColor={ThemeDark.colors.background}
                style={{
                  marginLeft: 10,
                  backgroundColor: ThemeDark.colors.error,
                }}
                onPress={() => {
                  this.removeImage(
                    this.props.images[this.state.currentActiveFileIndex],
                    this.state.currentActiveFileIndex,
                  );
                }}
                icon={'delete'}
              />
            )}
          </View>

          <View
            style={{
              backgroundColor: ThemeDark.colors.background,
              borderRadius: 50,
              overflow: 'hidden',
              display: 'flex',
              alignContent: 'center',
              alignItems: 'center',
            }}>
            {this.props.images.length > 0 && (
              <Text
                style={{
                  backgroundColor: ThemeDark.colors.background,
                  padding: 10,
                  borderRadius: 10,
                }}
                variant={'titleMedium'}>
                {this.state.currentActiveFileIndex + 1}/
                {this.props.images.length}
              </Text>
            )}
          </View>
        </View>

        <PanGestureHandler
          ref={this.sliderRef}
          onGestureEvent={this.onGesture.bind(this)}
          onEnded={this.onEnded.bind(this)}>
          <Animated.View
            style={{
              ...styles.viewContainer,
              transform: [{translateX: this.state.currentTranslationX}],
            }}>
            {this.props?.images?.map((image, index) => {
              console.log(image);
              return (
                <Image
                  onError={e => console.log(e.nativeEvent)}
                  resizeMode="cover"
                  key={image + index}
                  src={image}
                  style={{width: '100%', height: '100%'}}
                />
              );
            })}
          </Animated.View>
        </PanGestureHandler>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  viewContainer: {
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'nowrap',
    alignItems: 'center',
    overflow: 'visible',
  },
  absoluteHeader: {
    top: 0,
    left: 0,
    right: 0,
    position: 'absolute',
    zIndex: 999,
    paddingLeft: 10,
    paddingRight: 10,
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    flexDirection: 'row',
    paddingBottom: 18,
    overflow: 'hidden',
  },
});
export default ImageSlider;
