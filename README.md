### Props

| Prop name       | Type              | Default value | Description                                                                                                                                                                                  |
| --------------- | ----------------- | ------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| data            | string[]          | undefined     | The pages you want to render, an array of image urls                                                                                                                                         |
| enabled         | bool              | true          | enables / disables the pan gesture handler of the pages                                                                                                                                      |
| pressable       | bool              | true          | enables / disables the tapping on the pages to flip                                                                                                                                          |
| singleImageMode | bool              | true          | Defines whether each page is treated as a single image or two in one. (see below)                                                                                                            |
| renderLastPage  | () => JSX.Element | undefined     | optional function to render the last page (only applies when not in portrait mode and have an odd number of pages)                                                                           |
| portrait        | bool              | false         | sets portrait mode (viewing a single page at a time, see below)                                                                                                                              |
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
