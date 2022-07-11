import usePrevious from './hooks/usePrevious';
import useSetState from './hooks/useSetState';
import React, { useEffect, useState, useCallback } from 'react';
import { useRef } from 'react';
import { LayoutChangeEvent, StyleSheet, Text, View } from 'react-native';
import { BookPage, BookPageInstance, IBookPageProps } from './BookPage';
import { BookPageBackground } from './BookPageBackground';
import Image from './Components/Image';
import {
    BookPagePortrait,
    PortraitBookInstance,
} from './portrait/BookPagePortrait';
import type { Page, Size } from './types';
import cacheImages from './utils/cacheImages';
import { getImageSize } from './utils/utils';

export type IPageFlipperProps = {
    data: string[];
    enabled?: boolean; // gestures
    pressable?: boolean; // are the pages tappable
    singleImageMode?: boolean;
    renderLastPage?: () => React.ReactElement;
    portrait?: boolean;
    onFlippedEnd?: (index: number) => void;
    onFlipStart?: (id: number) => void;

    onPageDragStart?: () => void;
    onPageDrag?: () => void;
    onPageDragEnd?: () => void;
    onEndReached?: () => void;
};

export type PageFlipperInstance = {
    goToPage: (index: number) => void;
    previousPage: () => void;
    nextPage: () => void;
};

type State = {
    pageIndex: number;
    pages: Page[];
    isAnimating: boolean;
    initialized: boolean;
    realImageSize: Size;
    prev: Page;
    current: Page;
    next: Page;
    nextPageIndex?: number;
    isPortrait: boolean;
};

const debug = true;

