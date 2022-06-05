import FastImage from 'react-native-fast-image';

export default async (images: { uri: string }[] = []) => {
  try {
    // console.log('PRELOADING', images);
    await FastImage.preload(images.filter(Boolean));
  } catch (error) {
    console.log('FAST IMAGE PRELOAD ERROR', error);
  }
};

export const preloadImage = (uri: string) => {
  if (!uri) {
    return;
  }
  try {
    FastImage.preload([{ uri }]);
  } catch (error) {
    console.log('FAST IMAGE PRELOAD ERROR', error);
  }
};
