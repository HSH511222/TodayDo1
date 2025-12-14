import React, { useState, useEffect } from 'react';
import { View, TouchableOpacity, StyleSheet, Keyboard, TouchableWithoutFeedback, FlatList } from 'react-native';
import { NoScaleText, NoScaleTextInput } from '../components/NoScaleText';
import FriendItem from '../components/FriendItem';

import { useUser } from '../core/context/userContext';
import SocialService from '../core/firebase/socialService';

export default function Social({ navigation }) {
  const { userProfile, loading } = useUser();

  const [activeTab, setActiveTab] = useState('friendsList');
  const [email, setEmail] = useState('');
  const [currentFriends, setCurrentFriends] = useState([]);
  const [sentRequests, setSentRequests] = useState([]);
  const [recieveFriends, setRecieveFriends] = useState([]);

  // 유저 프로필 준비되면 친구/요청 데이터 불러오기
  useEffect(() => {
    if (loading || !userProfile) return;

    const fetchData = async () => {
      try {
        const friends = await SocialService.getFriendsList(userProfile.uid);
        setCurrentFriends(friends);

        const received = await SocialService.getReceivedRequests(userProfile.uid);
        setRecieveFriends(received);

        const sent = await SocialService.getSentRequests(userProfile.uid);
        setSentRequests(sent);
      } catch (error) {
        console.error(error);
      }
    };

    fetchData();
  }, [loading, userProfile]);

  // 친구 신청
  const handleSendRequest = async () => {
    if (!email.trim()) {
      alert('이메일을 입력해주세요.');
      return;
    }
    try {
      await SocialService.sendFriendRequest(userProfile.uid, email.trim());
      const sent = await SocialService.getSentRequests(userProfile.uid);
      setSentRequests(sent);
      setEmail('');
      alert('친구 신청을 보냈습니다.');
    } catch (error) {
      alert(error.message);
    }
  };

  // 친구 요청 수락
  const handleAcceptRequest = async (friend) => {
    try {
      await SocialService.acceptFriendRequest(userProfile.uid, friend.id);

      const received = await SocialService.getReceivedRequests(userProfile.uid);
      setRecieveFriends(received);

      const friends = await SocialService.getFriendsList(userProfile.uid);
      setCurrentFriends(friends);
    } catch (error) {
      alert(error.message);
    }
  };

  // 친구 요청 거절
  const handleRejectRequest = async (id) => {
    try {
      await SocialService.rejectFriendRequest(userProfile.uid, id);
      const received = await SocialService.getReceivedRequests(userProfile.uid);
      setRecieveFriends(received);
    } catch (error) {
      alert(error.message);
    }
  };

  // 친구 삭제
  const handleDeleteFriend = async (id) => {
    try {
      await SocialService.removeFriend(userProfile.uid, id);
      const friends = await SocialService.getFriendsList(userProfile.uid);
      setCurrentFriends(friends);
    } catch (error) {
      alert(error.message);
    }
  };

  // 친구 신청 취소
  const handleCancelRequest = async (id) => {
    try {
      await SocialService.cancelFriendRequest(userProfile.uid, id);
      const sent = await SocialService.getSentRequests(userProfile.uid);
      setSentRequests(sent);
    } catch (error) {
      alert(error.message);
    }
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
                <FriendItem
                  {...item}
                  type="c"
                  onDelete={() => handleDeleteFriend(item.id)}
                />
              )}
              ListEmptyComponent={
                <View style={styles.emptyListContainer}>
                  <NoScaleText style={styles.emptyText}>
                    아직 친구가 없습니다.{'\n'}친구를 추가해보세요!
                  </NoScaleText>
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
                  style={[styles.button, !email.trim() && styles.buttonDisabled]}
                  disabled={!email.trim()}
                  onPress={handleSendRequest}
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
                    onCancel={() => handleCancelRequest(item.id)}
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
                  onAccept={() => handleAcceptRequest(item)}
                  onReject={() => handleRejectRequest(item.id)}
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
    paddingHorizontal: 20,
  },
  listContainer: {
    flex: 1,
    marginBottom: 30,
    paddingHorizontal: 15,
  },
  emptyListContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
