import React from 'react';
import { ActivityIndicator } from 'react-native';

export type ILoadingProps = {};

const Loading: React.FC<ILoadingProps> = () => {
  return <ActivityIndicator size={'large'} color={'white'} />;
};

export { Loading };
