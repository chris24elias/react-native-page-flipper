import PageFlipper, { PageFlipperInstance } from 'react-native-page-flipper';
import { RootStackScreenProps } from '@/types';
import { IS_WEB } from '@/utils/Constants';
import { Box, Button, Column, Input, Row, Text } from 'native-base';
import * as React from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Platform, Switch, useWindowDimensions, View } from 'react-native';
import Orientation from 'react-native-orientation';
import { Image as RNImage } from 'react-native';

import { randomNumber } from '@/utils';
// import Image from 'react-native-fast-image';

const Image =
  Platform.OS === 'web' ? require('react-native').Image : require('react-native-fast-image');

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

const FAKE_TEXTS = [
  `Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Facilisis volutpat est velit egestas dui id ornare arcu odio. Sit amet commodo nulla facilisi nullam. Nullam eget felis eget nunc lobortis mattis aliquam faucibus. Sit amet luctus venenatis lectus. Velit scelerisque in dictum non. Fermentum iaculis eu non diam phasellus vestibulum lorem. Vitae elementum curabitur vitae nunc sed velit. Amet purus gravida quis blandit turpis cursus. Eget dolor morbi non arcu. Diam vulputate ut pharetra sit.

  Nec dui nunc mattis enim ut tellus. Mauris cursus mattis molestie a. Lectus urna duis convallis convallis tellus id. Elementum integer enim neque volutpat ac tincidunt vitae semper quis. Morbi non arcu risus quis varius quam quisque id diam. Pulvinar pellentesque habitant morbi tristique senectus et netus et. Fermentum posuere urna nec tincidunt praesent semper feugiat nibh sed. Amet justo donec enim diam vulputate ut pharetra sit. Viverra adipiscing at in tellus integer feugiat scelerisque. Suscipit adipiscing bibendum est ultricies integer. Vel facilisis volutpat est velit egestas. Molestie at elementum eu facilisis sed odio. Platea dictumst quisque sagittis purus sit. Risus commodo viverra maecenas accumsan lacus vel facilisis volutpat. Faucibus turpis in eu mi bibendum neque egestas congue quisque. Lacus luctus accumsan tortor posuere ac ut. Risus pretium quam vulputate dignissim suspendisse. Aliquet sagittis id consectetur purus.`,
  `Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Fermentum et sollicitudin ac orci phasellus egestas tellus rutrum tellus. Mi proin sed libero enim sed faucibus turpis in eu. Lobortis elementum nibh tellus molestie nunc. Justo donec enim diam vulputate ut pharetra. Mi in nulla posuere sollicitudin aliquam ultrices sagittis. Amet nisl suscipit adipiscing bibendum. Libero nunc consequat interdum varius sit amet mattis vulputate enim. Id faucibus nisl tincidunt eget. Lacus sed viverra tellus in hac habitasse platea. Quisque egestas diam in arcu cursus euismod quis. Purus semper eget duis at tellus at urna. Viverra aliquet eget sit amet. Varius vel pharetra vel turpis. Pretium aenean pharetra magna ac placerat vestibulum lectus mauris. Sed lectus vestibulum mattis ullamcorper. Suspendisse ultrices gravida dictum fusce ut placerat. At consectetur lorem donec massa sapien faucibus et molestie. Amet cursus sit amet dictum sit.

  Pellentesque dignissim enim sit amet venenatis urna cursus eget nunc. Interdum velit euismod in pellentesque massa placerat duis ultricies lacus. Non consectetur a erat nam at lectus urna duis. Convallis a cras semper auctor neque vitae tempus quam. In hac habitasse platea dictumst. Tellus orci ac auctor augue mauris augue neque gravida in. Odio euismod lacinia at quis risus sed vulputate odio. Sodales neque sodales ut etiam. Dignissim suspendisse in est ante in nibh mauris. Elit eget gravida cum sociis natoque penatibus et magnis dis. Varius morbi enim nunc faucibus a. Aenean euismod elementum nisi quis eleifend.`,
  `Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Purus non enim praesent elementum facilisis leo vel fringilla. Augue mauris augue neque gravida in. Aliquet lectus proin nibh nisl condimentum id venenatis a. Quisque id diam vel quam elementum pulvinar. Fermentum posuere urna nec tincidunt praesent. Dolor sit amet consectetur adipiscing elit pellentesque. Arcu odio ut sem nulla pharetra diam sit amet nisl. Vitae proin sagittis nisl rhoncus mattis rhoncus urna neque viverra. Tristique risus nec feugiat in fermentum posuere urna. Luctus accumsan tortor posuere ac ut consequat semper viverra nam. Fermentum et sollicitudin ac orci phasellus. Integer quis auctor elit sed vulputate mi. Fringilla est ullamcorper eget nulla facilisi.

Orci sagittis eu volutpat odio facilisis. Curabitur vitae nunc sed velit. Nec feugiat nisl pretium fusce id velit ut tortor pretium. Nec feugiat nisl pretium fusce id. Ullamcorper sit amet risus nullam. Sagittis id consectetur purus ut faucibus pulvinar. Dolor magna eget est lorem ipsum dolor sit amet. Laoreet id donec ultrices tincidunt arcu non sodales. Bibendum est ultricies integer quis auctor elit sed vulputate mi. Vulputate enim nulla aliquet porttitor lacus luctus accumsan tortor posuere. Aliquet nec ullamcorper sit amet risus nullam eget. Ac turpis egestas integer eget aliquet. Ornare lectus sit amet est placerat in. Odio eu feugiat pretium nibh ipsum. Cras adipiscing enim eu turpis.`,
  `Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Facilisis volutpat est velit egestas dui id ornare arcu odio. Sit amet commodo nulla facilisi nullam. Nullam eget felis eget nunc lobortis mattis aliquam faucibus. Sit amet luctus venenatis lectus. Velit scelerisque in dictum non. Fermentum iaculis eu non diam phasellus vestibulum lorem. Vitae elementum curabitur vitae nunc sed velit. Amet purus gravida quis blandit turpis cursus. Eget dolor morbi non arcu. Diam vulputate ut pharetra sit.

Nec dui nunc mattis enim ut tellus. Mauris cursus mattis molestie a. Lectus urna duis convallis convallis tellus id. Elementum integer enim neque volutpat ac tincidunt vitae semper quis. Morbi non arcu risus quis varius quam quisque id diam. Pulvinar pellentesque habitant morbi tristique senectus et netus et. Fermentum posuere urna nec tincidunt praesent semper feugiat nibh sed. Amet justo donec enim diam vulputate ut pharetra sit. Viverra adipiscing at in tellus integer feugiat scelerisque. Suscipit adipiscing bibendum est ultricies integer. Vel facilisis volutpat est velit egestas. Molestie at elementum eu facilisis sed odio. Platea dictumst quisque sagittis purus sit. Risus commodo viverra maecenas accumsan lacus vel facilisis volutpat. Faucibus turpis in eu mi bibendum neque egestas congue quisque. Lacus luctus accumsan tortor posuere ac ut. Risus pretium quam vulputate dignissim suspendisse. Aliquet sagittis id consectetur purus.`,
  `Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Fermentum et sollicitudin ac orci phasellus egestas tellus rutrum tellus. Mi proin sed libero enim sed faucibus turpis in eu. Lobortis elementum nibh tellus molestie nunc. Justo donec enim diam vulputate ut pharetra. Mi in nulla posuere sollicitudin aliquam ultrices sagittis. Amet nisl suscipit adipiscing bibendum. Libero nunc consequat interdum varius sit amet mattis vulputate enim. Id faucibus nisl tincidunt eget. Lacus sed viverra tellus in hac habitasse platea. Quisque egestas diam in arcu cursus euismod quis. Purus semper eget duis at tellus at urna. Viverra aliquet eget sit amet. Varius vel pharetra vel turpis. Pretium aenean pharetra magna ac placerat vestibulum lectus mauris. Sed lectus vestibulum mattis ullamcorper. Suspendisse ultrices gravida dictum fusce ut placerat. At consectetur lorem donec massa sapien faucibus et molestie. Amet cursus sit amet dictum sit.

Pellentesque dignissim enim sit amet venenatis urna cursus eget nunc. Interdum velit euismod in pellentesque massa placerat duis ultricies lacus. Non consectetur a erat nam at lectus urna duis. Convallis a cras semper auctor neque vitae tempus quam. In hac habitasse platea dictumst. Tellus orci ac auctor augue mauris augue neque gravida in. Odio euismod lacinia at quis risus sed vulputate odio. Sodales neque sodales ut etiam. Dignissim suspendisse in est ante in nibh mauris. Elit eget gravida cum sociis natoque penatibus et magnis dis. Varius morbi enim nunc faucibus a. Aenean euismod elementum nisi quis eleifend.`,
  `Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Purus non enim praesent elementum facilisis leo vel fringilla. Augue mauris augue neque gravida in. Aliquet lectus proin nibh nisl condimentum id venenatis a. Quisque id diam vel quam elementum pulvinar. Fermentum posuere urna nec tincidunt praesent. Dolor sit amet consectetur adipiscing elit pellentesque. Arcu odio ut sem nulla pharetra diam sit amet nisl. Vitae proin sagittis nisl rhoncus mattis rhoncus urna neque viverra. Tristique risus nec feugiat in fermentum posuere urna. Luctus accumsan tortor posuere ac ut consequat semper viverra nam. Fermentum et sollicitudin ac orci phasellus. Integer quis auctor elit sed vulputate mi. Fringilla est ullamcorper eget nulla facilisi.

Orci sagittis eu volutpat odio facilisis. Curabitur vitae nunc sed velit. Nec feugiat nisl pretium fusce id velit ut tortor pretium. Nec feugiat nisl pretium fusce id. Ullamcorper sit amet risus nullam. Sagittis id consectetur purus ut faucibus pulvinar. Dolor magna eget est lorem ipsum dolor sit amet. Laoreet id donec ultrices tincidunt arcu non sodales. Bibendum est ultricies integer quis auctor elit sed vulputate mi. Vulputate enim nulla aliquet porttitor lacus luctus accumsan tortor posuere. Aliquet nec ullamcorper sit amet risus nullam eget. Ac turpis egestas integer eget aliquet. Ornare lectus sit amet est placerat in. Odio eu feugiat pretium nibh ipsum. Cras adipiscing enim eu turpis.`,
];

