### Props

| Prop name       | Type              | Default value | Description                                                                                                                                                                         |
| --------------- | ----------------- | ------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| data            | string[]          | undefined     | The pages you want to render, an array of image urls                                                                                                                                |
| enabled         | bool              | true          | enables / disables the pan gesture handler of the pages                                                                                                                             |
| singleImageMode | bool              | true          | Defines whether each page is treated as a single image or two in one. (see below)                                                                                                   |
| renderLastPage  | () => JSX.Element | undefined     | optional function to render the last page (only applies when not in portrait mode and have an odd number of pages)                                                                  |
| portrait        | bool              | false         | sets portrait mode (viewing a single page at a time, see below)                                                                                                                     |
| onFlippedEnd    | Function          | undefined     | Callback for when the page has finished flipping                                                                                                                                    |
| onFlippedStart  | Function          | undefined     | Callback for when the page has started flipping, (does not trigger when user begins dragging the page, only when manually flipped by tapping or calling one of the exposed methods) |

### Methods

| Method name  | Description                       |
| ------------ | --------------------------------- |
| goToPage     | flips to the page index passed in |
| previousPage | flips to the previous page        |
| nextPage     | flips to the next page            |
