import "react-native-gesture-handler";
import "react-native-reanimated";
import { StatusBar } from "expo-status-bar";
import { SafeAreaProvider } from "react-native-safe-area-context";
import useCachedResources from "./src/hooks/useCachedResources";
import useColorScheme from "./src/hooks/useColorScheme";
import Navigation from "./src/navigation";
import { NativeBaseProvider } from "native-base";
import theme from "./src/theme/theme";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { IS_WEB } from "./src/utils/Constants";
import { QueryClient, QueryClientProvider } from "react-query";

if (__DEV__ && !IS_WEB) {
  import("./src/ReactotronConfig").then(() =>
    console.log("Reactotron Configured")
  );
}

const queryClient = new QueryClient();

export default function App() {
  const isLoadingComplete = useCachedResources();
  const colorScheme = useColorScheme();

  if (!isLoadingComplete) {
    return null;
  } else {
    return (
      <GestureHandlerRootView style={{ flex: 1 }}>
        <QueryClientProvider client={queryClient}>
          <NativeBaseProvider theme={theme}>
            <SafeAreaProvider>
              <Navigation colorScheme={colorScheme} />
              <StatusBar />
            </SafeAreaProvider>
          </NativeBaseProvider>
        </QueryClientProvider>
      </GestureHandlerRootView>
    );
  }
}
