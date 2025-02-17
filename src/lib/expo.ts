import Expo from 'expo-server-sdk';

import config from '@/constants';

const expo = new Expo({
  accessToken: config.ExpoNotificationsAuthorizationToken,
});

export default expo;
