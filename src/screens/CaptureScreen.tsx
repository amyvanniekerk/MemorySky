import React, { useRef, useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { CameraView, CameraType, useCameraPermissions } from 'expo-camera';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types/Navigation';
import CameraPermissionPrompt from '../components/capture/CameraPermissionPrompt';
import CaptureControls from '../components/capture/CaptureControls';

type Props = NativeStackScreenProps<RootStackParamList, 'Capture'>;

export default function CaptureScreen({ navigation }: Props) {
  const cameraRef = useRef<CameraView>(null);
  const [facing, setFacing] = useState<CameraType>('back');
  const [capturing, setCapturing] = useState(false);
  const [permission, requestPermission] = useCameraPermissions();

  const handleCapture = async () => {
    if (!cameraRef.current || capturing) return;
    setCapturing(true);
    try {
      const photo = await cameraRef.current.takePictureAsync({ quality: 0.8 });
      if (photo) {
        navigation.navigate('Home', { capturedPhotoUri: photo.uri });
      }
    } catch (err) {
      console.warn('Failed to capture:', err);
    } finally {
      setCapturing(false);
    }
  };

  if (!permission) {
    return <View style={styles.container} />;
  }

  if (!permission.granted) {
    return (
      <CameraPermissionPrompt
        onAllow={requestPermission}
        onSkip={() => navigation.goBack()}
      />
    );
  }

  return (
    <View style={styles.container}>
      <CameraView ref={cameraRef} style={styles.camera} facing={facing}>
        <SafeAreaView style={styles.overlay}>
          <CaptureControls
            capturing={capturing}
            onCapture={handleCapture}
            onFlip={() => setFacing((f) => (f === 'back' ? 'front' : 'back'))}
            onClose={() => navigation.goBack()}
          />
        </SafeAreaView>
      </CameraView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  camera: {
    flex: 1,
  },
  overlay: {
    flex: 1,
  },
});
