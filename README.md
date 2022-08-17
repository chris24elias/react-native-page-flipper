This package allows you use a cool page curl effect on your React Native apps, it works on Android, iOS, and Web.
Check out the [demo](https://chris24elias.github.io/react-native-page-flipper/) here

## Installation

```sh
yarn add react-native-page-flipper
```

In order for this package to work properly, its built using expo-linear-gradient,react-native-gesture-handler,react-native-linear-gradient, and react-native-reanimated. So make sure you also have these installed,

```sh
yarn add expo-linear-gradient react-native-gesture-handler react-native-linear-gradient react-native-reanimated
```

Notes:
react-native-linear-gradient is used for the shadows on iOS and Android, expo-linear-gradient is used on Web.
in order to avoid page flickering with images, use react-native-fast-image as your image componenet, and preload the image files


### Landscape

![Jul-18-2022 13-58-29](https://user-images.githubusercontent.com/40448652/179574654-818e6b5d-a7d5-47a9-99ba-022ddc555ec7.gif)

### Landscape w/ singleImageMode

![Jul-18-2022 13-59-32](https://user-images.githubusercontent.com/40448652/179574828-9d8d3766-617f-4203-be0f-480eef57df1b.gif)

### Portrait

<img src="https://user-images.githubusercontent.com/40448652/179574506-b47b3c86-8ba5-4a33-a718-f451e13d53a1.gif" width="400">

## Usage

```
import PageFlipper from 'react-native-page-flipper';

const App = () => {
    return (
      <PageFlipper
        data={[
            'https://up.mangadudes.com/bleach/18/bleach-9337-e60a76a126bc6ecd3211aeaad51a7dba.jpg',
            'https://up.mangadudes.com/bleach/18/bleach-9338-89fcdb98b22c94781ba2846ea2e562c3.jpg',
            'https://up.mangadudes.com/bleach/18/bleach-9339-5d0e73373eb814d65b18bfa4ca533be8.jpg',
            'https://up.mangadudes.com/bleach/18/bleach-9340-c1220292956ae4cc1df0676e2d01c2e1.jpg',
            'https://up.mangadudes.com/bleach/18/bleach-9341-159bcbae27446cd1d6c964b4b70af020.jpg',
            'https://up.mangadudes.com/bleach/18/bleach-9342-024e1db41ff0ea6e6bc47574b209fda4.jpg',
            'https://up.mangadudes.com/bleach/18/bleach-9344-b14e956a08b6998dd00a61f89db84238.jpg',
        ]}
        pageSize={{
          height: 334, // the size of the images I plan to render (used simply to calculate ratio)
          width: 210,
        }}
        enabled={true}
        singleImageMode={true}
        portrait={true}
        pressable={true}
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
        renderPage={(data) => <Image source={{ uri: data }} style={{ height: '100%', width: '100%' }} />}
      />
    )
}

export default App;
```

### Props

| Prop name       | Type              | Default value | Description                                                                                                                                                                                  |
| --------------- | ----------------- | ------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| data            | any[]          | undefined     | The data you want to render, an array of images, or strings for text urls                                                                                                                                         |
| renderPage            | () => Element         | undefined     | The element to render for each item                                                                                                                                          |
| pageSize            | Object        | undefined     | page size (used only to calculate ratio)                                                                                                                                          |
| contentContainerStyle            | Object        | undefined     | style for content container                                                                                                                                           |
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
