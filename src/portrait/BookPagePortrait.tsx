import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Pressable, StyleSheet, View, ViewStyle } from 'react-native';
import {
    PanGestureHandler,
    PanGestureHandlerGestureEvent,
} from 'react-native-gesture-handler';
import Animated, {
    Easing,
    Extrapolate,
    interpolate,
    runOnJS,
    useAnimatedGestureHandler,
    useAnimatedStyle,
    useDerivedValue,
    useSharedValue,
    withTiming,
    WithTimingConfig,
} from 'react-native-reanimated';
import type { Page, Size } from '../types';
import BackShadow from '../BookPage/BackShadow';
import FrontShadow from '../BookPage/FrontShadow';
import PageShadow from '../BookPage/PageShadow';
import { clamp, snapPoint } from '../utils/utils';

export type IBookPageProps = {
    current: Page;
    prev: Page;
    onPageFlip: any;
    containerSize: Size;
    setIsAnimating: (val: boolean) => void;
    isAnimating: boolean;
    enabled: boolean;
    isPressable: boolean;
    getPageStyle: (right: boolean, front: boolean) => any;
    isAnimatingRef: React.MutableRefObject<boolean>;
    next: Page;
    onFlipStart?: (id: number) => void;
    onPageDragStart?: () => void;
    onPageDrag?: () => void;
    onPageDragEnd?: () => void;
    renderPage?: (data: any) => any;
};

export type PortraitBookInstance = { turnPage: (index: 1 | -1) => void };

const timingConfig: WithTimingConfig = {
    duration: 800,
    easing: Easing.inOut(Easing.cubic),
};

const BookPagePortrait = React.forwardRef<PortraitBookInstance, IBookPageProps>(
    (
        {
            current,
            prev,
            onPageFlip,
            containerSize,
            enabled,
            isPressable,
            setIsAnimating,
            getPageStyle,
            isAnimating,
            isAnimatingRef,
            next,
            onFlipStart,
            onPageDrag,
            onPageDragEnd,
            onPageDragStart,
            renderPage,
        },
        ref
    ) => {
        const containerWidth = containerSize.width;

        const pSnapPoints = !prev
            ? [-containerSize.width, 0]
            : [-containerSize.width, 0, containerSize.width];

        const x = useSharedValue(0);

        const isMounted = useRef(false);
        const rotateYAsDeg = useSharedValue(0);

        // might not need this
        // useEffect(() => {
        //   if (!enabled) {
        //     setIsDragging(false);
        //   }
        // }, [enabled]);

        const turnPage = useCallback(
            (id: 1 | -1) => {
                setIsAnimating(true);
                if (onFlipStart && typeof onFlipStart === 'function') {
                    onFlipStart(id);
                }
                rotateYAsDeg.value = withTiming(
                    id < 0 ? -180 : 180,
                    timingConfig,
                    () => {
                        runOnJS(onPageFlip)(id, false);
                    }
                );
            },
            [onFlipStart, onPageFlip, rotateYAsDeg, setIsAnimating]
        );

        React.useImperativeHandle(
            ref,
            () => ({
                turnPage,
            }),
            [turnPage]
        );

        useEffect(() => {
            isMounted.current = true;
            return () => {
                isMounted.current = false;
            };
        }, []);

        const getDegreesForX = (x: number) => {
            'worklet';

            const val = interpolate(
                x,
                [-containerSize.width, 0, containerSize.width],
                [180, 0, -180],
                Extrapolate.CLAMP
            );
            return val;
        };

        const containerStyle = useAnimatedStyle(() => {
            return {
                flex: 1,
            };
        });

        const onPanGestureHandler = useAnimatedGestureHandler<
            PanGestureHandlerGestureEvent,
            { x: number }
        >({
            // @ts-ignore
            onStart: (event, ctx) => {
                ctx.x = x.value;
                if (onPageDragStart && typeof onPageDragStart === 'function') {
                    runOnJS(onPageDragStart)();
                }
            },
            onActive: (event, ctx) => {
                const newX = ctx.x + event.translationX;
                const degrees = getDegreesForX(newX);
                x.value = newX;
                rotateYAsDeg.value = degrees;
                if (onPageDrag && typeof onPageDrag === 'function') {
                    runOnJS(onPageDrag)();
                }
            },
            onEnd: (event) => {
                if (onPageDragEnd && typeof onPageDragEnd === 'function') {
                    runOnJS(onPageDragEnd)();
                }

                const snapTo = snapPoint(x.value, event.velocityX, pSnapPoints);
                const id = snapTo > 0 ? -1 : snapTo < 0 ? 1 : 0;

                if (!next && id > 0) {
                    // reset
                    x.value = withTiming(0);
                    rotateYAsDeg.value = withTiming(0);
                    // runOnJS(onDrag)(false);
                    return;
                }

                const degrees = getDegreesForX(snapTo);
                x.value = snapTo;
                if (rotateYAsDeg.value === degrees) {
                    // already same value
                    // debugValue('already there');
                    runOnJS(onPageFlip)(id, false);
                } else {
                    runOnJS(setIsAnimating)(true);

                    const progress =
                        Math.abs(rotateYAsDeg.value - degrees) / 100;
                    const duration = clamp(
                        800 * progress - Math.abs(0.1 * event.velocityX),
                        350,
                        1000
                    );
                    rotateYAsDeg.value = withTiming(
                        degrees,
                        {
                            ...timingConfig,
                            duration: duration,
                        },
                        () => {
                            if (snapTo === 0) {
                                //
                            }
                            runOnJS(onPageFlip)(id, false);
                        }
                    );
                }
            },
        });

        const gesturesEnabled = enabled && !isAnimating;

        const iPageProps = {
            containerSize,
            containerWidth,
            getPageStyle,
            rotateYAsDeg,
            renderPage,
        };

        return (
            <Animated.View style={containerStyle}>
                <PanGestureHandler
                    onGestureEvent={onPanGestureHandler}
                    enabled={gesturesEnabled}
                >
                    <Animated.View style={containerStyle}>
                        {isPressable && prev && (
                            <Pressable
                                disabled={isAnimating}
                                onPress={() => {
                                    if (!isAnimatingRef.current) turnPage(-1);
                                }}
                                style={{
                                    position: 'absolute',
                                    height: '100%',
                                    width: '25%',
                                    zIndex: 10000,
                                    left: 0,
                                    // backgroundColor: 'red',
                                    // opacity: 0.2,
                                }}
                            />
                        )}
                        {isPressable && next && (
                            <Pressable
                                disabled={isAnimating}
                                onPress={() => {
                                    if (!isAnimatingRef.current) turnPage(1);
                                }}
                                style={{
                                    position: 'absolute',
                                    height: '100%',
                                    width: '30%',
                                    zIndex: 10000,
                                    right: 0,
                                    // backgroundColor: 'blue',
                                    // opacity: 0.2,
                                }}
                            />
                        )}
                        {current && next ? (
                            <IPage
                                page={current}
                                right={true}
                                {...iPageProps}
                            />
                        ) : (
                            <View style={{ height: '100%', width: '100%' }}>
                                {renderPage && (
                                    <View style={getPageStyle(true, true)}>
                                        {renderPage(current.right)}
                                    </View>
                                )}
                            </View>
                        )}
                        {prev && (
                            <IPage page={prev} right={false} {...iPageProps} />
                        )}
                    </Animated.View>
                </PanGestureHandler>
            </Animated.View>
        );
    }
);

