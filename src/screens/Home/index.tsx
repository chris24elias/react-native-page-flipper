import { PageFlipper } from '@/PageFlipper';
import { RootStackScreenProps } from '@/types';
import { Box } from 'native-base';
import * as React from 'react';
import { useWindowDimensions } from 'react-native';

const PAGES = [
  // 'https://i.picsum.photos/id/960/780/844.jpg?hmac=yi46RPSHaJh3LsOi_4noHPFpgB2pdTiFkfLg0YWANC8',
  // 'https://i.picsum.photos/id/179/780/844.jpg?hmac=C934STbwY480q05yogaGe9v6jT5pfFxYKhj0dPpe9OE',
  // 'https://i.picsum.photos/id/70/780/844.jpg?hmac=wFZE1FAacjyxQadjJcSNjDZnqeLrWvjf4t1c4g-oZws',
  // 'https://i.picsum.photos/id/183/780/844.jpg?hmac=ZKyE-nRYJ4f8UvpjLhWzhNOOpIpqjU0Ve1eNoPpYF-A',
  // 'https://i.picsum.photos/id/960/780/844.jpg?hmac=yi46RPSHaJh3LsOi_4noHPFpgB2pdTiFkfLg0YWANC8',
  // 'https://i.picsum.photos/id/179/780/844.jpg?hmac=C934STbwY480q05yogaGe9v6jT5pfFxYKhj0dPpe9OE',
  // 'https://i.picsum.photos/id/70/780/844.jpg?hmac=wFZE1FAacjyxQadjJcSNjDZnqeLrWvjf4t1c4g-oZws',
  // 'https://i.picsum.photos/id/183/780/844.jpg?hmac=ZKyE-nRYJ4f8UvpjLhWzhNOOpIpqjU0Ve1eNoPpYF-A',

  'https://up.mangadudes.com/bleach/18/bleach-9337-e60a76a126bc6ecd3211aeaad51a7dba.jpg',
  'https://up.mangadudes.com/bleach/18/bleach-9338-89fcdb98b22c94781ba2846ea2e562c3.jpg',
  'https://up.mangadudes.com/bleach/18/bleach-9339-5d0e73373eb814d65b18bfa4ca533be8.jpg',
  'https://up.mangadudes.com/bleach/18/bleach-9340-c1220292956ae4cc1df0676e2d01c2e1.jpg',
  'https://up.mangadudes.com/bleach/18/bleach-9341-159bcbae27446cd1d6c964b4b70af020.jpg',
  'https://up.mangadudes.com/bleach/18/bleach-9342-024e1db41ff0ea6e6bc47574b209fda4.jpg',
  'https://up.mangadudes.com/bleach/18/bleach-9344-b14e956a08b6998dd00a61f89db84238.jpg',
];

const Home: React.FC<RootStackScreenProps<'Home'>> = () => {
  // const { t } = useTranslation();
  const { width, height } = useWindowDimensions();

  const ratio = 800 / 1270;

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
