import { PageFlipper, PageFlipperInstance } from '@/PageFlipper';
import { RootStackScreenProps } from '@/types';
import { Box, Button, Text } from 'native-base';
import * as React from 'react';
import { Switch } from 'react-native';

const SINGLE_PAGES = [
  'https://up.mangadudes.com/bleach/18/bleach-9337-e60a76a126bc6ecd3211aeaad51a7dba.jpg',
  'https://up.mangadudes.com/bleach/18/bleach-9338-89fcdb98b22c94781ba2846ea2e562c3.jpg',
  'https://up.mangadudes.com/bleach/18/bleach-9339-5d0e73373eb814d65b18bfa4ca533be8.jpg',
  'https://up.mangadudes.com/bleach/18/bleach-9340-c1220292956ae4cc1df0676e2d01c2e1.jpg',
  'https://up.mangadudes.com/bleach/18/bleach-9341-159bcbae27446cd1d6c964b4b70af020.jpg',
  'https://up.mangadudes.com/bleach/18/bleach-9342-024e1db41ff0ea6e6bc47574b209fda4.jpg',
  'https://up.mangadudes.com/bleach/18/bleach-9344-b14e956a08b6998dd00a61f89db84238.jpg',
];

// const DOUBLE_PAGES = [
//   'https://images.unsplash.com/photo-1422289304860-97fce8cf2066?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1932&h=1000&q=80',
//   'https://images.unsplash.com/photo-1609854453157-e2d474ff63e3?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1932&h=1000&q=80',
//   'https://images.unsplash.com/photo-1466854076813-4aa9ac0fc347?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1932&h=1000&q=80',
//   'https://images.unsplash.com/photo-1422289304860-97fce8cf2066?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1932&h=1000&q=80',
//   'https://images.unsplash.com/photo-1609854453157-e2d474ff63e3?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1932&h=1000&q=80',
//   'https://images.unsplash.com/photo-1466854076813-4aa9ac0fc347?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1932&h=1000&q=80',
// ];

// const PAGES = [
//   // 'https://i.picsum.photos/id/960/780/844.jpg?hmac=yi46RPSHaJh3LsOi_4noHPFpgB2pdTiFkfLg0YWANC8',
//   // 'https://i.picsum.photos/id/179/780/844.jpg?hmac=C934STbwY480q05yogaGe9v6jT5pfFxYKhj0dPpe9OE',
//   // 'https://i.picsum.photos/id/70/780/844.jpg?hmac=wFZE1FAacjyxQadjJcSNjDZnqeLrWvjf4t1c4g-oZws',
//   // 'https://i.picsum.photos/id/183/780/844.jpg?hmac=ZKyE-nRYJ4f8UvpjLhWzhNOOpIpqjU0Ve1eNoPpYF-A',
//   // 'https://i.picsum.photos/id/960/780/844.jpg?hmac=yi46RPSHaJh3LsOi_4noHPFpgB2pdTiFkfLg0YWANC8',
//   // 'https://i.picsum.photos/id/179/780/844.jpg?hmac=C934STbwY480q05yogaGe9v6jT5pfFxYKhj0dPpe9OE',
//   // 'https://i.picsum.photos/id/70/780/844.jpg?hmac=wFZE1FAacjyxQadjJcSNjDZnqeLrWvjf4t1c4g-oZws',
//   // 'https://i.picsum.photos/id/183/780/844.jpg?hmac=ZKyE-nRYJ4f8UvpjLhWzhNOOpIpqjU0Ve1eNoPpYF-A',

//   'https://up.mangadudes.com/bleach/18/bleach-9337-e60a76a126bc6ecd3211aeaad51a7dba.jpg',
//   'https://up.mangadudes.com/bleach/18/bleach-9338-89fcdb98b22c94781ba2846ea2e562c3.jpg',
//   'https://up.mangadudes.com/bleach/18/bleach-9339-5d0e73373eb814d65b18bfa4ca533be8.jpg',
//   'https://up.mangadudes.com/bleach/18/bleach-9340-c1220292956ae4cc1df0676e2d01c2e1.jpg',
//   'https://up.mangadudes.com/bleach/18/bleach-9341-159bcbae27446cd1d6c964b4b70af020.jpg',
//   'https://up.mangadudes.com/bleach/18/bleach-9342-024e1db41ff0ea6e6bc47574b209fda4.jpg',
//   'https://up.mangadudes.com/bleach/18/bleach-9344-b14e956a08b6998dd00a61f89db84238.jpg',

//   // 'https://images.unsplash.com/photo-1422289304860-97fce8cf2066?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1932&h=1000&q=80',
//   // 'https://images.unsplash.com/photo-1609854453157-e2d474ff63e3?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1932&h=1000&q=80',
//   // 'https://images.unsplash.com/photo-1466854076813-4aa9ac0fc347?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1932&h=1000&q=80',
//   // 'https://images.unsplash.com/photo-1422289304860-97fce8cf2066?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1932&h=1000&q=80',
//   // 'https://images.unsplash.com/photo-1609854453157-e2d474ff63e3?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1932&h=1000&q=80',
//   // 'https://images.unsplash.com/photo-1466854076813-4aa9ac0fc347?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1932&h=1000&q=80',
// ];

const Home: React.FC<RootStackScreenProps<'Home'>> = () => {
  const pageFlipperRef = React.useRef<PageFlipperInstance>(null);
  // const [text, setText] = React.useState('');
  const [isPortrait, setIsPortrait] = React.useState(true);
  const [isSingle, setIsSingle] = React.useState(true);

  const data = SINGLE_PAGES; // isSingle ? SINGLE_PAGES : DOUBLE_PAGES;

  return (
    <Box flex={1} bg="white" flexDirection={{ base: 'column', lg: 'column' }}>
      <PageFlipper
        ref={pageFlipperRef}
        data={data}
        enabled={true}
        single={isSingle}
        portrait={isPortrait}
      />

      {/* <Button onPress={() => setIsSingle(!isSingle)}>change single</Button>
      <Button onPress={() => setIsPortrait(!isPortrait)}>change orientation</Button> */}
      <Text>is portrait</Text>
      <Switch value={isPortrait} onValueChange={() => setIsPortrait(!isPortrait)} />
      <Text>is single</Text>
      <Switch value={isSingle} onValueChange={() => setIsSingle(!isSingle)} />

      {/* <Input onChangeText={setText} />
      <Button onPress={() => pageFlipperRef.current?.goToPage(Number(text))}>GO TO</Button> */}
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

      {/* <ZoomView> */}
      {/* <Box flex={1}>
        <Text>SINGLE</Text>
        <PageFlipper data={PAGES} enabled={true} single={true} />
      </Box>
      <Box flex={1}>
        <Text>NOT SINGLE</Text>
        <PageFlipper data={PAGES} enabled={true} single={false} />
      </Box> */}
      {/* </ZoomView> */}
    </Box>
  );
};

export { Home };
