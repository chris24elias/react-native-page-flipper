import { AnimatedExample } from '@/screens/AnimatedExample';
import { CustomContainerExample } from '@/screens/CustomContainerExample';
import { LandscapeExample } from '@/screens/LanscapeExample';
import { Main } from '@/screens/Main';
import { PortraitExample } from '@/screens/PortraitExample';
import { SingleImageDisabledExample } from '@/screens/SingleImageDisabledExample';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';
import { TextExample } from '../screens/TextExample';

export type INavigationProps = {};

const Stack = createNativeStackNavigator();

const Navigation: React.FC<INavigationProps> = ({}) => {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Main" component={Main} />
        <Stack.Screen name="TextExample" component={TextExample} />
        <Stack.Screen name="PortraitExample" component={PortraitExample} />
        <Stack.Screen name="LandscapeExample" component={LandscapeExample} />
        <Stack.Screen name="CustomContainerExample" component={CustomContainerExample} />
        <Stack.Screen name="AnimatedExample" component={AnimatedExample} />
        <Stack.Screen name="SingleImageDisabledExample" component={SingleImageDisabledExample} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export { Navigation };
