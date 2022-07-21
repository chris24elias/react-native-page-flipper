This package allows you use a cool page curl effect on your React Native apps, it works on Android, iOS, and Web.
Check out the [demo](https://chris24elias.github.io/react-native-page-flipper/) here

## Installation

```sh
yarn add react-native-page-flipper
```

In order for this package to work properly, its built using expo-linear-gradient, react-native-fast-image,react-native-gesture-handler,react-native-linear-gradient, and react-native-reanimated. So make sure you also have these installed,

```sh
yarn add expo-linear-gradient react-native-fast-image react-native-gesture-handler react-native-linear-gradient react-native-reanimated
```

Notes:
react-native-linear-gradient is used for the shadows on iOS and Android, expo-linear-gradient is used on Web.
The PageFlipper works on the assumption that each image (url) in the data arrary are of the same dimensions, it wont work well if you have various image sizes.

### Landscape

![Jul-18-2022 13-58-29](https://user-images.githubusercontent.com/40448652/179574654-818e6b5d-a7d5-47a9-99ba-022ddc555ec7.gif)

### Landscape w/ singleImageMode

![Jul-18-2022 13-59-32](https://user-images.githubusercontent.com/40448652/179574828-9d8d3766-617f-4203-be0f-480eef57df1b.gif)

### Portrait

![Jul-18-2022 14-04-53](https://user-images.githubusercontent.com/40448652/179574506-b47b3c86-8ba5-4a33-a718-f451e13d53a1.gif)

## Usage

```
import PageFlipper from 'react-native-page-flipper';

const App = () => {

    const [index, setIndex] = useState(0);

    return (
        <PageFlipper
            data={data}
            onFlippedEnd={(i) => setIndex(i)}
        />
    )
}

export default App;

```

### Props

| Prop name       | Type              | Default value | Description                                                                                                                                                                                  |
| --------------- | ----------------- | ------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| data            | string[]          | undefined     | The pages you want to render, an array of image urls                                                                                                                                         |
| enabled         | bool              | true          | enables / disables the pan gesture handler of the pages                                                                                                                                      |
| pressable       | bool              | true          | enables / disables the tapping on the pages to flip                                                                                                                                          |
| singleImageMode | bool              | true          | Defines whether each page is treated as a single image or two in one. (see above)                                                                                                            |
| renderLastPage  | () => JSX.Element | undefined     | optional function to render the last page (only applies when not in portrait mode and have an odd number of pages)                                                                           |
| portrait        | bool              | false         | sets portrait mode (viewing a single page at a time, see above)                                                                                                                              |
| onFlippedEnd    | Function          | undefined     | Callback for when the page has finished flipping                                                                                                                                             |
| onFlippedStart  | Function          | undefined     | Callback for when the page has started flipping, (does not trigger when user begins dragging the page, only when manually flipped by tapping the page or calling one of the exposed methods) |
| onPageDragStart | Function          | undefined     | Callback for when the page has started dragging (user dragging with finger)                                                                                                                  |
| onPageDrag      | Function          | undefined     | Callback for when the page is actively being dragged                                                                                                                                         |
| onPageDragEnd   | Function          | undefined     | Callback for when the page has finished dragging                                                                                                                                             |
| onInitialized   | Function          | undefined     | Callback for when the page flipper is initialized                                                                                                                                            |
| renderContainer | Function          | undefined     | function to return an element for rendering the container of the viewer                                                                                                                      |
| onEndReached    | Function          | undefined     | Callback for when the page flipper reaches the last page                                                                                                                                     |

### Methods

| Method name  | Description                       |
| ------------ | --------------------------------- |
| goToPage     | flips to the page index passed in |
| previousPage | flips to the previous page        |
| nextPage     | flips to the next page            |
