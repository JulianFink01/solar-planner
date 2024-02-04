import * as React from 'react';
import { StackScreenProps } from '@react-navigation/stack';
import { Canvas, Circle } from '@shopify/react-native-skia';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, { useAnimatedStyle, useSharedValue } from 'react-native-reanimated';

const radius = 30;

function Module({navigation, changeTab}: StackScreenProps): React.JSX.Element {

    const x = useSharedValue(100);
    const y = useSharedValue(100);
    // This style will be applied to the "invisible" animated view
    // that overlays the ball
    const style = useAnimatedStyle(() => ({
      top: -radius,
      left: -radius,
      backgroundColor: 'red',
      width: radius * 2,
      height: radius * 2,
      transform: [{translateX: x.value }, { translateY: y.value }],
    }));
  
  
    const gesture = Gesture.Pan().onChange((e) => {
      x.value += e.x;
      y.value += e.y;
    });


    return (
        <>
            <GestureDetector gesture={gesture}>
                <Animated.View style={style} />
            </GestureDetector>
        </>
    );
} 

export default Module;