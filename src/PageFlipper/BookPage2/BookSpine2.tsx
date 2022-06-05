import React from 'react';
import Animated, { interpolate, useAnimatedStyle } from 'react-native-reanimated';
import { Gradient } from '../Components/Gradient';
import { Size } from '../types';

export type IBookSpine2Props = {
  right: boolean;
  containerSize: Size;
  degrees: Animated.SharedValue<number>;
};

const shadowColors = [
  'rgba(0,0,0,0.3)',
  'rgba(0,0,0,0.1)',
  'rgba(0,0,0,0)',
  'rgba(0,0,0,0)',
  'rgba(0,0,0,0)',
  'rgba(0,0,0,0)',
  'rgba(0,0,0,0)',
  'rgba(0,0,0,0)',
  'rgba(0,0,0,0)',
  'rgba(0,0,0,0)',
  'rgba(0,0,0,0)',
  'rgba(0,0,0,0)',
  'rgba(0,0,0,0)',
  'rgba(0,0,0,0)',
  'rgba(0,0,0,0)',
  'rgba(0,0,0,0)',
  'rgba(0,0,0,0)',
  'rgba(0,0,0,0)',
  'rgba(0,0,0,0)',
  'rgba(0,0,0,0)',
  'rgba(0,0,0,0)',
  'rgba(0,0,0,0)',
];

const BookSpine2: React.FC<IBookSpine2Props> = ({ right, containerSize, degrees }) => {
  const style = useAnimatedStyle(() => {
    const opacity = interpolate(Math.abs(degrees.value), [0, 170, 180], [0, 0, 1]);
    return {
      opacity,
    };
  });

  return (
    <Animated.View
      pointerEvents="none"
      style={[
        {
          position: 'absolute',
          height: '100%',
          width: containerSize.width,
          zIndex: 10000000,
          flexDirection: 'row',
        },
        right ? { left: -containerSize.width / 4 } : { left: containerSize.width / 4 },
        style,
      ]}
    >
      <Gradient
        start={{ x: 1, y: 0 }}
        end={{ x: 0, y: 0 }}
        colors={shadowColors}
        style={{
          width: containerSize.width / 4,
          height: '100%',
        }}
      />
      <Gradient
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        colors={shadowColors}
        style={{
          width: containerSize.width / 4,
          height: '100%',
        }}
      />
    </Animated.View>
  );
};

export { BookSpine2 };
