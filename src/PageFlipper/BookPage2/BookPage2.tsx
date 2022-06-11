import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { PanGestureHandler, PanGestureHandlerGestureEvent } from 'react-native-gesture-handler';
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
import Image from '../Components/Image';
import { Size } from '../types';
import BackShadow from './BackShadow';
import FrontShadow from './FrontShadow';
import PageShadow from './PageShadow';
import { BookSpine } from './BookSpine';
import { BookSpine2 } from './BookSpine2';
import { snapPoint } from '../utils/utils';
import { IS_ANDROID, IS_WEB } from '@/utils/Constants';

export type IBookPageProps = {
  right: boolean;
  front: string;
  back: string;
  onPageFlip: any;
  containerSize: Size;
  isAnimatingRef: React.MutableRefObject<boolean>;
  setIsAnimating: (val: boolean) => void;
  isAnimating: boolean;
  enabled: boolean;
};

export const diffClamp = (val: number, min: number, max: number) => {
  'worklet';

  if (val >= max) {
    return max;
  }
  if (val <= min) {
    return min;
  }
  return val;
};

const timingConfig: WithTimingConfig = {
  duration: 800,
  easing: Easing.inOut(Easing.cubic),
};

const BookPage2: React.FC<IBookPageProps> = ({
  right,
  front,
  back,
  onPageFlip,
  containerSize,
  isAnimatingRef,
  setIsAnimating,
  isAnimating,
  enabled,
}) => {
  const containerWidth = containerSize.width;

  const leftPSnapPoints = [0, containerSize.width];
  const rightPSnapPoints = [-containerSize.width, 0];
  const pSnapPoints = right ? rightPSnapPoints : leftPSnapPoints;

  const x = useSharedValue(0);
  const isMounted = useRef(false);
  const rotateYAsDeg = useSharedValue(0);
  const [isDragging, setIsDragging] = useState(false);

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

  const turnPage = () => {
    setIsDragging(true);
    setIsAnimating(true);

    const id = right ? 1 : -1;
    rotateYAsDeg.value = withTiming(right ? 180 : -180, timingConfig, () => {
      runOnJS(onPageFlip)(id, false);
    });
  };

  const getDegreesForX = ({ x }: { x: number }) => {
    'worklet';

    const val = interpolate(
      x,
      [-containerSize.width, 0, containerSize.width],
      [180, 0, -180],
      Extrapolate.CLAMP,
    );
    return val;
  };

  const onDrag = useCallback((val: boolean) => {
    if (!isMounted.current) {
      return;
    }
    if (val) {
      setIsDragging(true);
    } else {
      setIsDragging(false);
    }
  }, []);

  const backStyle = useAnimatedStyle(() => {
    const val = rotateYAsDeg.value;
    const x = right
      ? interpolate(val, [0, 180], [containerWidth / 2, -containerWidth / 2])
      : interpolate(val, [-180, 0], [containerWidth / 2, 0]);

    const w = right
      ? interpolate(val, [0, 180], [0, containerWidth / 2])
      : interpolate(val, [-180, 0], [containerWidth / 2, 0]);
    return {
      width: Math.ceil(w),
      zIndex: 2,
      transform: [{ translateX: x }],
    };
  });

  const frontStyle = useAnimatedStyle(() => {
    const val = rotateYAsDeg.value;
    let w;
    if (IS_WEB) {
      w = right
        ? interpolate(val, [0, 180], [containerWidth / 2, 0])
        : interpolate(val, [-180, 0], [0, containerWidth / 2]);
    } else {
      w = right
        ? interpolate(val, [0, 160], [containerWidth / 2, -20])
        : interpolate(val, [-160, 0], [-20, containerWidth / 2]);
    }

    return {
      zIndex: 1,
      width: Math.floor(w),
    };
  });

  const containerStyle = useAnimatedStyle(() => {
    return {
      flex: 1,
      zIndex: isDragging ? 100 : 0,
    };
  });

  const onPanGestureHandler = useAnimatedGestureHandler<
    PanGestureHandlerGestureEvent,
    { x: number }
  >({
    onStart: (event, ctx) => {
      runOnJS(onDrag)(true);
      ctx.x = x.value;
    },
    onActive: (event, ctx) => {
      const newX = ctx.x + event.translationX;

      // const timingConfig2 = {
      //   duration: 30,
      // };

      const degrees = getDegreesForX({ x: newX });

      // if (IS_ANDROID || IS_WEB) {
      x.value = newX;
      // } else {
      // x.value = withTiming(newX, timingConfig2);
      // }

      rotateYAsDeg.value = degrees;
    },
    onEnd: (event) => {
      const snapTo = snapPoint(x.value, event.velocityX, pSnapPoints);

      const id = snapTo > 0 ? -1 : snapTo < 0 ? 1 : 0;

      const degrees = getDegreesForX({ x: snapTo });

      x.value = snapTo;

      if (rotateYAsDeg.value === degrees) {
        runOnJS(onPageFlip)(id, false);
      } else {
        runOnJS(setIsAnimating)(true);

        const progress = Math.abs(rotateYAsDeg.value - degrees) / 100;

        const duration = diffClamp(800 * progress - Math.abs(0.1 * event.velocityX), 200, 1000);

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
          },
        );
      }
    },
  });

  const getBookImageStyle = (right: boolean, front: boolean) => {
    const imageStyle: any = {
      height: Math.round(containerSize.height),
      width: Math.round(containerSize.width),
      position: 'absolute',
    };

    if (right && front) {
      imageStyle['left'] = Math.round(-containerSize.width / 2);
    } else if (!right && !front) {
      imageStyle['left'] = Math.round(-containerSize.width / 2);
    } else {
      imageStyle['left'] = 0;
    }

    return imageStyle;
  };

  const frontImageStyle = getBookImageStyle(right, true);
  const backImageStyle = getBookImageStyle(right, false);

  const animatedBackImageStyle = useAnimatedStyle(() => {
    const l = right
      ? 0
      : interpolate(rotateYAsDeg.value, [-180, 0], [-containerWidth / 2, -containerWidth]);

    return {
      left: l,
    };
  });

  const gesturesEnabled = enabled && !isAnimating;
  const showSpine = true;

  if (!front || !back) {
    return null;
  }

  return (
    <Animated.View style={containerStyle}>
      <PanGestureHandler onGestureEvent={onPanGestureHandler} enabled={gesturesEnabled}>
        <Animated.View style={containerStyle}>
          <Pressable
            onPress={() => {
              if (!isAnimatingRef.current) turnPage();
            }}
            style={[
              {
                position: 'absolute',
                height: '100%',
                width: '50%',
                // backgroundColor: 'red',
                // opacity: 0,
                zIndex: 10000,
              },
              right ? { right: 0 } : { left: 0 },
            ]}
          />

          {/* BACK */}
          <Animated.View style={[styles.imageContainer, backStyle, { overflow: 'visible' }]}>
            <View style={styles.imageContainer}>
              {back ? (
                <Image
                  source={{
                    uri: back,
                  }}
                  style={[backImageStyle, animatedBackImageStyle]}
                />
              ) : (
                <BlankPage />
              )}
            </View>

            <BackShadow {...{ degrees: rotateYAsDeg, right }} />
            <FrontShadow
              {...{
                right,
                degrees: rotateYAsDeg,
                width: containerSize.width,
                viewHeight: containerSize.height,
              }}
            />

            <PageShadow
              {...{
                right,
                degrees: rotateYAsDeg,
                width: containerSize.width,
                viewHeight: containerSize.height,
              }}
            />

            {showSpine && (
              <BookSpine2 right={right} containerSize={containerSize} degrees={rotateYAsDeg} />
            )}
          </Animated.View>
          {/* FRONT */}
          <Animated.View
            style={[styles.imageContainer, frontStyle, right ? { left: 0 } : { right: 0 }]}
          >
            {front ? (
              <Image
                source={{
                  uri: front,
                }}
                style={[
                  frontImageStyle,
                  right
                    ? { left: -containerSize.width / 2 }
                    : { right: -containerSize.width / 2, left: undefined },
                ]}
              />
            ) : (
              <BlankPage />
            )}
            {showSpine && <BookSpine right={right} containerSize={containerSize} />}
          </Animated.View>
        </Animated.View>
      </PanGestureHandler>
    </Animated.View>
  );
};

export { BookPage2 };

const BlankPage = () => (
  <View style={{ ...StyleSheet.absoluteFillObject, backgroundColor: '#fff' }} />
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  imageContainer: {
    height: '100%',
    width: '100%',
    position: 'absolute',
    backfaceVisibility: 'hidden',
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'flex-end',
    // backgroundColor: 'rgba(0,0,0,0)',
    // backgroundColor: 'white',
  },
});
