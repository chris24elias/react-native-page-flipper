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
    useSharedValue,
    withTiming,
    WithTimingConfig,
} from 'react-native-reanimated';
import type { Page, Size } from '../types';
import BackShadow from './BackShadow';
import FrontShadow from './FrontShadow';
import PageShadow from './PageShadow';
import { BookSpine } from './BookSpine';
import { BookSpine2 } from './BookSpine2';
import { clamp, snapPoint } from '../utils/utils';
export type IBookPageProps = {
    right: boolean;
    front: Page;
    back: Page;
    onPageFlip: any;
    containerSize: Size;
    isAnimatingRef: React.MutableRefObject<boolean>;
    setIsAnimating: (val: boolean) => void;
    isAnimating: boolean;
    enabled: boolean;
    isPressable: boolean;
    getPageStyle: (right: boolean, front: boolean) => any;
    single: boolean;
    onFlipStart?: (id: number) => void;
    onPageDragStart?: () => void;
    onPageDrag?: () => void;
    onPageDragEnd?: () => void;
    renderPage?: (data: any) => any;
};

export type BookPageInstance = {
    turnPage: () => void;
};

const timingConfig: WithTimingConfig = {
    duration: 800,
    easing: Easing.inOut(Easing.cubic),
};

const BookPage = React.forwardRef<BookPageInstance, IBookPageProps>(
    (
        {
            right,
            front,
            back,
            onPageFlip,
            containerSize,
            isAnimatingRef,
            setIsAnimating,
            isAnimating,
            enabled,
            isPressable,
            getPageStyle,
            single,
            onFlipStart,
            onPageDrag,
            onPageDragEnd,
            onPageDragStart,
            renderPage,
        },
        ref
    ) => {
        const x = useSharedValue(0);
        const isMounted = useRef(false);
        const rotateYAsDeg = useSharedValue(0);
        const [isDragging, setIsDragging] = useState(false);
        const isDraggingRef = useRef(false);
        const containerWidth = containerSize.width;
        const containerHeight = containerSize.height;
        const leftPSnapPoints = [0, containerWidth];
        const rightPSnapPoints = [-containerWidth, 0];
        const pSnapPoints = right ? rightPSnapPoints : leftPSnapPoints;
        const gesturesEnabled = enabled && !isAnimating;
        const showSpine = true;

        // might not need this useEffect
        // useEffect(() => {
        //   if (!enabled) {
        //     setIsDragging(false);
        //   }
        // }, [enabled]);

        useEffect(() => {
            isMounted.current = true;
            return () => {
                isMounted.current = false;
            };
        }, []);

        const turnPage = useCallback(() => {
            setIsDragging(true);
            setIsAnimating(true);
            const id = right ? 1 : -1;

            if (onFlipStart && typeof onFlipStart === 'function') {
                onFlipStart(id);
            }
            rotateYAsDeg.value = withTiming(
                right ? 180 : -180,
                timingConfig,
                () => {
                    runOnJS(onPageFlip)(id, false);
                }
            );
        }, [
            onFlipStart,
            setIsDragging,
            right,
            onPageFlip,
            rotateYAsDeg,
            setIsAnimating,
        ]);

        React.useImperativeHandle(
            ref,
            () => ({
                turnPage,
            }),
            [turnPage]
        );

        const onDrag = useCallback((val: boolean) => {
            if (!isMounted.current) {
                return;
            }

            if (isDraggingRef.current === val) {
                // same value
                return;
            }

            setIsDragging(val);
            isDraggingRef.current = val;
        }, []);

        const backStyle = useAnimatedStyle(() => {
            const degrees = rotateYAsDeg.value;
            const x = right
                ? interpolate(
                      degrees,
                      [0, 180],
                      [containerWidth / 2, -containerWidth / 2]
                  )
                : interpolate(degrees, [-180, 0], [containerWidth / 2, 0]);

            const w = right
                ? interpolate(degrees, [0, 180], [0, containerWidth / 2])
                : interpolate(degrees, [-180, 0], [containerWidth / 2, 0]);
            return {
                width: Math.ceil(w),
                zIndex: 2,
                transform: [{ translateX: x }],
            };
        });

        const frontStyle = useAnimatedStyle(() => {
            const degrees = rotateYAsDeg.value;

            const w = right
                ? interpolate(
                      degrees,
                      [0, 90],
                      [containerWidth / 2, 0],
                      Extrapolate.CLAMP
                  )
                : interpolate(
                      degrees,
                      [-90, 0],
                      [0, containerWidth / 2],
                      Extrapolate.CLAMP
                  );

            const style: ViewStyle = {
                zIndex: 1,
                width: Math.floor(w),
            };

            if (right) {
                style['left'] = 0;
            } else {
                style['right'] = 0;
            }

            return style;
        });

        const containerStyle = useAnimatedStyle(() => {
            return {
                flex: 1,
                // backgroundColor: 'white',
                zIndex: isDragging ? 100 : 0,
            };
        });

        const animatedBackPageStyle = useAnimatedStyle(() => {
            const l = right
                ? 0
                : interpolate(
                      rotateYAsDeg.value,
                      [-180, 0],
                      single
                          ? [0, -containerWidth / 2]
                          : [-containerWidth / 2, -containerWidth]
                  );

            return {
                left: l,
            };
        });

        const onPanGestureHandler = useAnimatedGestureHandler<
            PanGestureHandlerGestureEvent,
            { x: number }
        >({
            // @ts-ignore
            onStart: (event, ctx) => {
                if (onPageDragStart && typeof onPageDragStart === 'function') {
                    runOnJS(onPageDragStart)();
                }
                ctx.x = x.value;
            },
            onActive: (event, ctx) => {
                runOnJS(onDrag)(true);
                x.value = ctx.x + event.translationX;
                rotateYAsDeg.value = interpolate(
                    x.value,
                    [-containerWidth, 0, containerWidth],
                    [180, 0, -180],
                    Extrapolate.CLAMP
                );

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
                const degrees = snapTo > 0 ? -180 : snapTo < 0 ? 180 : 0;
                x.value = snapTo;

                if (rotateYAsDeg.value === degrees) {
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
                                runOnJS(onDrag)(false);
                            }
                            runOnJS(onPageFlip)(id, false);
                        }
                    );
                }
            },
        });

        if (!front || !back) {
            return null;
        }

        const frontPageStyle = getPageStyle(right, true);
        const backPageStyle = getPageStyle(right, false);

        const frontUrl = right ? front.right : front.left;
        const backUrl = right ? back.left : back.right;
        return (
            <PanGestureHandler
                onGestureEvent={onPanGestureHandler}
                enabled={gesturesEnabled}
            >
                <Animated.View style={containerStyle}>
                    {isPressable && (
                        <Pressable
                            disabled={isAnimating}
                            onPress={() => {
                                if (!isAnimatingRef.current) turnPage();
                            }}
                            style={[
                                {
                                    position: 'absolute',
                                    height: '100%',
                                    width: '25%',
                                    zIndex: 10000,
                                },
                                right ? { right: 0 } : { left: 0 },
                            ]}
                        />
                    )}

                    {/* BACK */}
                    <Animated.View
                        style={[
                            styles.pageContainer,
                            backStyle,
                            { overflow: 'visible' },
                        ]}
                    >
                        <View style={styles.pageContainer}>
                            {backUrl ? (
                                renderPage && (
                                    <Animated.View
                                        style={[
                                            backPageStyle,
                                            animatedBackPageStyle,
                                        ]}
                                    >
                                        {renderPage(backUrl)}
                                    </Animated.View>
                                )
                            ) : (
                                <BlankPage />
                            )}
                        </View>

                        <BackShadow {...{ degrees: rotateYAsDeg, right }} />
                        <FrontShadow
                            {...{
                                right,
                                degrees: rotateYAsDeg,
                                width: containerWidth,
                                viewHeight: containerHeight,
                            }}
                        />

                        <PageShadow
                            {...{
                                right,
                                degrees: rotateYAsDeg,
                                width: containerWidth,
                                viewHeight: containerHeight,
                                containerSize,
                            }}
                        />

                        {showSpine && (
                            <BookSpine2
                                right={right}
                                degrees={rotateYAsDeg}
                                containerSize={containerSize}
                            />
                        )}
                    </Animated.View>
                    {/* FRONT */}
                    <Animated.View style={[styles.pageContainer, frontStyle]}>
                        {frontUrl ? (
                            renderPage && (
                                <Animated.View style={[frontPageStyle]}>
                                    {renderPage(frontUrl)}
                                </Animated.View>
                            )
                        ) : (
                            <BlankPage />
                        )}
                        {showSpine && (
                            <BookSpine
                                right={right}
                                containerSize={containerSize}
                            />
                        )}
                    </Animated.View>
                </Animated.View>
            </PanGestureHandler>
        );
    }
);

export { BookPage };

const BlankPage = () => (
    <View
        style={{ ...StyleSheet.absoluteFillObject, backgroundColor: '#fff' }}
    />
);

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
        // justifyContent: 'center',
        // alignItems: 'flex-end',
        // backgroundColor: 'rgba(0,0,0,0)',
        // backgroundColor: 'white',
    },
});
