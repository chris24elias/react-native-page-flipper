import { PageFlipper } from '@/PageFlipper';
import { RootStackScreenProps } from '@/types';
import { Box } from 'native-base';
import * as React from 'react';
import { useWindowDimensions } from 'react-native';

const PAGES = [
  'https://i.picsum.photos/id/960/780/844.jpg?hmac=yi46RPSHaJh3LsOi_4noHPFpgB2pdTiFkfLg0YWANC8',
  'https://i.picsum.photos/id/179/780/844.jpg?hmac=C934STbwY480q05yogaGe9v6jT5pfFxYKhj0dPpe9OE',
  'https://i.picsum.photos/id/70/780/844.jpg?hmac=wFZE1FAacjyxQadjJcSNjDZnqeLrWvjf4t1c4g-oZws',
  'https://i.picsum.photos/id/183/780/844.jpg?hmac=ZKyE-nRYJ4f8UvpjLhWzhNOOpIpqjU0Ve1eNoPpYF-A',
  'https://i.picsum.photos/id/960/780/844.jpg?hmac=yi46RPSHaJh3LsOi_4noHPFpgB2pdTiFkfLg0YWANC8',
  'https://i.picsum.photos/id/179/780/844.jpg?hmac=C934STbwY480q05yogaGe9v6jT5pfFxYKhj0dPpe9OE',
  'https://i.picsum.photos/id/70/780/844.jpg?hmac=wFZE1FAacjyxQadjJcSNjDZnqeLrWvjf4t1c4g-oZws',
  'https://i.picsum.photos/id/183/780/844.jpg?hmac=ZKyE-nRYJ4f8UvpjLhWzhNOOpIpqjU0Ve1eNoPpYF-A',
];

const Home: React.FC<RootStackScreenProps<'Home'>> = () => {
  // const { t } = useTranslation();
  const { width, height } = useWindowDimensions();

  const ratio = 0.92;

  const containerSize =
    width > height
      ? {
          height,
          width: height * ratio,
        }
      : {
          height: width / ratio,
          width: width,
        };

  return (
    <Box flex={1} bg="white" alignItems={'center'}>
      <PageFlipper data={PAGES} landscape={true} containerSize={containerSize} />
    </Box>
  );
};

export { Home };

//   <ScrollView>
//     <Box mt="4" justifyContent="center" alignItems={'center'}>
//       <PageFlipper
//         data={PAGES}
//         landscape={true}
//         containerSize={{
//           height: width / ratio,
//           width: width,
//         }}
//       />
//     </Box>
//     <Box mt="4" justifyContent="center" alignItems={'center'}>
//       <PageFlipper
//         data={PAGES}
//         landscape={false}
//         containerSize={{
//           height: (width / ratio) * 2,
//           width: width,
//         }}
//       />
//     </Box>
//   </ScrollView>
