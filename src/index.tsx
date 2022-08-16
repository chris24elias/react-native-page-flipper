import usePrevious from './hooks/usePrevious';
import useSetState from './hooks/useSetState';
import React, { useEffect, useState, useCallback, useMemo } from 'react';
import { useRef } from 'react';
import { LayoutChangeEvent, StyleSheet, View, ViewStyle } from 'react-native';
import { BookPage, BookPageInstance, IBookPageProps } from './BookPage';
import {
    BookPagePortrait,
    PortraitBookInstance,
} from './portrait/BookPagePortrait';
import type { Page, Size } from './types';
import { createPages } from './utils/utils';
import { BookPageBackground } from './BookPageBackground';

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
    renderContainer?: () => any;
    renderPage?: (data: any) => any;
    pageSize: Size;
    contentContainerStyle: ViewStyle;
};

export type PageFlipperInstance = {
    goToPage: (index: number) => void;
    previousPage: () => void;
    nextPage: () => void;
};

export type State = {
    pageIndex: number;
    pages: Page[];
    isAnimating: boolean;
    initialized: boolean;
    // pageSize: Size;
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
            renderContainer,
            renderPage,
            pageSize = { height: 600, width: 400 },
            contentContainerStyle,
        },
        ref
    ) => {
        const [{ width, height }, setLayout] = useState({
            height: 0,
            width: 0,
        });
        const [state, setState] = useSetState<State>({
            pageIndex: 0,
            pages: [],
            isAnimating: false,
            initialized: false,
            // pageSize: { width: 0, height: 0 },
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
        const containerSize = useMemo(() => {
            if (!state.initialized) {
                return {
                    width: 0,
                    height: 0,
                };
            }
            let size = {
                height: pageSize.height,
                width:
                    singleImageMode && !state.isPortrait
                        ? pageSize.width * 2
                        : pageSize.width,
            };

            if (!singleImageMode && state.isPortrait) {
                size = {
                    height: pageSize.height,
                    width: pageSize.width / 2,
                };
            }

            let finalSize: Size;

            // corrections
            if (size.height > size.width) {
                const ratio = size.height / size.width;
                finalSize = {
                    height: width * ratio,
                    width,
                };

                if (finalSize.height > height) {
                    const diff = finalSize.height / height;
                    finalSize.height = height;
                    finalSize.width = finalSize.width / diff;
                }
            } else {
                const ratio = size.width / size.height;
                finalSize = {
                    height,
                    width: height * ratio,
                };
                if (finalSize.width > width) {
                    const diff = finalSize.width / width;
                    finalSize.width = width;
                    finalSize.height = finalSize.height / diff;
                }
            }

            return finalSize;
        }, [
            height,
            singleImageMode,
            width,
            state.initialized,
            state.isPortrait,
            pageSize.height,
            pageSize.width,
        ]);

        useEffect(() => {
            const initialize = async () => {
                try {
                    const allPages = createPages({
                        portrait,
                        singleImageMode,
                        data,
                    });

                    let adjustedIndex = getAdjustedIndex(allPages);

                    setState({
                        initialized: true,
                        pages: allPages,
                        prev: allPages[adjustedIndex - 1],
                        current: allPages[adjustedIndex],
                        next: allPages[adjustedIndex + 1],
                        pageIndex: adjustedIndex,
                        isPortrait: portrait,
                    });

                    if (onInitialized) {
                        onInitialized({
                            pages: allPages,
                            index: adjustedIndex,
                        });
                    }
                } catch (error) {
                    console.error('error', error);
                }
            };
            initialize();
            // eslint-disable-next-line
        }, [data, portrait, singleImageMode]);

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
            // eslint-disable-next-line
        }, [state.nextPageIndex]);

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

        React.useImperativeHandle(
            ref,
            () => ({
                goToPage,
                nextPage,
                previousPage,
            }),
            [goToPage, nextPage, previousPage]
        );

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

        const onLayout = (e: LayoutChangeEvent) => {
            setLayout({
                height: e.nativeEvent.layout.height,
                width: e.nativeEvent.layout.width,
            });
        };

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

                if (newIndex === state.pages.length - 1 && onEndReached) {
                    onEndReached();
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

        const getPageStyle = (right: boolean, front: boolean) => {
            if (!singleImageMode && isPortrait) {
                const pageStyle: any = {
                    height: containerSize.height,
                    width: containerSize.width * 2,
                    position: 'absolute',
                };

                const isEvenPage = pageIndex % 2 === 0;

                if (front) {
                    if (isEvenPage) {
                        pageStyle.left = right ? 0 : -containerSize.width;
                    } else {
                        pageStyle.left = right ? -containerSize.width : 0;
                    }
                } else {
                    if (isEvenPage) {
                        pageStyle.left = right ? -containerSize.width : 0;
                    } else {
                        pageStyle.left = right ? 0 : -containerSize.width;
                    }
                }
                return pageStyle;
            }

            const pageStyle: any = {
                height: containerSize.height,
                width:
                    singleImageMode && !isPortrait
                        ? containerSize.width / 2
                        : containerSize.width,
                position: 'absolute',
            };

            const offset = singleImageMode ? 0 : -containerSize.width / 2;

            if (isPortrait && front) {
                pageStyle.left = 0;
            } else if ((front && right) || (!front && right)) {
                // front right or back right
                pageStyle.left = offset;
            } else if (front && !right) {
                // front left
                pageStyle.right = offset;
            }

            return pageStyle;
        };

        if (!state.initialized) {
            return null;
        }

        const {
            current,
            pageIndex,
            pages,
            next,
            prev,
            isPortrait,
            isAnimating,
        } = state;
        const isFirstPage = pageIndex === 0;
        const isLastPage = pageIndex === pages.length - 1;
        const isSecondToLastPage = pageIndex === pages.length - 2;
        const shouldRenderLastPage =
            (isSecondToLastPage || isLastPage) &&
            singleImageMode &&
            data.length % 2 !== 0;

        const bookPageProps: Omit<IBookPageProps, 'right' | 'front' | 'back'> =
            {
                containerSize: containerSize,
                isAnimating: isAnimating,
                enabled,
                setIsAnimating: setIsAnimating,
                isAnimatingRef: isAnimatingRef,
                onPageFlip: onPageFlipped,
                getPageStyle,
                single: singleImageMode,
                onFlipStart,
                onPageDrag,
                onPageDragEnd,
                onPageDragStart,
                isPressable: pressable,
                renderPage,
            };

        const ContentWrapper = renderContainer ? renderContainer : Wrapper;

        return (
            <View style={styles.container} onLayout={onLayout}>
                <View
                    style={[
                        styles.contentContainer,
                        {
                            height: containerSize.height,
                            width: containerSize.width,
                        },
                        contentContainerStyle,
                    ]}
                >
                    <ContentWrapper>
                        {!isPortrait ? (
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
                                    <Empty />
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
                                    getPageStyle={getPageStyle}
                                    containerSize={containerSize}
                                    renderPage={renderPage}
                                    renderLastPage={renderLastPage}
                                    shouldRenderLastPage={shouldRenderLastPage}
                                />
                            </View>
                        ) : (
                            <View style={styles.portraitContent}>
                                <View
                                    style={{ ...StyleSheet.absoluteFillObject }}
                                >
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
                                        {renderPage && (
                                            <View
                                                style={getPageStyle(
                                                    true,
                                                    false
                                                )}
                                            >
                                                {renderPage(next.right)}
                                            </View>
                                        )}
                                    </View>
                                )}
                            </View>
                        )}
                    </ContentWrapper>
                </View>
            </View>
        );
    }
);

export default React.memo(PageFlipper);

const Wrapper = (props: any) => <View style={styles.wrap} {...props} />;

const Empty = () => <View style={styles.container} pointerEvents="none" />;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    wrap: {
        flex: 1,
    },
    contentContainer: {
        flexDirection: 'row',
        // shadowColor: '#000',
        // shadowOffset: {
        //     width: 0,
        //     height: 2,
        // },
        // shadowOpacity: 0.25,
        // shadowRadius: 3.84,
        // elevation: 5,
        backgroundColor: 'white',
    },
    content: {
        flex: 1,
        flexDirection: 'row',
        overflow: 'hidden',
    },
    portraitContent: {
        flex: 1,
        overflow: 'hidden',
    },
});
