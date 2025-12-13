import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Keyboard, TouchableWithoutFeedback, FlatList } from 'react-native';
import { NoScaleText, NoScaleTextInput } from '../components/NoScaleText';
import { Ionicons } from '@expo/vector-icons';
import FriendItem from '../components/FriendItem';

export default function Social({ navigation }) {
  const [activeTab, setActiveTab] = useState('friendsList');
  const [email, setEmail] = useState('');

  //데이터 리스트
  const [currentFriends, setCurrentFriends] = useState([
    {
    id: 'c-1',
    profileImage: null,
    title: '🦊 생각 먹는 여우',
    level: 12,
    nickname: '고모프',
    },
    {
    id: 'c-2',
    profileImage: null,
    title: null,
    level: 2,
    nickname: 'Hansung',
    },
  ]);

  const [sentRequests, setSentRequests] = useState([
    {
    id: 's-1',
    profileImage: null,
    title: '🦊 생각 먹는 여우',
    level: 12,
    nickname: '고모프',
    },
  ]);
  
  const [recieveFriends, setRecieveFriends] = useState([
    {
    id: 'r-1',
    profileImage: null,
    title: '🦊 생각 먹는 여우',
    level: 12,
    nickname: '고모프',
    },
  ]);

  //친구 삭제
  const handleDeleteFriend = (id) => {
  setCurrentFriends((prev) =>
    prev.filter((item) => item.id !== id)
  );
};

  // 친구 신청 취소 (보낸 신청)
const handleCancelRequest = (id) => {
  setSentRequests((prev) =>
    prev.filter((item) => item.id !== id)
  );
};

// 친구 요청 수락
const handleAcceptRequest = (friend) => {
  // 1️⃣ 받은 신청 목록에서 제거
  setRecieveFriends((prev) =>
    prev.filter((item) => item.id !== friend.id)
  );

  // 2️⃣ 친구 목록에 추가
  setCurrentFriends((prev) => [...prev, friend]);
};

// 친구 요청 거절
const handleRejectRequest = (id) => {
  setRecieveFriends((prev) =>
    prev.filter((item) => item.id !== id)
  );
};

  return (
    
      <View style={styles.container}>
        <View style={styles.tabsContainer}>
          <TouchableOpacity
            style={[styles.tabButton, activeTab === 'friendsList' && styles.activeTab]}
            onPress={() => setActiveTab('friendsList')}
          >
            <NoScaleText style={[styles.tabText, activeTab === 'friendsList' && styles.activeTabText]}>
              친구 목록
            </NoScaleText>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.tabButton, activeTab === 'friendRequest' && styles.activeTab]}
            onPress={() => setActiveTab('friendRequest')}
          >
            <NoScaleText style={[styles.tabText, activeTab === 'friendRequest' && styles.activeTabText]}>
              친구 신청
            </NoScaleText>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.tabButton, activeTab === 'receivedRequest' && styles.activeTab]}
            onPress={() => setActiveTab('receivedRequest')}
          >
            <NoScaleText style={[styles.tabText, activeTab === 'receivedRequest' && styles.activeTabText]}>
              받은 신청
            </NoScaleText>
          </TouchableOpacity>
        </View>

        {/* 내용 영역 */}
        <View style={styles.content}>
          {activeTab === 'friendsList' && (
            <View style={styles.listContainer}>
              <FlatList
                  data={currentFriends}
                  keyExtractor={(item) => item.id}
                  renderItem={({ item }) => (
                    <FriendItem {...item} type="c" 
                    onDelete={() => {
                      handleDeleteFriend(item.id)
                    }}
                    />
                  )}
                  ListEmptyComponent={
                    <View style={styles.emptyListContainer}>
                      <NoScaleText style={styles.emptyText}>아직 친구가 없습니다.{'\n'}친구를 추가해보세요!</NoScaleText>
                    </View>
                  }
                  contentContainerStyle={{
                    flexGrow: 1,
                    justifyContent: currentFriends.length === 0 ? 'center' : 'flex-start',
                  }}
                />
            </View>
          )}

          {activeTab === 'friendRequest' && (
            <View style={{ flex: 1 }}>
              <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
                <View>
                  <View style={styles.inputContainer}>
                    <NoScaleText style={styles.label}>친구 신청</NoScaleText>
                    <NoScaleTextInput
                      style={styles.input}
                      placeholder="e-mail"
                      placeholderTextColor="#bbb"
                      value={email}
                      onChangeText={setEmail}
                      keyboardType="email-address"
                      autoCapitalize="none"
                    />
                  </View>
                  <TouchableOpacity
                    style={[styles.button, !email && styles.buttonDisabled]}
                    disabled={!email}
                    onPress={() => {
                      navigation.navigate('SignUpEmailCode', { email });
                    }}
                  >
                    <NoScaleText style={styles.buttonText}>신청</NoScaleText>
                  </TouchableOpacity>
                </View>
              </TouchableWithoutFeedback>

              <View style={styles.listContainer}>
                <NoScaleText style={styles.sublabel}>보낸 신청 목록</NoScaleText>
                <FlatList
                  data={sentRequests}
                  keyExtractor={(item) => item.id}
                  renderItem={({ item }) => (
                    <FriendItem
                      {...item}
                      type="s"
                      onCancel={() => {
                        handleCancelRequest(item.id)
                      }}
                    />
                  )}
                  ListEmptyComponent={
                    <View style={styles.emptyListContainer}>
                      <NoScaleText style={styles.emptyText}>친구 신청 내역이 없습니다.</NoScaleText>
                    </View>
                  }
                  contentContainerStyle={{
                    flexGrow: 1,
                    justifyContent: sentRequests.length === 0 ? 'center' : 'flex-start',
                  }}
                />
              </View>
            </View>
          )}
          {activeTab === 'receivedRequest' && (
            <View style={styles.listContainer}>
              <FlatList
                  data={recieveFriends}
                  keyExtractor={(item) => item.id}
                  renderItem={({ item }) => (
                    <FriendItem
                      {...item}
                      type="r"
                      onAccept={() => {
                        handleAcceptRequest(item)
                      }}
                      onReject={() => {
                        handleRejectRequest(item.id)
                      }}
                    />
                  )}
                  ListEmptyComponent={
                    <View style={styles.emptyListContainer}>
                      <NoScaleText style={styles.emptyText}>친구 신청 내역이 없습니다.</NoScaleText>
                    </View>
                  }
                  contentContainerStyle={{
                    flexGrow: 1,
                    justifyContent: recieveFriends.length === 0 ? 'center' : 'flex-start',
                  }}
                />
            </View>
          )}
        </View>
      </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    
  },
  tabsContainer: {
    flexDirection: 'row',
    marginTop: 15,
    marginHorizontal: 15,
    borderRadius: 20,
    backgroundColor: '#f2f2f2',
  },
  tabButton: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    borderRadius: 20,
  },
  activeTab: {
    backgroundColor: '#3A9CFF',
  },
  tabText: {
    color: '#999',
    fontWeight: '600',
  },
  activeTabText: {
    color: '#fff',
  },
  content: {
    flex: 1,
    marginTop: 30,
  },
  emptyText: {
    fontSize: 16,
    color: '#999',
    textAlign: 'center',
    lineHeight: 24,
  },

  //친구 신청 탭
  inputContainer: {
    marginBottom: 30,
    paddingHorizontal: 35,
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
  button: {
    backgroundColor: '#3A9CFF',
    paddingVertical: 12,
    borderRadius: 60,
    alignItems: 'center',
    width: 320,
    alignSelf: 'center',
    marginBottom: 50,
  },
  buttonDisabled: {
    backgroundColor: '#ccc',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  sublabel: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  listContainer: {
    flex: 1,
    marginBottom: 30,
    paddingHorizontal: 15,
  },
  requestList: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  requestItem: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },

  emptyListContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
}); 