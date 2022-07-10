import { Image } from 'react-native';

export default (images: { uri: string }[]) => {
    images.forEach((image) => {
        Image.prefetch(image.uri);
    });
};

export const preloadImage = (uri: string) => {
    if (!uri) {
        return;
    }
    Image.prefetch(uri);
};
