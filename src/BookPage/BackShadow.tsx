import React from 'react';
import { StyleSheet } from 'react-native';
import Animated, {
    interpolate,
    useAnimatedStyle,
} from 'react-native-reanimated';
import { Gradient } from '../Components/Gradient';

type BackShadowProps = {
    degrees: Animated.SharedValue<number>;
    right: boolean;
};

const colors = ['rgba(0,0,0,0.0)', 'rgba(0,0,0,0.2)', 'rgba(0,0,0,0.7)'];

const rightPosition = {
    start: { x: 0.5, y: 0 },
    end: { x: 1, y: 0 },
};

const leftPosition = {
    start: { x: 0.5, y: 0 },
    end: { x: 0, y: 0 },
};

const BackShadow: React.FC<BackShadowProps> = ({ degrees, right }) => {
    const position = right ? rightPosition : leftPosition;

    const animatedStyle = useAnimatedStyle(() => {
        const opacity = interpolate(
            Math.abs(degrees.value),
            [0, 130, 180],
            [1, 0.5, 0]
        );

        return {
            opacity,
        };
    });

    return (
        <Animated.View
            style={[
                {
                    ...StyleSheet.absoluteFillObject,
                    zIndex: 4,
                },
                animatedStyle,
            ]}
        >
            <Gradient
                {...position}
                colors={colors}
                style={{
                    ...StyleSheet.absoluteFillObject,
                }}
            />
        </Animated.View>
    );
};

export default BackShadow;
