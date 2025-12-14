import React, { useState, useRef, useEffect } from 'react';
import { View, TouchableOpacity, StyleSheet, Keyboard, TouchableWithoutFeedback, ScrollView, ActivityIndicator, Text, Alert, } from 'react-native';
import { NoScaleText, NoScaleTextInput } from '../components/NoScaleText';

import AuthService from '../core/firebase/authService';

export default function SignUpEmail({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');
  const [loading, setLoading] = useState(false);

  // 유효성 검사용 상태
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [passwordConfirmError, setPasswordConfirmError] = useState('');

  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const passwordRegex = /^[A-Za-z0-9!"#$%&'()*+,\-./:;<=>?@[₩\]^_`{|}~]+$/;

  const validateInputs = () => {
    let valid = true;

    if (!validateEmail(email)) {
      setEmailError('유효한 이메일 주소를 입력하세요.');
      valid = false;
    } else {
      setEmailError('');
    }

    if (password.length < 6 && password.lenght >=0) {
      setPasswordError('비밀번호는 6자 이상이어야 합니다.');
      valid = false;
    } else if (password.length > 32) {
      setPasswordError('비밀번호는 32자 이하여야 합니다.');
      valid = false;
    } else if (!passwordRegex.test(password)) {
      setPasswordError('허용되는 특수문자는 ! " # $ % &  ( ) * + , - . / : ; < = > ? @ [ ₩ ] ^ _ ` { | } ~ 입니다.');
      valid = false;
    } else if (!/[A-Za-z]/.test(password)) {
      setPasswordError('비밀번호에 최소 1개의 영어가 포함되어야 합니다.');
      valid = false;
    } else if (!/[0-9]/.test(password)) {
      setPasswordError('비밀번호에 최소 1개의 숫자가 포함되어야 합니다.');
      valid = false;
    } else if (!/[!"#$%&'()*+,\-./:;<=>?@[₩\]^_`{|}~]/.test(password)) {
      setPasswordError('비밀번호에 최소 1개의 특수문자가 포함되어야 합니다.');
      valid = false;
    } else {
      setPasswordError('');
    }

    if (password !== passwordConfirm) {
      setPasswordConfirmError('비밀번호가 일치하지 않습니다.');
      valid = false;
    } else {
      setPasswordConfirmError('');
    }

    return valid;
  };

  const isButtonValid = 
    email.length > 0 &&
    password.length >= 6 && 
    password === passwordConfirm &&
    validateEmail(email);

  const totalSteps = 3; // 회원가입 총 단계
  const currentStep = 1; // 현재 단계
  const progressWidth = `${(currentStep / totalSteps) * 100}%`; // 진행바 길이

  const scrollViewRef = useRef(null);

  useEffect(() => {
    const keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', () => {
      if (scrollViewRef.current) {
        scrollViewRef.current.scrollTo({ y: 0, animated: true });
      }
    });

    return () => {
      keyboardDidHideListener.remove();
    };
  }, []);

  const handleSignUp = async () => {
    if (!validateInputs()) {
      return;
    }

    setLoading(true);
    try {
      // 회원가입 + 인증 메일 발송
      const result = await AuthService.createAccount(email.trim(), password);
      setLoading(false);
      navigation.navigate('EmailVerification', { email: email.trim() });
      
    } catch (error) {
      setLoading(false);
      Alert.alert('회원가입 실패', error.message || '문제가 발생했습니다.');
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <View style={{ flex: 1, backgroundColor: '#fff' }}>
        <ScrollView
          ref={scrollViewRef}
          contentContainerStyle={{ paddingBottom: 0 }}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.container}>
            <View style={styles.progressBar}>
              <View style={[styles.progressFill, { width: progressWidth }]} />
            </View>

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
              />
              {!!emailError && <Text style={styles.errorText}>{emailError}</Text>}
            </View>

            <View style={styles.inputContainer}>
              <NoScaleText style={styles.label1}>비밀번호 입력</NoScaleText>
              <NoScaleTextInput
                style={styles.input}
                placeholder="password"
                placeholderTextColor="#bbb"
                value={password}
                onChangeText={setPassword}
                secureTextEntry={true}
                autoCapitalize="none"
                onBlur={() => {
                  if (password.length >= 0 && password.length < 6) {
                    setPasswordError('비밀번호는 6자 이상이어야 합니다.');
                  } else if (password.length > 32) {
                    setPasswordError('비밀번호는 32자 이하여야 합니다.');
                  } else if (!passwordRegex.test(password)) {
                    setPasswordError('허용되는 특수문자는 ! " # $ % &  ( ) * + , - . / : ; < = > ? @ [ ₩ ] ^ _ ` { | } ~  입니다.');
                  } else if (!/[A-Za-z]/.test(password)) {
                    setPasswordError('비밀번호에 최소 1개의 영어가 포함되어야 합니다.');
                  } else if (!/[0-9]/.test(password)) {
                    setPasswordError('비밀번호에 최소 1개의 숫자가 포함되어야 합니다.');
                  } else if (!/[!"#$%&'()*+,\-./:;<=>?@[₩\]^_`{|}~]/.test(password)) {
                    setPasswordError('비밀번호에 최소 1개의 특수문자가 포함되어야 합니다.');
                  } else {
                    setPasswordError('');
                  }
                }}
              />
              {!!passwordError && <Text style={styles.errorText}>{passwordError}</Text>}

              <NoScaleText style={styles.label2}>비밀번호 확인</NoScaleText>
              <NoScaleTextInput
                style={styles.input}
                placeholder="password"
                placeholderTextColor="#bbb"
                value={passwordConfirm}
                onChangeText={setPasswordConfirm}
                secureTextEntry={true}
                autoCapitalize="none"
                onBlur={() => {
                  if (passwordConfirm.length > 0 && password !== passwordConfirm) {
                    setPasswordConfirmError('비밀번호가 일치하지 않습니다.');
                  } else {
                    setPasswordConfirmError('');
                  }
                }}
              />
              {!!passwordConfirmError && <Text style={styles.errorText}>{passwordConfirmError}</Text>}
            </View>

            <TouchableOpacity
              style={[styles.button, !isButtonValid && styles.buttonDisabled]}
              disabled={!isButtonValid || loading}
              onPress={handleSignUp}
            >
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <NoScaleText style={styles.buttonText}>계속</NoScaleText>
              )}
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9f9f9',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    paddingHorizontal: 20,
    paddingTop: 40,
    marginTop: 8,

    //iOS 그림자 속성
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.5,
    shadowRadius: 6,

    //Android 그림자 속성
    elevation: 6,
  },
  progressBar: {
    height: 3,
    backgroundColor: '#ddd',
    borderRadius: 2,
    overflow: 'hidden',
    marginBottom: 30,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#3A9CFF',
    borderRadius: 2,
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
  label1: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  label2: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 40,
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
