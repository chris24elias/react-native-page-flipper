import { RootStackScreenProps } from '@/types';
import { Box, Text } from 'native-base';
import * as React from 'react';
import { useTranslation } from 'react-i18next';

const Home: React.FC<RootStackScreenProps<'Home'>> = () => {
  const { t } = useTranslation();
  return (
    <Box flex={1}>
      <Text>{t('login_button')}</Text>
      <Text>{t('signup_button')}</Text>
    </Box>
  );
};

export { Home };
