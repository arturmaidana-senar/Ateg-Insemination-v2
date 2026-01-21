// src/components/layout/ScreenContainer.js
import React from 'react';
import {
  SafeAreaView,
  View,
  StyleSheet,
  Platform,
  StatusBar,
} from 'react-native';
import { ms } from 'react-native-size-matters';

export default function ScreenContainer({ children, style }) {
  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={[styles.container, style]}>{children}</View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F5F5F5',
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
  container: {
    flex: 1,
    paddingHorizontal: ms(15),
    backgroundColor: '#F5F5F5',
  },
});
