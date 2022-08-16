import { Pressable, Text } from 'native-base';
import React from 'react';
import { View } from 'react-native';

export type IMainProps = {};

const Main: React.FC<IMainProps> = ({ navigation }) => {
  return (
    <View>
      <Pressable onPress={() => navigation.navigate('TextExample')}>
        <Text>Text Example</Text>
      </Pressable>
      <Pressable onPress={() => navigation.navigate('PortraitExample')}>
        <Text>Portrait Example</Text>
      </Pressable>
      <Pressable onPress={() => navigation.navigate('LandscapeExample')}>
        <Text>Landscape Example</Text>
      </Pressable>
      <Pressable onPress={() => navigation.navigate('CustomContainerExample')}>
        <Text>Custom Container Example</Text>
      </Pressable>
    </View>
  );
};

export { Main };
