import useSetState from '@/hooks/useSetState';
import React, { useEffect, useState } from 'react';
import { useRef } from 'react';
import { LayoutChangeEvent, StyleSheet, Text, View } from 'react-native';
import { BookPage2, IBookPageProps } from './BookPage2/BookPage2';
import { BookPageBackground } from './BookPageBackground';
import { Page, Size } from './types';
import cacheImages from './utils/cacheImages';
import { getImageSize } from './utils/utils';

export type IPageFlipperProps = {
  data: string[];
  enabled?: boolean;
  single: boolean;
  renderLastPage?: () => JSX.Element;
};

type State = {
  pageIndex: number;
  pages: Page[];
  isAnimating: boolean;
  initialized: boolean;
  realImageSize: Size;
};

const PageFlipper: React.FC<IPageFlipperProps> = ({
  data,
  enabled = true,
  single = false,
  renderLastPage,
}) => {
  const [layout, setLayout] = useState({ height: 0, width: 0 });
  const { width, height } = layout;
  const [state, setState] = useSetState<State>({
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
      const allPages: Page[] = [];

      for (let i = 0; i < data.length; i++) {
        if (single) {
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

      cacheImages(data.map((uri) => ({ uri })));

      const realImageSize = await getImageSize(data[0]);

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
    const size = {
      height: state.realImageSize.height,
      width: single ? state.realImageSize.width * 2 : state.realImageSize.width,
    };

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

  const containerSize = getContainerSize();

  const getBookImageStyle = (right: boolean, front: boolean) => {
    const imageStyle: any = {
      height: containerSize.height,
      width: single ? containerSize.width / 2 : containerSize.width,
      position: 'absolute',
    };

    const offset = single ? 0 : -containerSize.width / 2;

    if ((front && right) || (!front && right)) {
      // front right or back right
      imageStyle['left'] = offset;
    } else if (front && !right) {
      // front left
      imageStyle['right'] = offset;
    }

    return imageStyle;
  };

  const { pageIndex, pages } = state;
  const prev = pages[pageIndex - 1];
  const current = pages[pageIndex];
  const next = pages[pageIndex + 1];

  const isFirstPage = pageIndex === 0;
  const isLastPage = pageIndex === pages.length - 1;

  const shouldRenderLastPage = isLastPage && single && data.length % 2 !== 0;

  const bookPageProps: Omit<IBookPageProps, 'right' | 'front' | 'back'> = {
    containerSize: containerSize,
    isAnimating: state.isAnimating,
    enabled,
    setIsAnimating: setIsAnimating,
    isAnimatingRef: isAnimatingRef,
    onPageFlip: onPageFlipped,
    getBookImageStyle,
    single,
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
        <View style={styles.content}>
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
            shouldRenderLastPage ? (
              getLastPage()
            ) : (
              <Empty />
            )
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
            left={!prev ? current.left : prev.left}
            right={!next ? current.right : next.right}
            isFirstPage={isFirstPage}
            isLastPage={isLastPage}
            getBookImageStyle={getBookImageStyle}
            containerSize={containerSize}
          />
        </View>
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
