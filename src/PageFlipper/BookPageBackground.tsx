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
  pageIndex: number;
};

const BookPageBackground: React.FC<IBookPageBackgroundProps> = ({
  left,
  right,
  isFirstPage,
  isLastPage,
  containerSize,
}) => {
  const size = {
    height: containerSize.height,
    width: containerSize.width,
  };

  if (!left || !right) {
    return null;
  }

  return (
    <View style={styles.container}>
      <View style={styles.imageContainer}>
        <Image
          source={{ uri: left }}
          style={[
            size,
            {
              left: 0,
            },
          ]}
        />
        {isFirstPage && <BookSpine right={false} containerSize={containerSize} />}
      </View>
      <View style={styles.imageContainer}>
        <Image
          source={{ uri: right }}
          style={[
            size,
            {
              left: -containerSize.width / 2,
            },
          ]}
        />
        {isLastPage && <BookSpine right={true} containerSize={containerSize} />}
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
