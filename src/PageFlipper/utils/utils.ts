import { Image } from 'react-native';
import { runOnJS } from 'react-native-reanimated';
import { Size } from '../types';
import type { TransformsStyle } from 'react-native';

export const getImageSize = (uri: string): Promise<Size> =>
  new Promise((resolve, reject) =>
    Image.getSize(uri, (width, height) => resolve({ width, height }), reject),
  );

type RNTransform = Exclude<TransformsStyle['transform'], undefined>;

export const transformOrigin = (
  { x, y }: { x: number; y: number },
  transformations: RNTransform,
): RNTransform => {
  'worklet';
  return [
    { translateX: x },
    { translateY: y },
    ...transformations,
    { translateX: -x },
    { translateY: -y },
  ];
};

const debug = (msg: string, val: any) => {
  console.log(msg, val);
};

export const debugValue = (msg: string, val: any) => {
  'worklet';
  runOnJS(debug)(msg, val);
};

export const snapPoint = (
  value: number,
  velocity: number,
  points: ReadonlyArray<number>,
): number => {
  'worklet';

  const point = value + 0.25 * velocity;
  const deltas = points.map((p) => Math.abs(point - p));
  const minDelta = Math.min.apply(null, deltas);
  return points.filter((p) => Math.abs(point - p) === minDelta)[0];
};
