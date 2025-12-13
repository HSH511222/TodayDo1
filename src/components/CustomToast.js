import React from 'react';
import { View, StyleSheet } from 'react-native';
import { NoScaleText } from './NoScaleText';

export const toastConfig = {
  success: ({ text1, text2 }) => (
    <View style={styles.success}>
      <NoScaleText style={styles.title}>{text1}</NoScaleText>
      {text2 && <NoScaleText style={styles.desc}>{text2}</NoScaleText>}
    </View>
  ),

  reward: ({ text1, text2 }) => (
    <View style={styles.reward}>
      <NoScaleText style={styles.title}>{text1}</NoScaleText>
      <NoScaleText style={styles.desc}>{text2}</NoScaleText>
    </View>
  ),
};

const styles = StyleSheet.create({
  success: {
    width: '90%',
    backgroundColor: '#707070ff',
    padding: 14,
    borderRadius: 60,
    opacity: 0.8
  },
  reward: {
    width: '90%',
    backgroundColor: '#707070ff',
    padding: 14,
    borderRadius: 60,
    opacity: 0.8
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    paddingHorizontal: 15
  },
  desc: {
    fontSize: 13,
    color: '#fff',
    marginTop: 4,
    paddingHorizontal: 15
  },
});
