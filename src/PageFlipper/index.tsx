import useSetState from '@/hooks/useSetState';
import React from 'react';
import { useRef } from 'react';
import { useWindowDimensions } from 'react-native';
import { StyleSheet, View } from 'react-native';
import { BookPage2 } from './BookPage2/BookPage2';
import { BookPageBackground } from './BookPageBackground';

export type IPageFlipperProps = {};

const PageFlipper: React.FC<IPageFlipperProps> = () => {
  const isAnimatingRef = useRef(false);

  const { width } = useWindowDimensions();

  const [state, setState] = useSetState({
    pageIndex: 0,
    pages: [
      'https://i.picsum.photos/id/960/780/844.jpg?hmac=yi46RPSHaJh3LsOi_4noHPFpgB2pdTiFkfLg0YWANC8',
      'https://i.picsum.photos/id/179/780/844.jpg?hmac=C934STbwY480q05yogaGe9v6jT5pfFxYKhj0dPpe9OE',
      'https://i.picsum.photos/id/70/780/844.jpg?hmac=wFZE1FAacjyxQadjJcSNjDZnqeLrWvjf4t1c4g-oZws',
      'https://i.picsum.photos/id/183/780/844.jpg?hmac=ZKyE-nRYJ4f8UvpjLhWzhNOOpIpqjU0Ve1eNoPpYF-A',
      'https://i.picsum.photos/id/960/780/844.jpg?hmac=yi46RPSHaJh3LsOi_4noHPFpgB2pdTiFkfLg0YWANC8',
      'https://i.picsum.photos/id/179/780/844.jpg?hmac=C934STbwY480q05yogaGe9v6jT5pfFxYKhj0dPpe9OE',
      'https://i.picsum.photos/id/70/780/844.jpg?hmac=wFZE1FAacjyxQadjJcSNjDZnqeLrWvjf4t1c4g-oZws',
      'https://i.picsum.photos/id/183/780/844.jpg?hmac=ZKyE-nRYJ4f8UvpjLhWzhNOOpIpqjU0Ve1eNoPpYF-A',
    ],
    isAnimating: false,
  });

  const onPageFlipped = (index: number) => {
    const newIndex = pageIndex + index;
    setState({
      pageIndex: newIndex,
    });
    setIsAnimating(false);
  };

  const setIsAnimating = (val: boolean) => {
    setState({
      isAnimating: val,
    });
    isAnimatingRef.current = val;
  };

  const { pageIndex, pages } = state;
  const prev = pages[pageIndex - 1];
  const current = pages[pageIndex];
  const next = pages[pageIndex + 1];

  const isFirstPage = pageIndex === 0;
  const isLastPage = pageIndex === pages.length - 1;

  const containerSize = {
    height: 422,
    width: width,
  };

  const bookPageProps = {
    containerSize: containerSize,
    isAnimating: false,
    zoomActive: false,
    setIsAnimating: setIsAnimating,
    isAnimatingRef: isAnimatingRef,
    onPageFlip: onPageFlipped,
  };

  return (
    <View
      style={[
        styles.contentContainer,
        {
          height: containerSize.height,
          width: containerSize.width,
          shadowColor: '#000',
          shadowOffset: {
            width: 0,
            height: 2,
          },
          shadowOpacity: 0.25,
          shadowRadius: 3.84,
          elevation: 5,
        },
      ]}
    >
      <View style={{ flex: 1, flexDirection: 'row', overflow: 'hidden' }}>
        {!prev ? (
          <Empty />
        ) : (
          <BookPage2
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
          <BookPage2
            right
            front={current}
            back={next}
            key={`right${pageIndex}`}
            {...bookPageProps}
          />
        )}
        <BookPageBackground
          left={!prev ? current : prev}
          right={!next ? current : next}
          containerSize={containerSize}
          isFirstPage={isFirstPage}
          isLastPage={isLastPage}
        />
      </View>
    </View>
  );
};

export { PageFlipper };

const Empty = () => <View style={styles.container} />;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  contentContainer: {
    flexDirection: 'row',
    // backgroundColor: 'grey',
  },
});
