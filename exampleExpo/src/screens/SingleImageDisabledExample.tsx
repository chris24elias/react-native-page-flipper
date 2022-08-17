import PageFlipper from 'react-native-page-flipper';
import { Box } from 'native-base';
import * as React from 'react';
import { DOUBLE_PAGES, Image } from '@/utils/Constants';

const SingleImageDisabledExample = ({}) => {
  return (
    <Box flex={1} bg="white">
      <PageFlipper
        data={DOUBLE_PAGES}
        pageSize={{
          height: 541,
          width: 1046,
        }}
        enabled={true}
        singleImageMode={false}
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
          return <Image source={{ uri: data }} style={{ height: '100%', width: '100%' }} />;
        }}
      />
    </Box>
  );
};

export { SingleImageDisabledExample };
