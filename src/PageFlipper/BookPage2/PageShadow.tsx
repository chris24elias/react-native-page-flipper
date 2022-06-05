import React from 'react';
import Animated, { interpolate, useAnimatedStyle } from 'react-native-reanimated';
import { Gradient } from '../Components/Gradient';

type PageShadowProps = {
  degrees: Animated.SharedValue<number>;
  width: number;
  viewHeight: number;
  right: boolean;
};
const rightPosition = {
  start: { x: 0, y: 0 },
  end: { x: 1, y: 0 },
};

const leftPosition = {
  start: { x: 1, y: 0 },
  end: { x: 0, y: 0 },
};
const PageShadow: React.FC<PageShadowProps> = ({ degrees, width, viewHeight, right }) => {
  const colors = ['rgba(0,0,0,0.0)', 'rgba(0,0,0,0.6)'];
  const shadowWidth = 20;
  const position = right ? rightPosition : leftPosition;
  const animatedStyle = useAnimatedStyle(() => {
    const opacity = interpolate(Math.abs(degrees.value), [0, 30, 70, 180], [0, 0, 1, 0]);
    const val = degrees.value;
    const x = right
      ? interpolate(val, [0, 180], [0, -width])
      : interpolate(val, [-180, 0], [width, 0]);
    return {
      opacity,
      transform: [
        {
          translateX: x,
        },
      ],
    };
  });

  return (
    <Animated.View
      style={[
        {
          zIndex: 2,
          height: viewHeight,
          position: 'absolute',
          width: shadowWidth,
        },
        right ? { right: 0 } : { left: 0 },
        animatedStyle,
      ]}
    >
      <Gradient
        {...position}
        colors={colors}
        style={{
          right: 0,
          width: '100%',
          height: '100%',
          position: 'absolute',
        }}
      />
    </Animated.View>
  );
};
export default PageShadow;
