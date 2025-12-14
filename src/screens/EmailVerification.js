import React, { useState } from 'react';
import { NoScaleText } from '../components/NoScaleText';
import { View, TouchableOpacity, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import AuthService from '../core/firebase/authService'; // 경로 조정

export default function EmailVerification({ navigation, route }) {
  const email = route?.params?.email || '';

  const totalSteps = 3;
  const currentStep = 2;
  const progressWidth = `${(currentStep / totalSteps) * 100}%`;

  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);

  // 인증 완료 확인
  const checkVerification = async () => {
    setLoading(true);
    try {
      const verified = await AuthService.checkEmailVerification();

      if (verified) {
        Alert.alert('인증 완료', '이메일 인증이 완료되었습니다.', [
          {
            text: '확인',
            onPress: () => {
              navigation.navigate('SignUpName'); // 닉네임 설정 화면으로 이동
            },
          },
        ]);
      } else {
        Alert.alert('인증 미완료', '아직 이메일 인증이 완료되지 않았습니다.\n메일함을 다시 확인해주세요.');
      }
    } catch (error) {
      Alert.alert('오류', error.message || '인증 상태 확인 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  // 인증 메일 재전송
  const resendLink = async () => {
    setResendLoading(true);
    try {
      await AuthService.resendVerificationEmail();
      Alert.alert('재전송 완료', `${email} 로 인증 메일을 다시 보냈습니다.`);
    } catch (error) {
      Alert.alert('재전송 실패', error.message || '인증 메일 재전송에 실패했습니다.');
    } finally {
      setResendLoading(false);
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: '#fff' }}>
      <View style={styles.container}>
        <View style={styles.progressBar}>
          <View style={[styles.progressFill, { width: progressWidth }]} />
        </View>

        <NoScaleText style={styles.emailText}>{email}로</NoScaleText>
        <NoScaleText style={styles.noticeText}>인증링크를 전송했습니다.</NoScaleText>
        <NoScaleText style={styles.noticeText}>링크를 눌러 인증을 완료해주세요.</NoScaleText>

        <TouchableOpacity onPress={resendLink} disabled={resendLoading}>
          {resendLoading ? (
            <ActivityIndicator size="small" color="#4a90e2" />
          ) : (
            <NoScaleText style={styles.resend}>재전송</NoScaleText>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, loading && styles.buttonDisabled]}
          onPress={checkVerification}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <NoScaleText style={styles.buttonText}>인증완료</NoScaleText>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
}

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9f9f9',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    paddingHorizontal: 20,
    paddingTop: 40,
    marginTop: 8,
    alignItems: 'center',

    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.5,
    shadowRadius: 6,

    elevation: 6,
  },
  progressBar: {
    height: 3,
    backgroundColor: '#ddd',
    borderRadius: 2,
    overflow: 'hidden',
    marginBottom: 30,
    width: '100%',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#3A9CFF',
    borderRadius: 2,
  },
  emailText: {
    fontSize: 18,
    marginTop: 200,
    marginBottom: 8,
    color: '#8f8f8f',
  },
  noticeText: {
    fontSize: 18,
    marginBottom: 12,
    color: '#8f8f8f',
  },
  resend: {
    fontSize: 16,
    textAlign: 'right',
    color: '#4a90e2',
    marginTop: 18,
  },

  button: {
    backgroundColor: '#3A9CFF',
    paddingVertical: 12,
    borderRadius: 60,
    alignItems: 'center',
    width: 120,
    alignSelf: 'center',
    marginTop: 50,
    marginBottom: 500,
  },
  buttonDisabled: {
    backgroundColor: '#ccc',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});
