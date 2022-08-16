import PageFlipper from 'react-native-page-flipper';
import { Box, Text } from 'native-base';
import * as React from 'react';
import { Image, MANGA_PAGES } from '@/utils/Constants';

const LandscapeExample = ({}) => {
  return (
    <Box flex={1} bg="white">
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
            <Box flex={1} bg="white">
              <Text>this is my custom last page</Text>
            </Box>
          );
        }}
      />
    </Box>
  );
};

export { LandscapeExample };
