import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  Image,
  TouchableOpacity,
  TextInput,
  Switch,
  Keyboard,
  TouchableWithoutFeedback,
} from 'react-native';
import { NoScaleText } from '../components/NoScaleText';
import { Ionicons } from '@expo/vector-icons';
import { useUser } from '../core/context/userContext';

export default function EditProfile() {
  const defaultProfileImage = require('../../assets/defaultprofileimage.png');

  // 유저 데이터 불러오기
  const { userProfile, loading } = useUser();

  // 로딩 중일 때 간단 처리
  if (loading) {
    return (
      <View style={[styles.container, { justifyContent: 'center' }]}>
        <NoScaleText>Loading...</NoScaleText>
      </View>
    );
  }

  // userProfile이 없으면 로그인 필요 표시
  if (!userProfile) {
    return (
      <View style={[styles.container, { justifyContent: 'center' }]}>
        <NoScaleText>로그인이 필요합니다.</NoScaleText>
      </View>
    );
  }

  // 초기값 설정: userProfile 닉네임과 칭호 (없으면 기본값)
  const [nickname, setNickname] = useState(userProfile.nickname || '닉네임');
  const [isEditingNickname, setIsEditingNickname] = useState(false);

  const [title, setTitle] = useState(userProfile.title || '칭호 선택 안함');
  const [expanded, setExpanded] = useState(false);
  const [filter, setFilter] = useState(userProfile.title || '칭호 선택 안함');

  const options = ['칭호 선택 안함', '🐣 처음 날개 단 병아리'];

  const [privacy, setPrivacy] = useState({
    todo: true,
    routine: true,
    record: true,
    level: true,
    title: true,
    profile: true,
  });

  /* 갤러리 열기 예시 */
  const openGallery = () => {
    console.log('갤러리 열기');
  };

  return (
    <TouchableWithoutFeedback
      onPress={() => {
        Keyboard.dismiss();
        setExpanded(false);
        setIsEditingNickname(false);
      }}
      accessible={false}
    >
      <View style={styles.container}>
        {/* ================= 프로필 이미지 ================= */}
        <View style={styles.profileImageWrapper}>
          <Image source={defaultProfileImage} style={styles.profileImage} />

          <TouchableOpacity style={styles.plusButton} onPress={openGallery}>
            <NoScaleText style={styles.plusText}>+</NoScaleText>
          </TouchableOpacity>
        </View>

        {/* ================= 닉네임 ================= */}
        <TouchableOpacity onPress={() => setIsEditingNickname(true)}>
          {isEditingNickname ? (
            <TextInput
              value={nickname}
              onChangeText={setNickname}
              onBlur={() => setIsEditingNickname(false)}
              autoFocus
              style={styles.nicknameInput}
            />
          ) : (
            <NoScaleText style={styles.nicknameText}>{nickname}</NoScaleText>
          )}
        </TouchableOpacity>

        {/* ================= 칭호 드롭다운 ================= */}
        <View
          style={[
            styles.filterButtonContainer,
            expanded && styles.filterButtonExpanded,
          ]}
        >
          <TouchableOpacity
            style={styles.filterButton}
            activeOpacity={1}
            onPress={() => setExpanded((e) => !e)}
          >
            <NoScaleText style={styles.filterText}>{filter}</NoScaleText>
            <Ionicons
              name={expanded ? 'chevron-up' : 'chevron-down'}
              size={14}
              color="#333"
              style={{ marginLeft: 6 }}
            />
          </TouchableOpacity>

          {/* 옵션 펼침 */}
          {expanded && (
            <View style={styles.optionsContainer}>
              {options.map((opt) => (
                <TouchableOpacity
                  key={opt}
                  style={[
                    styles.optionItem,
                    filter === opt && styles.optionItemSelected,
                  ]}
                  onPress={() => {
                    setFilter(opt);
                    setTitle(opt);
                    setExpanded(false);
                  }}
                >
                  <NoScaleText
                    style={[
                      styles.filterText,
                      filter === opt && { fontWeight: 'bold' },
                    ]}
                  >
                    {opt}
                  </NoScaleText>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>

        {/* ================= 데이터 공개 설정 ================= */}
        <View style={styles.privacyCard}>
          <NoScaleText style={styles.privacyTitle}>데이터 공개 설정</NoScaleText>

          {[
            ['todo', 'Todo 누적 완료 횟수'],
            ['routine', 'Routine 누적 완료 횟수'],
            ['record', 'Record 누적 완료 횟수'],
            ['level', '레벨'],
            ['title', '칭호'],
            ['profile', '프로필 사진'],
          ].map(([key, label]) => (
            <View key={key} style={styles.privacyRow}>
              <NoScaleText>{label}</NoScaleText>
              <Switch
                value={privacy[key]}
                onValueChange={(value) =>
                  setPrivacy({ ...privacy, [key]: value })
                }
              />
            </View>
          ))}
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
}

/* ================= 스타일 ================= */
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    paddingTop: 40,
  },

  /* 프로필 이미지 */
  profileImageWrapper: {
    marginBottom: 20,
  },

  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#eee',
  },

  plusButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#3A9CFF',
    alignItems: 'center',
    justifyContent: 'center',
  },

  plusText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },

  /* 닉네임 */
  nicknameText: {
    fontSize: 16,
    borderBottomWidth: 1,
    borderColor: '#ccc',
    paddingVertical: 6,
    width: 200,
    textAlign: 'center',
    marginBottom: 14,
  },

  nicknameInput: {
    fontSize: 16,
    borderBottomWidth: 1,
    borderColor: '#3A9CFF',
    paddingVertical: 6,
    width: 200,
    textAlign: 'center',
    marginBottom: 14,
  },

  /* 칭호 드롭다운 */
  filterButtonContainer: {
    position: 'absolute',
    top: 230,
    alignItems: 'center',
    backgroundColor: '#EBEBEB',
    borderRadius: 30,
    overflow: 'hidden',
    minWidth: 250,
    zIndex: 1000,
  },
  filterButtonExpanded: {
    backgroundColor: '#EBEBEB',
  },
  filterButton: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  filterText: {
    fontSize: 14,
    color: '#333',
  },
  optionsContainer: {
    width: '100%',
    borderTopWidth: 1,
    borderTopColor: '#cdcdcdff',
  },
  optionItem: {
    paddingVertical: 10,
    alignItems: 'center',
  },
  optionItemSelected: {
    backgroundColor: '#f7f7f7ff',
  },

  /* 데이터 공개 설정 */
  privacyCard: {
    width: '90%',
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 30,
    marginTop: 70,

    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 4,
  },

  privacyTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    marginBottom: 18,
    paddingVertical: 8,
  },

  privacyRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
});
