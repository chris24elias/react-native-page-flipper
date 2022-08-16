import PageFlipper, { PageFlipperInstance } from 'react-native-page-flipper';
import { Box } from 'native-base';
import * as React from 'react';
import { Image, MANGA_PAGES } from '@/utils/Constants';

const PortraitExample = ({}) => {
  return (
    <Box flex={1} bg="white">
      {/* <Box position="absolute" zIndex={5}>
        <Row alignSelf="center" space={1} mt="m">
          <Button
            onPress={() => {
              pageFlipperRef.current?.previousPage();
            }}
          >
            PREV
          </Button>
          <Button
            onPress={() => {
              pageFlipperRef.current?.nextPage();
            }}
          >
            NEXT
          </Button>
        </Row>
      </Box> */}
      <PageFlipper
        // ref={pageFlipperRef}
        data={MANGA_PAGES}
        pageSize={{
          height: 334,
          width: 210,
        }}
        enabled={true}
        singleImageMode={true}
        portrait={true}
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
              // resizeMode={'contain'}
            />
          );
        }}
      />
    </Box>
  );
};

export { PortraitExample };
