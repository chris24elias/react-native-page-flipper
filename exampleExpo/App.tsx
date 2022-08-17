import 'react-native-gesture-handler';
import 'react-native-reanimated';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import useCachedResources from './src/hooks/useCachedResources';
import { NativeBaseProvider } from 'native-base';
import theme from './src/theme/theme';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Navigation } from './src/navigation';

export default function App() {
  const isLoadingComplete = useCachedResources();

  if (!isLoadingComplete) {
    return null;
  } else {
    return (
      <GestureHandlerRootView style={{ flex: 1 }}>
        <NativeBaseProvider theme={theme}>
          <SafeAreaProvider>
            <Navigation />
            <StatusBar />
          </SafeAreaProvider>
        </NativeBaseProvider>
      </GestureHandlerRootView>
    );
  }
}
