import PageFlipper from 'react-native-page-flipper';
import { Box, Text } from 'native-base';
import * as React from 'react';
import { Image, IS_WEB, MANGA_PAGES } from '@/utils/Constants';
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';

const AnimatedExample = ({}) => {
  const rotation = useSharedValue(0);
  const rotateX = useSharedValue(30);
  const rotateY = useSharedValue(10);
  const scale = useSharedValue(0.4);

  const translateY = useSharedValue(0);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      //   opacity: IS_WEB ? 1 : opacity.value,
      // top: '-2%',
      transform: [
        {
          perspective: 1000,
        },
        {
          rotate: `${rotation.value}deg`,
        },
        {
          rotateX: `${rotateX.value}deg`,
        },
        { rotateZ: `${rotateY.value}deg` },
        {
          scale: scale.value,
        },
        {
          translateY: translateY.value,
        },
      ],
    };
  });

  React.useEffect(() => {
    rotateX.value = 30;
    rotateY.value = 10;
    scale.value = 0.4;

    rotateX.value = withTiming(0, { duration: 900 });
    rotateY.value = withTiming(0, { duration: 900 });
    scale.value = withTiming(1, { duration: 900 }, () => {});
  }, []);

  const renderContainer = (props) => {
    return (
      <Animated.View
        style={[
          {
            flex: 1,
            backgroundColor: 'white',
            shadowColor: '#000',
            shadowOffset: {
              width: 0,
              height: 2,
            },
            shadowOpacity: 0.25,
            shadowRadius: 3.84,
            elevation: 5,
          },
          animatedStyle,
        ]}
      >
        {/* <Image
          source={require('./bookFrame.png')}
          style={{
            height: '100%',
            width: '100%',
            position: 'absolute',
            zIndex: -1,
            top: '2%',
            transform: [
              {
                scaleX: 1.05,
              },
              { scaleY: 1.11 },
            ],
          }}
          resizeMode="stretch"
          pointerEvents="none"
        /> */}

        {props.children}
      </Animated.View>
    );
  };
  return (
    <Box flex={1} p="12" bg={'#3498db'}>
      <PageFlipper
        data={MANGA_PAGES}
        pageSize={{
          height: 334,
          width: 210,
        }}
        enabled={true}
        singleImageMode={true}
        portrait={false}
        pressable={true}
        contentContainerStyle={{
          backgroundColor: 'transparent',
        }}
        renderPage={(data) => {
          return (
            <Image
              source={{ uri: data }}
              style={{ height: '100%', width: '100%' }}
              //   resizeMode="contain"
            />
          );
        }}
        renderLastPage={() => {
          return (
            <Box flex={1} bg="white" justifyContent="center" alignItems="center">
              <Text>this is my custom last page</Text>
            </Box>
          );
        }}
        renderContainer={renderContainer}
      />
    </Box>
  );
};

export { AnimatedExample };
