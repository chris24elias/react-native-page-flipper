import React from 'react';
import LinearGradient, {
    LinearGradientProps,
} from 'react-native-linear-gradient';

const Gradient: React.FC<LinearGradientProps> = (props) => {
    return <LinearGradient {...props} />;
};

export { Gradient };
