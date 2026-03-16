import * as Notifications from 'expo-notifications';
import AsyncStorage from '@react-native-async-storage/async-storage';

const NEXT_CAPTURE_KEY = 'memorySky_nextCaptureTime';
const ENABLED_KEY = 'memorySky_dailyCaptureEnabled';
const NOTIFICATION_ID = 'daily-capture';

export function setupNotificationHandler() {
  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowAlert: true,
      shouldPlaySound: true,
      shouldSetBadge: false,
    }),
  });
}

export async function requestNotificationPermissions(): Promise<boolean> {
  const { status: existing } = await Notifications.getPermissionsAsync();
  if (existing === 'granted') return true;

  const { status } = await Notifications.requestPermissionsAsync();
  return status === 'granted';
}

function getRandomTimeForDate(date: Date): Date {
  const hour = 9 + Math.floor(Math.random() * 11); // 9 AM – 7 PM
  const minute = Math.floor(Math.random() * 60);
  const target = new Date(date);
  target.setHours(hour, minute, 0, 0);
  return target;
}

export async function scheduleDailyCapture(): Promise<Date | null> {
  // Cancel any existing scheduled notification
  await Notifications.cancelScheduledNotificationAsync(NOTIFICATION_ID).catch(() => {});

  const now = new Date();
  let target = getRandomTimeForDate(now);

  // If the random time already passed today, schedule for tomorrow
  if (target <= now) {
    const tomorrow = new Date(now);
    tomorrow.setDate(tomorrow.getDate() + 1);
    target = getRandomTimeForDate(tomorrow);
  }

  await Notifications.scheduleNotificationAsync({
    identifier: NOTIFICATION_ID,
    content: {
      title: 'MemorySky',
      body: 'Capture this moment for your galaxy ✦',
      data: { type: 'daily-capture' },
    },
    trigger: {
      type: Notifications.SchedulableTriggerInputTypes.DATE,
      date: target,
    },
  });

  await AsyncStorage.setItem(NEXT_CAPTURE_KEY, target.toISOString());
  return target;
}

export async function isDailyCaptureEnabled(): Promise<boolean> {
  const val = await AsyncStorage.getItem(ENABLED_KEY);
  return val === 'true';
}

export async function setDailyCaptureEnabled(enabled: boolean): Promise<void> {
  await AsyncStorage.setItem(ENABLED_KEY, enabled ? 'true' : 'false');
  if (enabled) {
    await scheduleDailyCapture();
  } else {
    await Notifications.cancelScheduledNotificationAsync(NOTIFICATION_ID).catch(() => {});
    await AsyncStorage.removeItem(NEXT_CAPTURE_KEY);
  }
}

export async function getNextCaptureTime(): Promise<Date | null> {
  const val = await AsyncStorage.getItem(NEXT_CAPTURE_KEY);
  return val ? new Date(val) : null;
}

export async function rescheduleIfNeeded(): Promise<void> {
  const enabled = await isDailyCaptureEnabled();
  if (!enabled) return;

  const next = await getNextCaptureTime();
  const now = new Date();

  // If the scheduled time has passed, re-schedule for next random time
  if (!next || next <= now) {
    await scheduleDailyCapture();
  }
}
