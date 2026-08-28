import React from 'react';
import { StyleSheet, ViewStyle } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { colors } from '../constants/theme';

interface KeyboardScreenProps {
  children: React.ReactNode;
  contentContainerStyle?: ViewStyle;
}

// যেকোনো form screen এ ScrollView এর বদলে এটা ব্যবহার করলেই
// keyboard আসলে content ঠিক জায়গায় push হবে, minimize করা লাগবে না
export default function KeyboardScreen({ children, contentContainerStyle }: KeyboardScreenProps) {
  return (
    <KeyboardAwareScrollView
      style={styles.screen}
      contentContainerStyle={[styles.container, contentContainerStyle]}
      keyboardShouldPersistTaps="handled"
      showsVerticalScrollIndicator={false}
      enableOnAndroid
      extraScrollHeight={20}
    >
      {children}
    </KeyboardAwareScrollView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.background },
  container: { paddingBottom: 200 },
});