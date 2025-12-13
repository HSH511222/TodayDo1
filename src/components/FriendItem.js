import React from 'react';
import { View, Text, Image, StyleSheet, ImageBackground, TouchableOpacity, } from 'react-native';

export default function FriendItem({
  profileImage,
  title,
  level,
  nickname,
  type,
  onDelete,
  onCancel,
  onAccept,
  onReject,
}) {
  return (
    <View style={styles.container}>
      {/* 왼쪽 영역 (기존 구조 유지) */}
      <View style={styles.leftArea}>
        <Image
          source={
            profileImage
              ? { uri: profileImage }
              : require('../../assets/defaultprofileimage.png')
          }
          style={styles.profile}
        />

        <View style={styles.textContainer}>
          <Text style={styles.titleText}>
            {title ? title : '-'}
          </Text>

          <View style={styles.infoRow}>
            <ImageBackground
              source={require('../../assets/levelbg.png')}
              style={styles.levelbg}
              resizeMode="contain"
            >
              <Text style={styles.levelText}>
                {level ? level : '-'}
              </Text>
            </ImageBackground>

            <Text style={styles.nicknameText}>{nickname}</Text>
          </View>
        </View>
      </View>
      
      {/* 오른쪽 버튼 영역 */}
      {type === 'c' && (
        <TouchableOpacity style={styles.deleteButton} onPress={onDelete}>
          <Text style={styles.deleteText}>삭제</Text>
        </TouchableOpacity>
      )}

      {type === 's' && (
        <TouchableOpacity style={styles.cancelButton} onPress={onCancel}>
          <Text style={styles.cancelText}>취소</Text>
        </TouchableOpacity>
      )}

      {type === 'r' && (
        <View style={styles.actionButtons}>
          <TouchableOpacity style={styles.acceptButton} onPress={onAccept}>
            <Text style={styles.acceptText}>받기</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.rejectButton} onPress={onReject}>
            <Text style={styles.rejectText}>거절</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    justifyContent: 'space-between',
  },

  leftArea: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },

  profile: {
    width: 60,
    height: 60,
    borderRadius: 60,
    marginRight: 12,
    backgroundColor: '#eee',
  },

  textContainer: {
    justifyContent: 'center',
  },

  titleText: {
    fontSize: 12,
    color: '#3A9CFF',
    marginBottom: 2,
    marginTop: 5,
  },

  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  levelbg: {
    width: 28,
    height: 28,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 6,
  },

  levelText: {
    color: '#3A9CFF',
    fontSize: 12,
    fontWeight: 'bold',
  },

  nicknameText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },

  /* 버튼들 */
  deleteButton: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 20,
    backgroundColor: '#eee',
  },
  deleteText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#666',
  },

  cancelButton: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 20,
    backgroundColor: '#eee',
  },

  cancelText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#666',
  },

  actionButtons: {
    flexDirection: 'row',
  },

  acceptButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    backgroundColor: '#3A9CFF',
    marginRight: 6,
  },

  rejectButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    backgroundColor: '#eee',
  },

  acceptText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },

  rejectText: {
    color: '#666',
    fontSize: 12,
    fontWeight: 'bold',
  },
});

