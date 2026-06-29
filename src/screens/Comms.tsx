import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform } from 'react-native';
import { useStore, CommsPost } from '../store/useStore';
import { Header } from '../components/Header';

export const CommsScreen: React.FC = () => {
  const commsPosts = useStore(state => state.commsPosts);
  const addCommsPost = useStore(state => state.addCommsPost);
  const toggleLikeCommsPost = useStore(state => state.toggleLikeCommsPost);
  
  const [inputText, setInputText] = useState('');

  const handlePost = () => {
    if (inputText.trim()) {
      addCommsPost(inputText.trim());
      setInputText('');
    }
  };

  const renderItem = ({ item }: { item: CommsPost }) => (
    <View style={styles.postCard}>
      <View style={styles.postHeader}>
        <Text style={styles.authorText}>[{item.authorClass}] {item.authorRank} {item.authorNickname}</Text>
        <Text style={styles.timeText}>{item.timestamp}</Text>
      </View>
      <Text style={styles.contentText}>{item.content}</Text>
      <View style={styles.postFooter}>
        <TouchableOpacity 
          style={[styles.likeButton, item.isLikedByMe && styles.likedButton]} 
          onPress={() => toggleLikeCommsPost(item.id)}
        >
          <Text style={[styles.likeText, item.isLikedByMe && styles.likedText]}>
            {item.isLikedByMe ? '❤️ 좋아요' : '🤍 좋아요'} ({item.likes})
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <KeyboardAvoidingView 
      style={styles.container} 
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <Header title="커뮤니티" showBackButton={false} />
      
      <FlatList
        data={commsPosts}
        keyExtractor={item => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.listContainer}
      />

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="새로운 소식을 공유해보세요..."
          placeholderTextColor="#666"
          value={inputText}
          onChangeText={setInputText}
          multiline
        />
        <TouchableOpacity style={styles.sendButton} onPress={handlePost}>
          <Text style={styles.sendButtonText}>등록</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0A0A0A' },
  listContainer: { padding: 16, paddingBottom: 20 },
  
  postCard: {
    backgroundColor: '#1A1A1A',
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#333',
    borderLeftWidth: 4,
    borderLeftColor: '#4CAF50',
  },
  postHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  authorText: {
    color: '#E0E0E0',
    fontWeight: 'bold',
    fontSize: 14,
  },
  timeText: {
    color: '#666',
    fontSize: 12,
  },
  contentText: {
    color: '#FFF',
    fontSize: 15,
    lineHeight: 22,
    marginBottom: 12,
  },
  postFooter: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  likeButton: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 4,
    backgroundColor: '#2C2C2C',
    borderWidth: 1,
    borderColor: '#444',
  },
  likedButton: {
    backgroundColor: '#1E3320',
    borderColor: '#4CAF50',
  },
  likeText: {
    color: '#B0B0B0',
    fontSize: 12,
    fontWeight: 'bold',
  },
  likedText: {
    color: '#A5D6A7',
  },

  inputContainer: {
    flexDirection: 'row',
    padding: 16,
    backgroundColor: '#111',
    borderTopWidth: 1,
    borderTopColor: '#333',
    alignItems: 'flex-end',
  },
  input: {
    flex: 1,
    backgroundColor: '#1A1A1A',
    color: '#FFF',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    maxHeight: 100,
    borderWidth: 1,
    borderColor: '#333',
    marginRight: 12,
  },
  sendButton: {
    backgroundColor: '#4CAF50',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendButtonText: {
    color: '#000',
    fontWeight: '900',
    fontSize: 14,
  },
});
