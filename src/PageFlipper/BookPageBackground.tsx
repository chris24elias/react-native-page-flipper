import React from 'react';
import { View, StyleSheet } from 'react-native';
import { BookSpine } from './BookPage2/BookSpine';
import Image from './Components/Image';
import { Size } from './types';

type IBookPageBackgroundProps = {
  left: string;
  right: string;
  isFirstPage: boolean;
  isLastPage: boolean;
  containerSize: Size;
};

const BookPageBackground: React.FC<IBookPageBackgroundProps> = ({
  left,
  right,
  isFirstPage,
  isLastPage,
  containerSize,
}) => {
  const getBookImageStyle = (right: boolean, front: boolean) => {
    const imageStyle: any = {
      height: Math.round(containerSize.height),
      width: Math.round(containerSize.width),
      position: 'absolute',
    };

    if (right && front) {
      imageStyle['left'] = Math.round(-containerSize.width / 2);
    } else if (!right && !front) {
      imageStyle['left'] = Math.round(-containerSize.width / 2);
    } else {
      imageStyle['left'] = 0;
    }

    return imageStyle;
  };
  const leftImageStyle = getBookImageStyle(false, true);
  const rightImageStyle = getBookImageStyle(true, true);

  if (!left || !right) {
    return null;
  }

  return (
    <View style={styles.container}>
      <View style={styles.col}>
        <View style={styles.imageContainer}>
          <Image source={{ uri: left }} style={leftImageStyle} />
          {isFirstPage && <BookSpine right={false} containerSize={containerSize} />}
        </View>
      </View>
      <View style={styles.col}>
        <View style={styles.imageContainer}>
          <Image source={{ uri: right }} style={rightImageStyle} />
          {isLastPage && <BookSpine right={true} containerSize={containerSize} />}
        </View>
      </View>
    </View>
  );
};

export { BookPageBackground };

const styles = StyleSheet.create({
  imageContainer: {
    ...StyleSheet.absoluteFillObject,
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
  col: {
    flex: 1,
    overflow: 'hidden',
  },
});
