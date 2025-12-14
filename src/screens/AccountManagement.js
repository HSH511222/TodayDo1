import React from 'react';
import { NoScaleText } from '../components/NoScaleText';
import { View, TouchableOpacity, StyleSheet, Keyboard, TouchableWithoutFeedback } from 'react-native';
import { useUser } from '../core/context/userContext';  // 사용자 정보 context 가정

export default function AccountManagement({ navigation }) {
  const { userProfile, loading } = useUser();

  if (loading) {
    return (
      <View style={[styles.container, { justifyContent: 'center' }]}>
        <NoScaleText>Loading...</NoScaleText>
      </View>
    );
  }

  if (!userProfile) {
    return (
      <View style={[styles.container, { justifyContent: 'center' }]}>
        <NoScaleText>로그인이 필요합니다.</NoScaleText>
      </View>
    );
  }

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <View style={{ flex: 1, backgroundColor: '#fff' }}>
        <View style={styles.container}>
          <View style={styles.emailinputContainer}>
            <NoScaleText style={styles.emailtext}>이메일</NoScaleText>
            {/* 이메일을 Text로 출력 */}
            <NoScaleText style={[styles.emailinput, { paddingVertical: 12 }]}>
              {userProfile.email}
            </NoScaleText>
          </View>

          <TouchableOpacity
            onPress={() => {
              navigation.navigate('ChangePW');
            }}
          >
            <NoScaleText style={styles.changepwtext}>비밀번호 변경</NoScaleText>
          </TouchableOpacity>
          <NoScaleText style={styles.warning}>개인정보는 절대 타인에게 보여주지 마세요.</NoScaleText>
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

    //iOS 그림자 속성
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.5,
    shadowRadius: 6,

    //Android 그림자 속성
    elevation: 6,
  },
  emailinputContainer: {
    marginBottom: 20,
    marginTop: 30,
    paddingHorizontal: 15,
  },
  emailtext: {
    marginBottom: 15,
    marginLeft: 20,
    fontWeight: '600',
  },
  emailinput: {
    borderRadius: 60,
    height: 45,
    fontSize: 15,
    color: '#000',
    paddingHorizontal: 20,
    backgroundColor: '#edededff',
  },
  changepwtext: {
    color: '#3A9CFF',
    alignSelf: 'flex-end',
    marginRight: 30,
  },
  warning: {
    color: '#6D6D6D',
    alignSelf: 'center',
    marginTop: 150,
  },
});
