import { Platform } from 'react-native';

type IUsePerspectiveProps = {
  isLandscape: boolean;
};

export const usePerspective = ({ isLandscape }: IUsePerspectiveProps) => {
  const isTablet = false; // fix this
  const basePerspective = isLandscape ? 5000 : 2000;
  const perspective = isTablet ? basePerspective * 2 : basePerspective;
  const androidPerspective = perspective; //60000;
  const webPerspective = 6000;

  const backPerspective = Platform.select({
    ios: { perspective },
    android: { perspective: androidPerspective },
    web: { perspective: webPerspective },
    default: { perspective: 0 },
  });

  const frontPerspective = Platform.select({
    ios: { perspective: -perspective },
    android: { perspective: androidPerspective },
    web: { perspective: webPerspective },
    default: { perspective: 0 },
  });

  return {
    backPerspective,
    frontPerspective,
  };
};
