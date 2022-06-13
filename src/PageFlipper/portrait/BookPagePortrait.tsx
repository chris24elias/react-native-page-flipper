import React, { useCallback, useEffect, useRef, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import {
  HandlerStateChangeEvent,
  PanGestureHandler,
  PanGestureHandlerGestureEvent,
  State,
  TapGestureHandler,
  TapGestureHandlerEventPayload,
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
import Image from '../Components/Image';
import { Size } from '../types';
import BackShadow from '../BookPage2/BackShadow';
import FrontShadow from '../BookPage2/FrontShadow';
import PageShadow from '../BookPage2/PageShadow';
import { snapPoint } from '../utils/utils';

export type IBookPageProps = {
  current: string;
  prev: string;
  onPageFlip: any;
  containerSize: Size;

  setIsAnimating: (val: boolean) => void;
  pageIndex: number;
  isAnimating: boolean;
  enabled: boolean;
};

const BookPagePortrait: React.FC<IBookPageProps> = ({
  current,
  prev,
  onPageFlip,
  containerSize,
  enabled,
  setIsAnimating,
  pageIndex,
  isAnimating,
}) => {
  const tapRef = useRef(null);
  const panRef = useRef(null);
  const containerWidth = containerSize.width;

  const pSnapPoints = !prev
    ? [-containerSize.width, 0]
    : [-containerSize.width, 0, containerSize.width];

  const timingConfig: WithTimingConfig = {
    duration: 800,
    easing: Easing.inOut(Easing.cubic),
  };
  const x = useSharedValue(0);

  const isMounted = useRef(false);
  const rotateYAsDeg = useSharedValue(0);
  const [isDragging, setIsDragging] = useState(false);

  // might not need this
  // useEffect(() => {
  //   if (!enabled) {
  //     setIsDragging(false);
  //   }
  // }, [enabled]);

  const turnPage = (id: 1 | -1) => {
    setIsDragging(true);
    setIsAnimating(true);

    rotateYAsDeg.value = withTiming(id < 0 ? -180 : 180, timingConfig, () => {
      runOnJS(onPageFlip)(id, false);
    });
  };

  useEffect(() => {
    isMounted.current = true;
    return () => {
      isMounted.current = false;
    };
  }, []);

  const onSingleTap = (event: HandlerStateChangeEvent<TapGestureHandlerEventPayload>) => {
    if (event.nativeEvent.state === State.ACTIVE) {
      const right = event.nativeEvent.x >= containerWidth / 2;

      if (!right && pageIndex === 0) {
        console.log('cant turn left on first page');
        return;
      }

      turnPage(right ? 1 : -1);
    }
  };

  const getDegreesForX = (x: number) => {
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
      const degrees = getDegreesForX(newX);
      x.value = newX;
      rotateYAsDeg.value = degrees;
    },
    onEnd: (event) => {
      const snapTo = snapPoint(x.value, event.velocityX, pSnapPoints);
      const id = snapTo > 0 ? -1 : snapTo < 0 ? 1 : 0;

      const degrees = getDegreesForX(snapTo);
      x.value = snapTo;
      if (rotateYAsDeg.value === degrees) {
        // already same value
        // debugValue('already there');
        runOnJS(onPageFlip)(id, false);
      } else {
        runOnJS(setIsAnimating)(true);
        rotateYAsDeg.value = withTiming(degrees, timingConfig, () => {
          if (snapTo === 0) {
            runOnJS(onDrag)(false);
          }
          runOnJS(onPageFlip)(id, false);
        });
      }
    },
  });

  const gesturesEnabled = enabled && !isAnimating;
  const getBookImageStyle = (right: boolean, front: boolean) => {
    const imageStyle: any = {
      height: Math.round(containerSize.height),
      width: Math.round(containerSize.width * 2),
      position: 'absolute',
      backgroundColor: 'white',
    };

    const isEvenPage = pageIndex % 2 == 0;

    if (front) {
      if (isEvenPage) {
        imageStyle.left = right ? 0 : -containerSize.width;
      } else {
        imageStyle.left = right ? -containerSize.width : 0;
      }
    } else {
      if (isEvenPage) {
        imageStyle.left = right ? -containerSize.width : 0;
      } else {
        imageStyle.left = right ? 0 : -containerSize.width;
      }
    }

    return imageStyle;
  };

  const iPageProps = {
    containerSize,
    containerWidth,
    getBookImageStyle,
    rotateYAsDeg,
  };

  return (
    <TapGestureHandler
      numberOfTaps={1}
      onHandlerStateChange={onSingleTap}
      ref={tapRef}
      // simultaneousHandlers={[panRef]}
      waitFor={panRef}
      enabled={gesturesEnabled}
      // hitSlop={{ right: 0, width: containerSize.width / 4 }}
    >
      <Animated.View style={containerStyle}>
        <PanGestureHandler
          simultaneousHandlers={tapRef}
          onGestureEvent={onPanGestureHandler}
          enabled={gesturesEnabled}
          ref={panRef}
        >
          <Animated.View style={containerStyle}>
            {current && <IPage page={current} right={true} {...iPageProps} />}
            {prev && <IPage page={prev} right={false} {...iPageProps} />}
          </Animated.View>
        </PanGestureHandler>
      </Animated.View>
    </TapGestureHandler>
  );
};

