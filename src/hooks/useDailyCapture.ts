import { useEffect, useRef } from 'react';
import * as Notifications from 'expo-notifications';
import { NavigationContainerRefWithCurrent } from '@react-navigation/native';
import { RootStackParamList } from '../types/Navigation';
import {
  setupNotificationHandler,
  rescheduleIfNeeded,
  scheduleDailyCapture,
} from '../utils/dailyNotification';

export default function useDailyCapture(
  navigationRef: NavigationContainerRefWithCurrent<RootStackParamList>,
) {
  const responseListener = useRef<ReturnType<typeof Notifications.addNotificationResponseReceivedListener> | null>(null);

  useEffect(() => {
    setupNotificationHandler();
    rescheduleIfNeeded();

    // Listen for notification taps
    responseListener.current = Notifications.addNotificationResponseReceivedListener((response) => {
      const data = response.notification.request.content.data;
      if (data?.type === 'daily-capture') {
        // Re-schedule for next day
        scheduleDailyCapture();
        // Navigate to capture screen
        if (navigationRef.isReady()) {
          navigationRef.navigate('Capture');
        }
      }
    });

    return () => {
      if (responseListener.current) {
        responseListener.current.remove();
      }
    };
  }, [navigationRef]);
}
