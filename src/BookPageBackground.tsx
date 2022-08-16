import React from 'react';
import { View, StyleSheet } from 'react-native';
import { BookSpine } from './BookPage/BookSpine';
import type { Size } from './types';

type IBookPageBackgroundProps = {
    left: string;
    right: string;
    isFirstPage: boolean;
    isLastPage: boolean;
    containerSize: Size;
    getPageStyle: (right: boolean, front: boolean) => any;
    renderPage?: (data: any) => any;
    renderLastPage?: () => any;
    shouldRenderLastPage: boolean;
};

const BookPageBackground: React.FC<IBookPageBackgroundProps> = ({
    left,
    right,
    isFirstPage,
    isLastPage,
    containerSize,
    getPageStyle,
    renderPage,
    renderLastPage,
    shouldRenderLastPage,
}) => {
    const leftPageStyle = getPageStyle(false, true);
    const rightPageStyle = getPageStyle(true, true);

    return (
        <View style={styles.container}>
            <View style={styles.pageContainer}>
                {left && renderPage && (
                    <View style={[leftPageStyle]}>{renderPage(left)}</View>
                )}
                {isFirstPage && (
                    <BookSpine right={false} containerSize={containerSize} />
                )}
            </View>
            <View style={styles.pageContainer}>
                {right && renderPage && (
                    <View style={[rightPageStyle]}>{renderPage(right)}</View>
                )}
                {isLastPage && (
                    <BookSpine right={true} containerSize={containerSize} />
                )}

                {shouldRenderLastPage && renderLastPage && (
                    <View style={[rightPageStyle, { zIndex: -1 }]}>
                        {renderLastPage()}
                    </View>
                )}
            </View>
        </View>
    );
};

export { BookPageBackground };

const styles = StyleSheet.create({
    pageContainer: {
        flex: 1,
        backfaceVisibility: 'hidden',
        overflow: 'hidden',
        justifyContent: 'center',
        // backgroundColor: 'white',
    },
    container: {
        position: 'absolute',
        zIndex: -1,
        height: '100%',
        width: '100%',
        flexDirection: 'row',
    },
});
