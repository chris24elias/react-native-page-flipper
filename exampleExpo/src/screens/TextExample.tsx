import PageFlipper, { PageFlipperInstance } from 'react-native-page-flipper';
import { Box, Button, Row, Text } from 'native-base';
import * as React from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { View } from 'react-native';
import { IS_WEB } from '@/utils/Constants';

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

const TextExample = () => {
  const safeInsets = useSafeAreaInsets();
  const pageFlipperRef = React.useRef<PageFlipperInstance>(null);
  return (
    <Box flex={1} bg="white">
      <Box position="absolute" zIndex={5}>
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
      <PageFlipper
        ref={pageFlipperRef}
        data={FAKE_TEXTS}
        pageSize={{
          height: 650,
          width: 400,
        }}
        enabled={false}
        singleImageMode={true}
        portrait={IS_WEB ? false : true}
        pressable={false}
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
            <View
              style={{
                flex: 1,
                padding: 15,
                backgroundColor: 'white',
                paddingTop: safeInsets.top,
                paddingBottom: safeInsets.bottom,
              }}
            >
              <Text selectable adjustsFontSizeToFit>
                {data}
              </Text>
            </View>
          );
        }}
      />
    </Box>
  );
};

export { TextExample };