const preload = (images: string[]) => {
  images.forEach((image) => {
    RNImage.prefetch(image);
  });
};

preload(SINGLE_PAGES);

const Home: React.FC<RootStackScreenProps<'Home'>> = () => {
  const { height, width } = useWindowDimensions();
  const pageFlipperRef = React.useRef<PageFlipperInstance>(null);
  const [text, setText] = React.useState('');
  const [isPortrait, setIsPortrait] = React.useState(false);
  const [isSingle, setIsSingle] = React.useState(true);
  const [pressable, setPressable] = React.useState(true);
  const data = SINGLE_PAGES; // isSingle ? SINGLE_PAGES : DOUBLE_PAGES;
  const renderOptions = true;
  const safeInsets = useSafeAreaInsets();

  return (
    <Box
      flex={1}
      bg="white"
      style={
        {
          // paddingTop: safeInsets.top,
          // paddingBottom: safeInsets.bottom,
        }
      }
      flexDirection={{ base: 'column', lg: 'column' }}
      // mb="l"
    >
      <PageFlipper
        ref={pageFlipperRef}
        data={FAKE_TEXTS}
        enabled={false}
        singleImageMode={isSingle}
        portrait={isPortrait}
        onFlipStart={() => console.log('FLIP START')}
        onFlippedEnd={(i) => {
          console.log('FLIP END', i);
        }}
        onPageDrag={() => console.log('page dragging')}
        onPageDragStart={() => console.log('page drag start')}
        onPageDragEnd={() => console.log('page drag end')}
        pressable={pressable}
        renderPage={(data) => {
          return (
            <View
              style={{
                flex: 1,
                padding: 15,
                backgroundColor: 'white',
                paddingTop: safeInsets.top,
                paddingBottom: safeInsets.bottom,
              }}
            >
              <Text selectable>{data}</Text>
            </View>
            // <Image
            //   source={{ uri: data }}
            //   style={{ height: '100%', width: '100%' }}
            //   // resizeMode={'contain'}
            // />
          );
        }}
        pageSize={{
          height: 650,
          width: 400,
        }}
        // renderContainer={(props) => {
        //   if (!isPortrait) {
        //     return (
        //       <Box style={{ height: '100%', width: '100%' }}>
        //         <Image
        //           source={require('./bookFrame.png')}
        //           style={{
        //             height: '100%',
        //             width: '100%',
        //             position: 'absolute',
        //             zIndex: -1,
        //             top: '2%',
        //             transform: [
        //               {
        //                 scaleX: 1.05,
        //               },
        //               { scaleY: 1.11 },
        //             ],
        //           }}
        //           resizeMode="stretch"
        //           pointerEvents="none"
        //         />

        //         {props.children}
        //       </Box>
        //     );
        //   }

        //   return <View style={{ height: '100%', width: '100%' }} {...props} />;
        // }}
      />
      {renderOptions && (
        <Box
          style={{
            position: 'absolute',
            top: 10,
            backgroundColor: 'rgba(0,0,0,0.75)',
            padding: 10,
            opacity: 0.2,
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
      )}
    </Box>
  );
};

export { Home };
