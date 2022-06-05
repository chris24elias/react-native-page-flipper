import React from 'react';
import {
  // Image as RNImage,
  ImageProps
} from 'react-native';
import Animated from 'react-native-reanimated';

// const AnimatedRNImage = Animated.createAnimatedComponent(RNImage);

const Image: React.FC<ImageProps> = (props) => {
  return <Animated.Image {...props} />;
};

export default Image;
