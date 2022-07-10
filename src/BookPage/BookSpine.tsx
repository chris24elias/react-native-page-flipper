import React from 'react';
import { View } from 'react-native';
import { Gradient } from '../Components/Gradient';
import type { Size } from '../types';

export type IBookSpineProps = {
    right: boolean;
    containerSize: Size;
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

const BookSpine: React.FC<IBookSpineProps> = ({ right, containerSize }) => {
    return (
        <View
            pointerEvents="none"
            style={[
                {
                    position: 'absolute',
                    height: '100%',
                    width: containerSize.width / 2,
                    zIndex: 1,
                    opacity: 0.6,
                },
                right ? { left: 0 } : { right: 0 },
            ]}
        >
            <Gradient
                start={{ x: right ? 0 : 1, y: 0 }}
                end={{ x: right ? 1 : 0, y: 0 }}
                colors={shadowColors}
                style={{
                    flex: 1,
                }}
            />
        </View>
    );
};

export { BookSpine };
