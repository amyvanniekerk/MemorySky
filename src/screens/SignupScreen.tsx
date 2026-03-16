import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  LayoutAnimation,
  UIManager,
} from 'react-native';
import { colors } from '../theme/colors';
import StarField from '../components/shared/StarField';
import SignupStepName from '../components/signup/SignupStepName';
import SignupStepBirthday from '../components/signup/SignupStepBirthday';
import SignupStepDone from '../components/signup/SignupStepDone';

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

type Step = 'name' | 'birthday' | 'done';

interface SignupScreenProps {
  onComplete: (name: string, birthday: Date) => void;
}

export default function SignupScreen({ onComplete }: SignupScreenProps) {
  const [step, setStep] = useState<Step>('name');
  const [name, setName] = useState('');
  const [birthday, setBirthday] = useState<Date | null>(null);

  const animateStep = (next: Step) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setStep(next);
  };

  const handleName = (n: string) => {
    setName(n);
    animateStep('birthday');
  };

  const handleBirthday = (d: Date) => {
    setBirthday(d);
    animateStep('done');
  };

  const handleEnter = () => {
    if (birthday) onComplete(name, birthday);
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <StarField count={40} />
      <View style={styles.content}>
        {step === 'name' && (
          <SignupStepName onNext={handleName} />
        )}
        {step === 'birthday' && (
          <SignupStepBirthday
            name={name}
            onNext={handleBirthday}
            onBack={() => animateStep('name')}
          />
        )}
        {step === 'done' && birthday && (
          <SignupStepDone
            name={name}
            birthday={birthday}
            onEnter={handleEnter}
          />
        )}
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bgPrimary,
  },
  content: {
    flex: 1,
  },
});
