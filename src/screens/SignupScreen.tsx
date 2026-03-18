import React, { useState, useRef } from 'react';
import {
  View,
  StyleSheet,
  Platform,
  LayoutAnimation,
  UIManager,
  Animated,
  Easing,
} from 'react-native';
import { colors } from '../theme/colors';
import StarField from '../components/shared/StarField';
import useKeyboardOffset from '../hooks/useKeyboardOffset';
import SignupStepEmail from '../components/signup/SignupStepEmail';
import SignupStepName from '../components/signup/SignupStepName';
import SignupStepBirthday from '../components/signup/SignupStepBirthday';
import SignupStepDone from '../components/signup/SignupStepDone';

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

type Step = 'email' | 'name' | 'birthday' | 'done';

interface SignupScreenProps {
  onSignUp: (email: string, password: string) => Promise<{ error: { message: string } | null }>;
  onComplete: (name: string, birthday: Date) => Promise<any>;
  onSwitchToLogin: () => void;
  startStep?: Step;
}

export default function SignupScreen({ onSignUp, onComplete, onSwitchToLogin, startStep = 'email' }: SignupScreenProps) {
  const [step, setStep] = useState<Step>(startStep);
  const [name, setName] = useState('');
  const [birthday, setBirthday] = useState<Date | null>(null);
  const fadeOut = useRef(new Animated.Value(1)).current;
  const keyboardOffset = useKeyboardOffset(0.35);

  const animateStep = (next: Step) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setStep(next);
  };

  const handleEmail = async (email: string, password: string): Promise<string | null> => {
    const { error } = await onSignUp(email, password);
    if (error) return error.message;
    return null;
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
    if (!birthday) return;
    Animated.timing(fadeOut, {
      toValue: 0,
      duration: 500,
      easing: Easing.in(Easing.ease),
      useNativeDriver: true,
    }).start(() => {
      onComplete(name, birthday);
    });
  };

  return (
    <Animated.View style={[styles.root, { opacity: fadeOut }]}>
      <StarField count={60} />
      <Animated.View
        style={[styles.content, { transform: [{ translateY: keyboardOffset }] }]}
      >
        {step === 'email' && (
          <SignupStepEmail onNext={handleEmail} onLogin={onSwitchToLogin} />
        )}
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
      </Animated.View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.bgPrimary,
  },
  content: {
    flex: 1,
  },
});
