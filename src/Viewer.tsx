import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import type { State } from 'src';
import { BookPage, IBookPageProps } from './BookPage';
import { BookPageBackground } from './BookPageBackground';
import Image from './Components/Image';
import { BookPagePortrait } from './portrait/BookPagePortrait';
import type { Size } from './types';

export type IViewerProps = {
    state: State;
    singleImageMode: boolean;
    enabled: boolean;
    pressable: boolean;
    containerSize: Size;
    // fix
    renderLastPage: any;
    isAnimatingRef: any;
    prevBookPage: any;
    nextBookPage: any;
    portraitBookPage: any;
    setIsAnimating: any;
    onPageFlipped: any;
    onFlipStart: any;
    onPageDrag: any;
    onPageDragEnd: any;
    onPageDragStart: any;
};

const Viewer: React.FC<IViewerProps> = ({
    singleImageMode,
    enabled,
    setIsAnimating,
    isAnimatingRef,
    onPageFlipped,
    onFlipStart,
    onPageDrag,
    onPageDragEnd,
    onPageDragStart,
    pressable,
    prevBookPage,
    nextBookPage,
    portraitBookPage,
    containerSize,
    renderLastPage,
    state,
}) => {
    const { current, pageIndex, pages, next, prev, isPortrait, isAnimating } =
        state;
    const isFirstPage = pageIndex === 0;
    const isLastPage = pageIndex === pages.length - 1;
    const shouldRenderLastPage =
        isLastPage && singleImageMode && pages.length % 2 !== 0;

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
        if (!singleImageMode && isPortrait) {
            const imageStyle: any = {
                height: containerSize.height,
                width: containerSize.width * 2,
                position: 'absolute',
            };

            const isEvenPage = pageIndex % 2 === 0;

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
                singleImageMode && !isPortrait
                    ? containerSize.width / 2
                    : containerSize.width,
            position: 'absolute',
        };

        const offset = singleImageMode ? 0 : -containerSize.width / 2;

        if (isPortrait && front) {
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

    const bookPageProps: Omit<IBookPageProps, 'right' | 'front' | 'back'> = {
        containerSize: containerSize,
        isAnimating: isAnimating,
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
    return (
        <View
            style={[
                styles.contentContainer,
                {
                    height: containerSize.height,
                    width: containerSize.width,
                },
            ]}
        >
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
    );
};

export default React.memo(Viewer);

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
