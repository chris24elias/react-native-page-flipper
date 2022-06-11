import useSetState from '@/hooks/useSetState';
import React, { useEffect, useState } from 'react';
import { useRef } from 'react';
import { LayoutChangeEvent, StyleSheet, View } from 'react-native';
import { BookPage2, IBookPageProps } from './BookPage2/BookPage2';
import { BookPagePortrait } from './BookPage2/BookPagePortrait';
import { BookPageBackground } from './BookPageBackground';
import Image from './Components/Image';
import { Size } from './types';
import cacheImages from './utils/cacheImages';
import { getImageSize } from './utils/utils';

export type IPageFlipperProps = {
  landscape: boolean;

  data: string[];
  enabled?: boolean;
};

const PageFlipper: React.FC<IPageFlipperProps> = ({ landscape, data, enabled = true }) => {
  const [layout, setLayout] = useState({ height: 0, width: 0 });
  const { width, height } = layout;
  const [state, setState] = useSetState<{
    pageIndex: number;
    pages: string[];
    isAnimating: boolean;
    initialized: boolean;
    realImageSize: Size;
  }>({
    pageIndex: 0,
    pages: [],
    isAnimating: false,
    initialized: false,
    realImageSize: { width: 0, height: 0 },
  });
  const isAnimatingRef = useRef(false);

  useEffect(() => {
    initialize();
  }, [data]);

  const initialize = async () => {
    try {
      let allPages: string[] = [];

      if (!landscape) {
        for (let i = 0; i < data.length * 2; i += 2) {
          allPages[i] = data[i];
          allPages[i + 1] = data[i];
        }
      } else {
        allPages = data;
      }

      cacheImages(data.map((uri) => ({ uri })));

      const realImageSize = await getImageSize(allPages[0]);

      setState({
        initialized: true,
        pages: allPages,
        realImageSize,
      });
    } catch (error) {
      console.log('error', error);
    }
  };

  const onLayout = (e: LayoutChangeEvent) => {
    const { height, width } = e.nativeEvent.layout;
    setLayout({ height, width });
  };

  const getContainerSize = () => {
    const { realImageSize } = state;
    let containerSize: Size;

    if (state.realImageSize.height > state.realImageSize.width) {
      const ratio = realImageSize.height / realImageSize.width;
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
      const ratio = realImageSize.width / realImageSize.height;
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
    console.log('on page flipped');
    const newIndex = pageIndex + index;
    setState({
      pageIndex: newIndex,
      isAnimating: false,
    });
    isAnimatingRef.current = false;
  };

  const setIsAnimating = (val: boolean) => {
    console.log('setting is animating', val);
    setState({
      isAnimating: val,
    });
    isAnimatingRef.current = val;
  };

  if (!state.initialized) {
    return null;
  }

  const containerSize = getContainerSize();

  const { pageIndex, pages } = state;
  const prev = pages[pageIndex - 1];
  const current = pages[pageIndex];
  const next = pages[pageIndex + 1];

  const isFirstPage = pageIndex === 0;
  const isLastPage = pageIndex === pages.length - 1;

  const bookPageProps: Omit<IBookPageProps, 'right' | 'front' | 'back'> = {
    containerSize: containerSize,
    isAnimating: state.isAnimating,
    enabled,
    setIsAnimating: setIsAnimating,
    isAnimatingRef: isAnimatingRef,
    onPageFlip: onPageFlipped,
  };

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }} onLayout={onLayout}>
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
            backgroundColor: 'grey',
          },
        ]}
      >
        {landscape ? (
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
              pageIndex={state.pageIndex}
            />
          </View>
        ) : (
          <View style={{ flex: 1, overflow: 'hidden' }}>
            <View style={{ ...StyleSheet.absoluteFillObject }}>
              <BookPagePortrait
                current={current}
                prev={prev}
                key={`right${pageIndex}`}
                {...bookPageProps}
              />
            </View>
            {next ? (
              <View
                style={{
                  ...StyleSheet.absoluteFillObject,
                  zIndex: -5,
                  overflow: 'hidden',
                }}
              >
                <Image
                  source={{ uri: next }}
                  style={{
                    height: containerSize.height,
                    width: containerSize.width * 2,
                    right: pageIndex % 2 === 0 ? containerSize.width : 0,
                    backgroundColor: 'white',
                  }}
                />
              </View>
            ) : (
              <View
                style={{
                  ...StyleSheet.absoluteFillObject,
                  zIndex: -5,
                  overflow: 'hidden',
                  justifyContent: 'center',
                  alignItems: 'center',
                  backgroundColor: '#FFF',
                }}
              />
            )}
          </View>
        )}
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
  },
});
