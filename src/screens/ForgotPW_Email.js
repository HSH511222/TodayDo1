import React, { useState } from 'react';
import { NoScaleText, NoScaleTextInput } from '../components/NoScaleText';
import { View, Text, TouchableOpacity, StyleSheet, Keyboard, TouchableWithoutFeedback, Alert, ActivityIndicator } from 'react-native';
import authService from '../core/firebase/authService';  

export default function ForgotPWEmail({ navigation }) {
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState('');
  const [loading, setLoading] = useState(false);

  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const validateInputs = () => {
    let valid = true;

    if (!validateEmail(email)) {
      setEmailError('유효한 이메일 주소를 입력하세요.');
      valid = false;
    } else {
      setEmailError('');
    }
    return valid;
  };

  const handleSendResetEmail = async () => {
    if (!validateInputs()) return;

    setLoading(true);
    try {
      await authService.resetPassword(email.trim());
      Alert.alert(
        '이메일 전송 완료',
        `${email} 로 비밀번호 재설정 메일을 발송했습니다.\n메일함을 확인해주세요.`,
        [
          {
            text: '확인',
            onPress: () => {
              navigation.navigate('EmailVerificationPW'); // 로그인 화면 등으로 이동
            },
          },
        ],
        { cancelable: false }
      );
    } catch (error) {
      Alert.alert('오류', error.message || '비밀번호 재설정 이메일 발송에 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <View style={{ flex: 1, backgroundColor: '#fff' }}>
        <View style={styles.container}>

          <View style={styles.inputContainer}>
            <NoScaleText style={styles.label}>이메일 입력</NoScaleText>
            <NoScaleTextInput
              style={styles.input}
              placeholder="e-mail"
              placeholderTextColor="#bbb"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              onBlur={() => {
                if (email.length > 0 && !validateEmail(email)) {
                  setEmailError('유효한 이메일 주소를 입력하세요.');
                } else {
                  setEmailError('');
                }
              }}
              editable={!loading}
            />
            {!!emailError && <Text style={styles.errorText}>{emailError}</Text>}
          </View>

          <TouchableOpacity
            style={[styles.button, (!email || !!emailError || loading) && styles.buttonDisabled]}
            disabled={!email || !!emailError || loading}
            onPress={handleSendResetEmail}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <NoScaleText style={styles.buttonText}>계속</NoScaleText>
            )}
          </TouchableOpacity>
        </View>
      </View>
    </TouchableWithoutFeedback>
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

    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.5,
    shadowRadius: 6,

    elevation: 6,
  },
  inputContainer: {
    marginBottom: 20,
    marginTop: 30,
    paddingHorizontal: 15,
  },
  label: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  input: {
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    height: 40,
    fontSize: 14,
    color: '#333',
  },
  errorText: {
    color: '#E50000',
    fontSize: 12,
    marginTop: 4,
  },
  button: {
    backgroundColor: '#3A9CFF',
    paddingVertical: 12,
    borderRadius: 60,
    alignItems: 'center',
    width: 80,
    alignSelf: 'center',
    marginTop: 50,
  },
  buttonDisabled: {
    backgroundColor: '#ccc',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});
