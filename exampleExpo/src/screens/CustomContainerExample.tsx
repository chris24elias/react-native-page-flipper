import PageFlipper from 'react-native-page-flipper';
import { Box, Text } from 'native-base';
import * as React from 'react';
import { Image, MANGA_PAGES } from '@/utils/Constants';

const CustomContainerExample = ({}) => {
  return (
    <Box flex={1} p="xl" bg="white">
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
          shadowColor: '#000',
          shadowOffset: {
            width: 0,
            height: 2,
          },
          shadowOpacity: 0.25,
          shadowRadius: 3.84,
          elevation: 5,
        }}
        renderPage={(data) => {
          return (
            <Image
              source={{ uri: data }}
              style={{ height: '100%', width: '100%' }}
              // resizeMode="contain"
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
        renderContainer={(props) => {
          return (
            <Box flex={1}>
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
              <Image
                source={require('./bookframe2.png')}
                style={{
                  height: '100%',
                  width: '100%',
                  position: 'absolute',
                  zIndex: -1,
                  top: '2.4%',
                  left: '-1%',
                  transform: [
                    {
                      scaleX: 1.17,
                    },
                    { scaleY: 1.18 },
                  ],
                }}
                resizeMode="stretch"
                pointerEvents="none"
              />

              {props.children}
            </Box>
          );
        }}
      />
    </Box>
  );
};

export { CustomContainerExample };
