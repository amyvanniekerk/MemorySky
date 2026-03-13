import React, { useRef, useCallback, useState } from 'react';
import { Alert } from 'react-native';
import ViewShot from 'react-native-view-shot';
import * as Sharing from 'expo-sharing';

interface GalaxyShareCaptureProps {
  style?: any;
  children: (isCapturing: boolean, onShare: () => void) => React.ReactNode;
}

export default function GalaxyShareCapture({ style, children }: GalaxyShareCaptureProps) {
  const viewShotRef = useRef<ViewShot>(null);
  const [isCapturing, setIsCapturing] = useState(false);

  const onShare = useCallback(async () => {
    try {
      setIsCapturing(true);
      await new Promise((r) => setTimeout(r, 100));
      const uri = await (viewShotRef.current as any)?.capture?.();
      setIsCapturing(false);
      if (!uri) throw new Error('No capture');
      await Sharing.shareAsync(uri, {
        mimeType: 'image/png',
        dialogTitle: 'Share your galaxy',
      });
    } catch (e) {
      setIsCapturing(false);
      Alert.alert('Error', 'Could not capture galaxy');
    }
  }, []);

  return (
    <ViewShot ref={viewShotRef} options={{ format: 'png', quality: 1 }} style={style}>
      {children(isCapturing, onShare)}
    </ViewShot>
  );
}
