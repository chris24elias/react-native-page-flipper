import usePrevious from './hooks/usePrevious';
import useSetState from './hooks/useSetState';
import React, { useEffect, useState, useCallback } from 'react';
import { useRef } from 'react';
import type { LayoutChangeEvent } from 'react-native';
import type { BookPageInstance } from './BookPage';
import type { PortraitBookInstance } from './portrait/BookPagePortrait';
import type { Page, Size } from './types';
import cacheImages from './utils/cacheImages';
import { getImageSize } from './utils/utils';
import Viewer from './Viewer';

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
    onInitialized?: (props: any) => void;
    onContainerSizeChange?: (containerSize: Size) => void;
};

export type PageFlipperInstance = {
    goToPage: (index: number) => void;
    previousPage: () => void;
    nextPage: () => void;
    getContainerSize: () => Size;
};

export type State = {
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

const logger = (msg: string) => {
    if (debug) {
        console.log(msg);
    }
};

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
            onInitialized,
            onContainerSizeChange,
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

        const getContainerSize = useCallback(() => {
            if (!state.initialized) {
                return {
                    width: 0,
                    height: 0,
                };
            }
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
        }, [
            height,
            singleImageMode,
            state.isPortrait,
            state.realImageSize.width,
            state.realImageSize.height,
            width,
            state.initialized,
        ]);

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
                getContainerSize,
            }),
            [goToPage, nextPage, previousPage, getContainerSize]
        );

        const initialize = async () => {
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

                let adjustedIndex = getAdjustedIndex(allPages);

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

                onInitialized &&
                    onInitialized({ pages: allPages, index: adjustedIndex });
            } catch (error) {
                console.error('error', error);
            }
        };

        const getAdjustedIndex = (allPages: any[]) => {
            // THIS NEEDS REWORKING
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
            return adjustedIndex;
        };

        useEffect(() => {
            initialize();
        }, [data, portrait, singleImageMode]);

        const onLayout = useCallback((e: LayoutChangeEvent) => {
            const { height, width } = e.nativeEvent.layout;
            setLayout({ height, width });
        }, []);

        const onPageFlipped = useCallback(
            (index: number) => {
                const newIndex =
                    state.nextPageIndex !== undefined
                        ? state.nextPageIndex
                        : state.pageIndex + index;

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
            },
            [
                onEndReached,
                onFlippedEnd,
                setState,
                state.nextPageIndex,
                state.pageIndex,
                state.pages,
            ]
        );

        const setIsAnimating = useCallback(
            (val: boolean) => {
                setState({
                    isAnimating: val,
                });
                isAnimatingRef.current = val;
            },
            [setState]
        );

        if (!state.initialized) {
            return null;
        }

        return (
            <Viewer
                {...{
                    state,
                    enabled,
                    getContainerSize,
                    isAnimatingRef,
                    nextBookPage,
                    onContainerSizeChange,
                    onFlipStart,
                    onLayout,
                    onPageDrag,
                    onPageDragEnd,
                    onPageDragStart,
                    onPageFlipped,
                    portraitBookPage,
                    pressable,
                    prevBookPage,
                    setIsAnimating,
                    singleImageMode,
                    renderLastPage,
                }}
            />
        );
    }
);

export default React.memo(PageFlipper);
