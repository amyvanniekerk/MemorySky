import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Platform,
} from 'react-native';
import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';
import { colors } from '../../theme/colors';

interface SignupStepBirthdayProps {
  name: string;
  onNext: (birthday: Date) => void;
  onBack: () => void;
}

export default function SignupStepBirthday({ name, onNext, onBack }: SignupStepBirthdayProps) {
  const [date, setDate] = useState(new Date(2000, 0, 1));
  const [showPicker, setShowPicker] = useState(Platform.OS === 'ios');

  const onChange = (_event: DateTimePickerEvent, selectedDate?: Date) => {
    if (Platform.OS === 'android') setShowPicker(false);
    if (selectedDate) setDate(selectedDate);
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.backButton} onPress={onBack}>
        <Text style={styles.backText}>← Back</Text>
      </TouchableOpacity>

      <View style={styles.content}>
        <Text style={styles.emoji}>★</Text>
        <Text style={styles.title}>When were you born, {name}?</Text>
        <Text style={styles.subtitle}>
          This will be your first star — the one that started it all
        </Text>

        {Platform.OS === 'ios' ? (
          <DateTimePicker
            value={date}
            mode="date"
            display="spinner"
            maximumDate={new Date()}
            minimumDate={new Date(1920, 0, 1)}
            onChange={onChange}
            themeVariant="dark"
            accentColor={colors.accent}
            style={styles.pickerIOS}
          />
        ) : (
          <>
            <TouchableOpacity
              style={styles.dateButton}
              onPress={() => setShowPicker(true)}
            >
              <Text style={styles.dateButtonText}>
                {date.toLocaleDateString('en-US', {
                  month: 'long',
                  day: 'numeric',
                  year: 'numeric',
                })}
              </Text>
            </TouchableOpacity>
            {showPicker && (
              <DateTimePicker
                value={date}
                mode="date"
                maximumDate={new Date()}
                minimumDate={new Date(1920, 0, 1)}
                onChange={onChange}
              />
            )}
          </>
        )}

        <TouchableOpacity style={styles.button} onPress={() => onNext(date)}>
          <Text style={styles.buttonText}>Create my galaxy</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 32,
  },
  backButton: {
    paddingTop: 16,
    paddingBottom: 8,
  },
  backText: {
    fontSize: 16,
    color: colors.teal,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emoji: {
    fontSize: 56,
    color: colors.accent,
    marginBottom: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.textPrimary,
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 15,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 32,
  },
  pickerIOS: {
    width: '100%',
    height: 180,
    marginBottom: 24,
  },
  dateButton: {
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.12)',
    borderRadius: 16,
    paddingHorizontal: 24,
    paddingVertical: 16,
    marginBottom: 24,
  },
  dateButtonText: {
    fontSize: 18,
    color: colors.starWhite,
  },
  button: {
    backgroundColor: colors.fabBg,
    borderRadius: 16,
    paddingHorizontal: 32,
    paddingVertical: 16,
    width: '100%',
    alignItems: 'center',
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.starWhite,
  },
});
