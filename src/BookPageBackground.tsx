import React from 'react';
import { View, StyleSheet } from 'react-native';
import { BookSpine } from './BookPage/BookSpine';
import Image from './Components/Image';
import type { Size } from './types';

type IBookPageBackgroundProps = {
    left: string;
    right: string;
    isFirstPage: boolean;
    isLastPage: boolean;
    containerSize: Size;
    getBookImageStyle: (right: boolean, front: boolean) => any;
};

const BookPageBackground: React.FC<IBookPageBackgroundProps> = ({
    left,
    right,
    isFirstPage,
    isLastPage,
    containerSize,
    getBookImageStyle,
}) => {
    const leftImageStyle = getBookImageStyle(false, true);
    const rightImageStyle = getBookImageStyle(true, true);

    return (
        <View style={styles.container}>
            <View style={styles.imageContainer}>
                {left && (
                    <Image source={{ uri: left }} style={[leftImageStyle]} />
                )}
                {isFirstPage && (
                    <BookSpine right={false} containerSize={containerSize} />
                )}
            </View>
            <View style={styles.imageContainer}>
                {right && (
                    <Image source={{ uri: right }} style={[rightImageStyle]} />
                )}
                {isLastPage && (
                    <BookSpine right={true} containerSize={containerSize} />
                )}
            </View>
        </View>
    );
};

export { BookPageBackground };

const styles = StyleSheet.create({
    imageContainer: {
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
