import React from 'react';
import Animated, {
    interpolate,
    useAnimatedStyle,
} from 'react-native-reanimated';
import { Gradient } from '../Components/Gradient';
import type { Size } from '../types';

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

const BookSpine2: React.FC<IBookSpine2Props> = ({
    right,
    degrees,
    // containerSize,
}) => {
    const style = useAnimatedStyle(() => {
        const opacity = interpolate(
            Math.abs(degrees.value),
            [0, 150, 180],
            [0, 0, 0.65]
        );
        return {
            opacity,
        };
    });

    const position1 = right
        ? {
              start: { x: 1, y: 0 },
              end: { x: 0, y: 0 },
          }
        : {
              start: { x: 0, y: 0 },
              end: { x: 1, y: 0 },
          };

    const position2 = !right
        ? {
              start: { x: 1, y: 0 },
              end: { x: 0, y: 0 },
          }
        : {
              start: { x: 0, y: 0 },
              end: { x: 1, y: 0 },
          };

    return (
        <Animated.View
            pointerEvents="none"
            style={[
                {
                    position: 'absolute',
                    height: '100%',
                    width: '100%',
                    zIndex: 10000000,
                    flexDirection: 'row',
                },
                style,
            ]}
        >
            <Gradient
                {...position1}
                colors={shadowColors}
                style={{
                    width: '100%',
                    height: '100%',
                }}
            />
            <Gradient
                {...position2}
                colors={shadowColors}
                style={[
                    {
                        width: '100%',
                        height: '100%',
                        position: 'absolute',
                    },
                    right ? { left: '100%' } : { right: '100%' },
                ]}
            />
        </Animated.View>
    );
};

export { BookSpine2 };