type IPageProps = {
  right: boolean;
  page: string;
  rotateYAsDeg: Animated.SharedValue<number>;
  containerWidth: number;
  containerSize: Size;
  getBookImageStyle: any;
};

const IPage: React.FC<IPageProps> = ({
  right,
  page,
  rotateYAsDeg,
  containerWidth,
  containerSize,
  getBookImageStyle,
}) => {
  const [loaded, setLoaded] = useState(right);

  useEffect(() => {
    // hack fix
    setTimeout(() => {
      setLoaded(true);
    }, 50);
  }, []);

  const rotationVal = useDerivedValue(() => {
    const val = right ? rotateYAsDeg.value : interpolate(rotateYAsDeg.value, [-180, 0], [0, 180]);
    return val;
  });

  const portraitBackStyle = useAnimatedStyle(() => {
    const x = interpolate(rotationVal.value, [0, 180], [containerWidth, -containerWidth / 2]);
    const w = interpolate(rotationVal.value, [0, 180], [0, containerWidth / 2]);

    return {
      width: w,
      zIndex: 2,
      opacity: 1,
      transform: [{ translateX: x }],
    };
  });

  const portraitFrontStyle = useAnimatedStyle(() => {
    const w = interpolate(rotationVal.value, [0, 160], [containerWidth, -20], Extrapolate.CLAMP);

    return {
      zIndex: 1,
      width: Math.floor(w),
    };
  });

  const frontImageStyle = getBookImageStyle(right, true);
  const backImageStyle = getBookImageStyle(right, false);

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
      <Animated.View style={[styles.imageContainer, portraitBackStyle, { overflow: 'visible' }]}>
        <View style={styles.imageContainer}>
          <Image
            source={{
              uri: page,
            }}
            style={[
              backImageStyle,
              {
                opacity: 0.2,
                transform: [{ rotateX: '180deg' }, { rotateZ: '180deg' }],
              },
            ]}
          />
        </View>
        <BackShadow {...{ degrees: rotationVal, right: true }} />
        <FrontShadow {...shadowProps} />
        <PageShadow {...shadowProps} />
      </Animated.View>
      {/* FRONT */}
      <Animated.View style={[styles.imageContainer, portraitFrontStyle, {}]}>
        <Image
          source={{
            uri: page,
          }}
          style={[frontImageStyle]}
        />
      </Animated.View>
    </View>
  );
};

export { BookPagePortrait };

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
    backgroundColor: 'white',
  },
});
