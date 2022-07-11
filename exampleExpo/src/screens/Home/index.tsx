import { PageFlipper, PageFlipperInstance } from 'react-native-page-flipper';
import { RootStackScreenProps } from '@/types';
import { IS_WEB } from '@/utils/Constants';
import { Box, Button, Column, Input, Row, Text } from 'native-base';
import * as React from 'react';
import { Switch } from 'react-native';
import Orientation from 'react-native-orientation';

const SINGLE_PAGES = [
  'https://up.mangadudes.com/bleach/18/bleach-9337-e60a76a126bc6ecd3211aeaad51a7dba.jpg',
  'https://up.mangadudes.com/bleach/18/bleach-9338-89fcdb98b22c94781ba2846ea2e562c3.jpg',
  'https://up.mangadudes.com/bleach/18/bleach-9339-5d0e73373eb814d65b18bfa4ca533be8.jpg',
  'https://up.mangadudes.com/bleach/18/bleach-9340-c1220292956ae4cc1df0676e2d01c2e1.jpg',
  'https://up.mangadudes.com/bleach/18/bleach-9341-159bcbae27446cd1d6c964b4b70af020.jpg',
  'https://up.mangadudes.com/bleach/18/bleach-9342-024e1db41ff0ea6e6bc47574b209fda4.jpg',
  'https://up.mangadudes.com/bleach/18/bleach-9344-b14e956a08b6998dd00a61f89db84238.jpg',
];

const DOUBLE_PAGES = [
  'https://images.unsplash.com/photo-1422289304860-97fce8cf2066?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1932&h=1000&q=80',
  'https://images.unsplash.com/photo-1609854453157-e2d474ff63e3?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1932&h=1000&q=80',
  'https://images.unsplash.com/photo-1466854076813-4aa9ac0fc347?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1932&h=1000&q=80',
  'https://images.unsplash.com/photo-1422289304860-97fce8cf2066?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1932&h=1000&q=80',
  'https://images.unsplash.com/photo-1609854453157-e2d474ff63e3?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1932&h=1000&q=80',
  'https://images.unsplash.com/photo-1466854076813-4aa9ac0fc347?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1932&h=1000&q=80',
];

const Home: React.FC<RootStackScreenProps<'Home'>> = () => {
  const pageFlipperRef = React.useRef<PageFlipperInstance>(null);
  const [text, setText] = React.useState('');
  const [isPortrait, setIsPortrait] = React.useState(true);
  const [isSingle, setIsSingle] = React.useState(true);
  const [pressable, setPressable] = React.useState(true);
  const data = DOUBLE_PAGES; // isSingle ? SINGLE_PAGES : DOUBLE_PAGES;

  return (
    <Box flex={1} bg="white" flexDirection={{ base: 'column', lg: 'column' }} mb="l">
      <PageFlipper
        ref={pageFlipperRef}
        data={data}
        enabled={true}
        singleImageMode={isSingle}
        portrait={isPortrait}
        onFlipStart={() => console.log('FLIP START')}
        onFlippedEnd={(index) => console.log('FLIP END', index)}
        onPageDrag={() => console.log('page dragging')}
        onPageDragStart={() => console.log('page drag start')}
        onPageDragEnd={() => console.log('page drag end')}
        pressable={pressable}
      />

      <Box
        style={{
          position: 'absolute',
          top: 10,
          backgroundColor: 'rgba(0,0,0,0.75)',
          padding: 10,
        }}
      >
        <Row alignSelf="center" space={2} alignItems="center" mt="m">
          <Column>
            <Text color="white">portrait</Text>
            <Switch
              value={isPortrait}
              onValueChange={(val) => {
                setIsPortrait(val);

                if (!IS_WEB) {
                  if (val) {
                    Orientation.lockToPortrait();
                  } else {
                    Orientation.lockToLandscape();
                  }
                }
              }}
            />
          </Column>
          <Column>
            <Text color="white">single</Text>
            <Switch value={isSingle} onValueChange={() => setIsSingle(!isSingle)} />
          </Column>
          <Column>
            <Text color="white">pressable</Text>
            <Switch value={pressable} onValueChange={() => setPressable(!pressable)} />
          </Column>

          <Input width={'20'} onChangeText={setText} color="white" />
          <Button onPress={() => pageFlipperRef.current?.goToPage(Number(text))}>GO TO</Button>
        </Row>
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
      </Box>
    </Box>
  );
};

export { Home };
