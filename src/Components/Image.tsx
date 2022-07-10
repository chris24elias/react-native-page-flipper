import React from 'react';
import FastImage, { FastImageProps } from 'react-native-fast-image';
import Animated from 'react-native-reanimated';

// @ts-ignore
const AnimatedFastImage = Animated.createAnimatedComponent(FastImage);

const Image: React.FC<FastImageProps> = ({ source, ...props }) => {
    return (
        <AnimatedFastImage
            {...props}
            source={{
                //@ts-ignore
                ...source,
                priority: 'high',
                // cache: 'cacheOnly',
            }}
            resizeMode="contain"
            // resizeMode="cover"
        />
    );
};

export default React.memo(Image);
