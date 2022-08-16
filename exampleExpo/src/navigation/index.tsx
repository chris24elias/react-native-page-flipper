import { LandscapeExample } from '@/screens/LanscapeExample';
import { Main } from '@/screens/Main';
import { PortraitExample } from '@/screens/PortraitExample';
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
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export { Navigation };