type IPageProps = {
    right: boolean;
    page: Page;
    rotateYAsDeg: Animated.SharedValue<number>;
    containerWidth: number;
    containerSize: Size;
    getPageStyle: any;
    renderPage?: (data: any) => any;
};

const IPage: React.FC<IPageProps> = ({
    right,
    page,
    rotateYAsDeg,
    containerWidth,
    containerSize,
    getPageStyle,
    renderPage,
}) => {
    const [loaded, setLoaded] = useState(right);

    useEffect(() => {
        // hack fix
        setTimeout(() => {
            setLoaded(true);
        }, 50);
    }, []);

    const rotationVal = useDerivedValue(() => {
        const val = right
            ? rotateYAsDeg.value
            : interpolate(rotateYAsDeg.value, [-180, 0], [0, 180]);
        return val;
    });

    const portraitBackStyle = useAnimatedStyle(() => {
        const x = interpolate(
            rotationVal.value,
            [0, 180],
            [containerWidth, -containerWidth / 2]
        );
        const w = interpolate(
            rotationVal.value,
            [0, 180],
            [0, containerWidth / 2]
        );

        return {
            width: Math.ceil(w),
            zIndex: 2,
            opacity: 1,
            transform: [{ translateX: x }],
        };
    });

    const portraitFrontStyle = useAnimatedStyle(() => {
        const w = interpolate(
            rotationVal.value,
            [0, 160],
            [containerWidth, -20],
            Extrapolate.CLAMP
        );

        const style: ViewStyle = {
            zIndex: 1,
            width: Math.floor(w),
        };

        if (!right) {
            style['left'] = 0;
        } else {
            // style['right'] = 0;
        }

        return style;
    });

    const frontPageStyle = getPageStyle(right, true);
    const backPageStyle = getPageStyle(right, false);

    if (!loaded) {
        // hack fix
        return null;
    }

    const shadowProps = {
        right: true,
        degrees: rotationVal,
        width: containerSize.width,
        viewHeight: containerSize.height,
    };

    return (
        <View
            style={{
                ...StyleSheet.absoluteFillObject,
                zIndex: !right ? 5 : 0,
            }}
        >
            {/* BACK */}
            <Animated.View
                style={[
                    styles.pageContainer,
                    portraitBackStyle,
                    { overflow: 'visible' },
                ]}
            >
                <View style={styles.pageContainer}>
                    {renderPage && (
                        <Animated.View
                            style={[
                                backPageStyle,

                                {
                                    opacity: 0.2,
                                    transform: [
                                        { rotateX: '180deg' },
                                        { rotateZ: '180deg' },
                                    ],
                                },
                            ]}
                        >
                            {renderPage(page.left)}
                        </Animated.View>
                    )}
                </View>
                <BackShadow {...{ degrees: rotationVal, right: true }} />
                <FrontShadow {...shadowProps} />
                <PageShadow {...shadowProps} containerSize={containerSize} />
            </Animated.View>
            {/* FRONT */}
            <Animated.View style={[styles.pageContainer, portraitFrontStyle]}>
                {renderPage && (
                    <Animated.View style={[frontPageStyle]}>
                        {renderPage(page.left)}
                    </Animated.View>
                )}
            </Animated.View>
        </View>
    );
};

export { BookPagePortrait };

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    pageContainer: {
        height: '100%',
        width: '100%',
        position: 'absolute',
        backfaceVisibility: 'hidden',
        overflow: 'hidden',
        backgroundColor: 'white',
    },
});
