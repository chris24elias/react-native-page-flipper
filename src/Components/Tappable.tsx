import React from 'react';
import { StyleProp, StyleSheet, ViewStyle } from 'react-native';
import {
    HandlerStateChangeEvent,
    State,
    TapGestureHandler,
    TapGestureHandlerEventPayload,
    TapGestureHandlerProps,
} from 'react-native-gesture-handler';
import Animated from 'react-native-reanimated';

type TappableProps = {
    onTap: () => void;
    style?: StyleProp<ViewStyle>;
} & TapGestureHandlerProps;

const Tappable: React.FC<TappableProps> = React.forwardRef(
    ({ children, onTap, enabled = true, style }, ref) => {
        const onSingleTap = (
            event: HandlerStateChangeEvent<TapGestureHandlerEventPayload>
        ) => {
            if (event.nativeEvent.state === State.ACTIVE) {
                onTap();
            }
        };
        return (
            <TapGestureHandler
                numberOfTaps={1}
                onHandlerStateChange={onSingleTap}
                ref={ref}
                enabled={enabled}
            >
                <Animated.View style={style}>{children}</Animated.View>
            </TapGestureHandler>
        );
    }
);

export default Tappable;

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
});
