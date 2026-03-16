import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import { colors } from '../../theme/colors';

interface CaptureControlsProps {
  capturing: boolean;
  onCapture: () => void;
  onFlip: () => void;
  onClose: () => void;
}

export default function CaptureControls({ capturing, onCapture, onFlip, onClose }: CaptureControlsProps) {
  return (
    <>
      {/* Top bar */}
      <View style={styles.topBar}>
        <TouchableOpacity style={styles.closeButton} onPress={onClose}>
          <Text style={styles.closeText}>✕</Text>
        </TouchableOpacity>
        <Text style={styles.label}>Capture a moment</Text>
        <View style={styles.closeSpacer} />
      </View>

      {/* Spacer */}
      <View style={styles.spacer} />

      {/* Bottom bar */}
      <View style={styles.bottomBar}>
        <View style={styles.controlsSpacer} />
        <TouchableOpacity
          style={[styles.shutterOuter, capturing && styles.shutterCapturing]}
          onPress={onCapture}
          disabled={capturing}
        >
          <View style={styles.shutterInner} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.flipButton} onPress={onFlip}>
          <Text style={styles.flipText}>↻</Text>
        </TouchableOpacity>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 8,
  },
  closeButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0,0,0,0.4)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeText: {
    fontSize: 18,
    color: '#fff',
    fontWeight: '600',
  },
  closeSpacer: {
    width: 40,
  },
  label: {
    fontSize: 15,
    fontWeight: '600',
    color: '#fff',
    textShadowColor: 'rgba(0,0,0,0.5)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
  spacer: {
    flex: 1,
  },
  bottomBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 32,
    paddingBottom: Platform.OS === 'android' ? 32 : 16,
  },
  controlsSpacer: {
    width: 48,
  },
  shutterOuter: {
    width: 76,
    height: 76,
    borderRadius: 38,
    borderWidth: 4,
    borderColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  shutterCapturing: {
    borderColor: colors.accent,
  },
  shutterInner: {
    width: 62,
    height: 62,
    borderRadius: 31,
    backgroundColor: '#fff',
  },
  flipButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(0,0,0,0.4)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  flipText: {
    fontSize: 24,
    color: '#fff',
  },
});
