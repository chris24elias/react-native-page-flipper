import React from 'react';
import Animated, { interpolate, useAnimatedStyle } from 'react-native-reanimated';
import { Gradient } from '../Components/Gradient';

type PageShadowProps = {
  degrees: Animated.SharedValue<number>;
  width: number;
  viewHeight: number;
  right: boolean;
};
// const rightPosition = {
//   start: { x: 0, y: 0 },
//   end: { x: 1, y: 0 },
// };

// const leftPosition = {
//   start: { x: 1, y: 0 },
//   end: { x: 0, y: 0 },
// };
const PageShadow: React.FC<PageShadowProps> = ({ degrees, viewHeight, right }) => {
  const colors = right
    ? ['rgba(0,0,0,0.0)', 'rgba(0,0,0,0.6)']
    : ['rgba(0,0,0,0.6)', 'rgba(0,0,0,0)'];
  const shadowWidth = 20;
  // const position = right ? rightPosition : leftPosition;
  const animatedStyle = useAnimatedStyle(() => {
    const opacity = interpolate(Math.abs(degrees.value), [0, 30, 70, 180], [0, 0, 1, 0]);
    return {
      opacity,
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
        right ? { left: -shadowWidth } : { right: -shadowWidth },
        animatedStyle,
      ]}
    >
      <Gradient
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        colors={colors}
        style={{
          flex: 1,
        }}
      />
    </Animated.View>
  );
};
export default PageShadow;