const PageFlipper = React.forwardRef<PageFlipperInstance, IPageFlipperProps>(
    (
        {
            data,
            enabled = true,
            pressable = true,
            singleImageMode = true,
            renderLastPage,
            portrait = false,
            onFlippedEnd,
            onFlipStart,
            onPageDrag,
            onPageDragEnd,
            onPageDragStart,
            onEndReached,
        },
        ref
    ) => {
        const [layout, setLayout] = useState({ height: 0, width: 0 });
        const { width, height } = layout;
        const [state, setState] = useSetState<State>({
            pageIndex: 0,
            pages: [],
            isAnimating: false,
            initialized: false,
            realImageSize: { width: 0, height: 0 },
            prev: { left: '', right: '' },
            current: { left: '', right: '' },
            next: { left: '', right: '' },
            nextPageIndex: undefined,
            isPortrait: portrait,
        });
        const isAnimatingRef = useRef(false);
        const prevBookPage = useRef<BookPageInstance>(null);
        const nextBookPage = useRef<BookPageInstance>(null);
        const portraitBookPage = useRef<PortraitBookInstance>(null);
        const previousPortrait = usePrevious(portrait);

        const logger = (msg: string) => {
            if (debug) {
                console.log(msg);
            }
        };

        const goToPage = useCallback(
            (index: number) => {
                if (index === undefined || index === null) {
                    logger('index cannot be undefined or null');
                    return;
                }

                if (typeof index !== 'number' || isNaN(index)) {
                    logger('index must be a number');
                    return;
                }

                if (index < 0 || index > state.pages.length - 1) {
                    logger('invalid page');
                    return;
                }

                if (isAnimatingRef.current) {
                    logger('is already animating');
                    return;
                }

                if (index === state.pageIndex) {
                    logger('same page');
                    return;
                }

                if (index > state.pageIndex) {
                    setState({
                        next: state.pages[index],
                        nextPageIndex: index,
                    });
                } else {
                    setState({
                        prev: state.pages[index],
                        nextPageIndex: index,
                    });
                }
            },
            [setState, state.pageIndex, state.pages]
        );

        const previousPage = useCallback(() => {
            const newIndex = state.pageIndex - 1;
            goToPage(newIndex);
        }, [goToPage, state.pageIndex]);

        const nextPage = useCallback(() => {
            const newIndex = state.pageIndex + 1;
            goToPage(newIndex);
        }, [goToPage, state.pageIndex]);

        useEffect(() => {
            if (state.nextPageIndex !== undefined) {
                if (!state.isPortrait) {
                    if (state.nextPageIndex > state.pageIndex) {
                        nextBookPage.current?.turnPage();
                    } else {
                        prevBookPage.current?.turnPage();
                    }
                } else {
                    portraitBookPage.current?.turnPage(
                        state.nextPageIndex > state.pageIndex ? 1 : -1
                    );
                }
            }
        }, [state.nextPageIndex]);

        React.useImperativeHandle(
            ref,
            () => ({
                goToPage,
                nextPage,
                previousPage,
            }),
            [goToPage, nextPage, previousPage]
        );

        const initialize = useCallback(async () => {
            try {
                const allPages: Page[] = [];

                if (portrait) {
                    if (!singleImageMode) {
                        data.forEach((page) => {
                            allPages.push({
                                left: page,
                                right: page,
                            });
                            allPages.push({
                                left: page,
                                right: page,
                            });
                        });
                    } else {
                        for (let i = 0; i < data.length; i++) {
                            allPages[i] = {
                                left: data[i],
                                right: data[i],
                            };
                        }
                    }
                } else {
                    for (let i = 0; i < data.length; i++) {
                        if (singleImageMode) {
                            allPages.push({
                                left: data[i],
                                right: data[i + 1],
                            });
                            i++;
                        } else {
                            allPages.push({
                                left: data[i],
                                right: data[i],
                            });
                        }
                    }
                }

                cacheImages(data.map((uri) => ({ uri })));

                const realImageSize = await getImageSize(data[0]);

                // this is not 100% yet, still has some edge cases where it fails
                let adjustedIndex = state.pageIndex;
                if (
                    previousPortrait !== undefined &&
                    previousPortrait !== portrait &&
                    singleImageMode
                ) {
                    if (portrait) {
                        adjustedIndex *= 2;
                    } else {
                        adjustedIndex = Math.floor(
                            adjustedIndex % 2 === 0
                                ? adjustedIndex / 2
                                : (adjustedIndex - 1) / 2
                        );
                    }
                }

                if (adjustedIndex < 0 || adjustedIndex > allPages.length - 1) {
                    // invalid index, reset to 0
                    adjustedIndex = 0;
                }

                const prev = allPages[adjustedIndex - 1];
                const current = allPages[adjustedIndex];
                const next = allPages[adjustedIndex + 1];

                setState({
                    initialized: true,
                    pages: allPages,
                    realImageSize,
                    prev,
                    current,
                    next,
                    pageIndex: adjustedIndex,
                    isPortrait: portrait,
                });
            } catch (error) {
                console.error('error', error);
            }
        }, [
            data,
            portrait,
            previousPortrait,
            setState,
            state.pageIndex,
            singleImageMode,
        ]);

        useEffect(() => {
            initialize();
        }, [data, portrait, singleImageMode, initialize]);

        const onLayout = (e: LayoutChangeEvent) => {
            const { height, width } = e.nativeEvent.layout;
            setLayout({ height, width });
        };

        const getContainerSize = () => {
            let size = {
                height: state.realImageSize.height,
                width:
                    singleImageMode && !state.isPortrait
                        ? state.realImageSize.width * 2
                        : state.realImageSize.width,
            };

            if (!singleImageMode && state.isPortrait) {
                size = {
                    height: state.realImageSize.height,
                    width: state.realImageSize.width / 2,
                };
            }

            let containerSize: Size;

            if (size.height > size.width) {
                const ratio = size.height / size.width;
                containerSize = {
                    height: width * ratio,
                    width,
                };

                if (containerSize.height > height) {
                    const diff = containerSize.height / height;
                    containerSize.height = height;
                    containerSize.width = containerSize.width / diff;
                }
            } else {
                const ratio = size.width / size.height;
                containerSize = {
                    height,
                    width: height * ratio,
                };
                if (containerSize.width > width) {
                    const diff = containerSize.width / width;
                    containerSize.width = width;
                    containerSize.height = containerSize.height / diff;
                }
            }

            return containerSize;
        };

        const onPageFlipped = (index: number) => {
            const newIndex =
                state.nextPageIndex !== undefined
                    ? state.nextPageIndex
                    : pageIndex + index;

            if (newIndex < 0 || newIndex > state.pages.length - 1) {
                // this if condition theoretically should never occur in the first place, so it could be removed but it's here just in case
                logger('invalid page');

                setState({
                    isAnimating: false,
                    nextPageIndex: undefined,
                });
                isAnimatingRef.current = false;
                return;
            }

            const prev = state.pages[newIndex - 1];
            const current = state.pages[newIndex];
            const next = state.pages[newIndex + 1];
            setState({
                pageIndex: newIndex,
                isAnimating: false,
                prev,
                current,
                next,
                nextPageIndex: undefined,
            });
            isAnimatingRef.current = false;
            if (onFlippedEnd && typeof onFlippedEnd === 'function') {
                onFlippedEnd(newIndex);
            }

            if (newIndex === state.pages.length - 1) {
                onEndReached && onEndReached();
            }
        };

        const setIsAnimating = (val: boolean) => {
            setState({
                isAnimating: val,
            });
            isAnimatingRef.current = val;
        };

        const getLastPage = () => {
            if (renderLastPage) {
                return renderLastPage();
            }

            return (
                <View style={styles.container}>
                    <Text>last page</Text>
                </View>
            );
        };

        const getBookImageStyle = (right: boolean, front: boolean) => {
            if (!singleImageMode && state.isPortrait) {
                const imageStyle: any = {
                    height: containerSize.height,
                    width: containerSize.width * 2,
                    position: 'absolute',
                };

                const isEvenPage = state.pageIndex % 2 === 0;

                if (front) {
                    if (isEvenPage) {
                        imageStyle.left = right ? 0 : -containerSize.width;
                    } else {
                        imageStyle.left = right ? -containerSize.width : 0;
                    }
                } else {
                    if (isEvenPage) {
                        imageStyle.left = right ? -containerSize.width : 0;
                    } else {
                        imageStyle.left = right ? 0 : -containerSize.width;
                    }
                }
                return imageStyle;
            }

            const imageStyle: any = {
                height: containerSize.height,
                width:
                    singleImageMode && !state.isPortrait
                        ? containerSize.width / 2
                        : containerSize.width,
                position: 'absolute',
            };

            const offset = singleImageMode ? 0 : -containerSize.width / 2;

            if (state.isPortrait && front) {
                imageStyle.left = 0;
            } else if ((front && right) || (!front && right)) {
                // front right or back right
                imageStyle.left = offset;
            } else if (front && !right) {
                // front left
                imageStyle.right = offset;
            }

            return imageStyle;
        };

        const containerSize = getContainerSize();

        const { pageIndex, pages, prev, current, next } = state;

        const isFirstPage = pageIndex === 0;
        const isLastPage = pageIndex === pages.length - 1;
        const shouldRenderLastPage =
            isLastPage && singleImageMode && data.length % 2 !== 0;

        const bookPageProps: Omit<IBookPageProps, 'right' | 'front' | 'back'> =
            {
                containerSize: containerSize,
                isAnimating: state.isAnimating,
                enabled,
                setIsAnimating: setIsAnimating,
                isAnimatingRef: isAnimatingRef,
                onPageFlip: onPageFlipped,
                getBookImageStyle,
                single: singleImageMode,
                onFlipStart,
                onPageDrag,
                onPageDragEnd,
                onPageDragStart,
                isPressable: pressable,
            };

        if (!state.initialized) {
            return null;
        }

        return (
            <View style={styles.container} onLayout={onLayout}>
                <View
                    style={[
                        styles.contentContainer,
                        {
                            height: containerSize.height,
                            width: containerSize.width,
                        },
                    ]}
                >
                    {!state.isPortrait ? (
                        <View style={styles.content}>
                            {!prev ? (
                                <Empty />
                            ) : (
                                <BookPage
                                    ref={prevBookPage}
                                    right={false}
                                    front={current}
                                    back={prev}
                                    key={`left${pageIndex}`}
                                    {...bookPageProps}
                                />
                            )}
                            {!next ? (
                                shouldRenderLastPage ? (
                                    getLastPage()
                                ) : (
                                    <Empty />
                                )
                            ) : (
                                <BookPage
                                    ref={nextBookPage}
                                    right
                                    front={current}
                                    back={next}
                                    key={`right${pageIndex}`}
                                    {...bookPageProps}
                                />
                            )}
                            <BookPageBackground
                                left={!prev ? current.left : prev.left}
                                right={!next ? current.right : next.right}
                                isFirstPage={isFirstPage}
                                isLastPage={isLastPage}
                                getBookImageStyle={getBookImageStyle}
                                containerSize={containerSize}
                            />
                        </View>
                    ) : (
                        <View style={{ flex: 1, overflow: 'hidden' }}>
                            <View style={{ ...StyleSheet.absoluteFillObject }}>
                                <BookPagePortrait
                                    {...bookPageProps}
                                    current={current}
                                    prev={prev}
                                    next={next}
                                    onPageFlip={onPageFlipped}
                                    key={`right${pageIndex}`}
                                    ref={portraitBookPage}
                                />
                            </View>
                            {next && (
                                <View
                                    style={{
                                        ...StyleSheet.absoluteFillObject,
                                        zIndex: -5,
                                        overflow: 'hidden',
                                    }}
                                >
                                    <Image
                                        source={{ uri: next.right }}
                                        style={getBookImageStyle(true, false)}
                                    />
                                </View>
                            )}
                        </View>
                    )}
                </View>
            </View>
        );
    }
);

export { PageFlipper };
export default PageFlipper;

const Empty = () => <View style={styles.container} />;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    contentContainer: {
        flexDirection: 'row',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
        backgroundColor: 'white',
    },
    content: {
        flex: 1,
        flexDirection: 'row',
        overflow: 'hidden',
    },
});
