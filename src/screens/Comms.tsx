import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, FlatList, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform } from 'react-native';
import { useStore, CommsPost } from '../store/useStore';
import { Header } from '../components/Header';
import { useFocusEffect } from '@react-navigation/native';

const PostItem = ({ item }: { item: CommsPost }) => {
  const [showComments, setShowComments] = useState(false);
  const [commentText, setCommentText] = useState('');
  const toggleLikeCommsPost = useStore(state => state.toggleLikeCommsPost);
  const addCommentToPost = useStore(state => state.addCommentToPost);

  const handleCommentSubmit = () => {
    if (commentText.trim()) {
      addCommentToPost(item.id, commentText.trim());
      setCommentText('');
    }
  };

  return (
    <View style={styles.postCard}>
      <View style={styles.postHeader}>
        <Text style={styles.authorText}>[{item.authorClass}] {item.authorRank} {item.authorNickname}</Text>
        <Text style={styles.timeText}>{item.timestamp}</Text>
      </View>
      <Text style={styles.contentText}>{item.content}</Text>
      <View style={styles.postFooter}>
        <TouchableOpacity 
          style={styles.actionButton}
          onPress={() => setShowComments(!showComments)}
        >
          <Text style={styles.actionText}>💬 댓글 ({item.commentList?.length || 0})</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.actionButton, item.isLikedByMe && styles.likedButton]} 
          onPress={() => toggleLikeCommsPost(item.id)}
        >
          <Text style={[styles.actionText, item.isLikedByMe && styles.likedText]}>
            {item.isLikedByMe ? '❤️ 좋아요' : '🤍 좋아요'} ({item.likes})
          </Text>
        </TouchableOpacity>
      </View>

      {showComments && (
        <View style={styles.commentsSection}>
          {item.commentList?.map(comment => (
            <View key={comment.id} style={styles.commentItem}>
              <View style={styles.commentHeader}>
                <Text style={styles.commentAuthor}>{comment.authorRank} {comment.authorNickname}</Text>
                <Text style={styles.commentTime}>{comment.timestamp}</Text>
              </View>
              <Text style={styles.commentContent}>{comment.content}</Text>
            </View>
          ))}
          <View style={styles.commentInputRow}>
            <TextInput 
              style={styles.commentInput} 
              placeholder="댓글을 입력하세요..." 
              placeholderTextColor="#666"
              value={commentText}
              onChangeText={setCommentText}
            />
            <TouchableOpacity style={styles.commentSubmitButton} onPress={handleCommentSubmit}>
              <Text style={styles.commentSubmitText}>등록</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </View>
  );
};

export const CommsScreen: React.FC = () => {
  const commsPosts = useStore(state => state.commsPosts);
  const addCommsPost = useStore(state => state.addCommsPost);
  const fetchPosts = useStore(state => state.fetchPosts);
  
  useFocusEffect(
    useCallback(() => {
      fetchPosts();
    }, [fetchPosts])
  );
  
  const [inputText, setInputText] = useState('');

  const handlePost = () => {
    if (inputText.trim()) {
      addCommsPost(inputText.trim());
      setInputText('');
    }
  };

  return (
    <KeyboardAvoidingView 
      style={styles.container} 
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <Header title="커뮤니티" showBackButton={false} />
      
      <FlatList
        data={commsPosts}
        keyExtractor={item => item.id}
        renderItem={({ item }) => <PostItem item={item} />}
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
          <Text style={styles.sendButtonText}>작성</Text>
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
    gap: 8,
  },
  actionButton: {
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
  actionText: {
    color: '#B0B0B0',
    fontSize: 12,
    fontWeight: 'bold',
  },
  likedText: {
    color: '#A5D6A7',
  },

  commentsSection: {
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#333',
  },
  commentItem: {
    marginBottom: 12,
    backgroundColor: '#111',
    padding: 10,
    borderRadius: 6,
  },
  commentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  commentAuthor: {
    color: '#B0B0B0',
    fontWeight: 'bold',
    fontSize: 12,
  },
  commentTime: {
    color: '#666',
    fontSize: 10,
  },
  commentContent: {
    color: '#FFF',
    fontSize: 13,
  },
  commentInputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  commentInput: {
    flex: 1,
    backgroundColor: '#111',
    color: '#FFF',
    borderRadius: 6,
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: '#333',
    marginRight: 8,
    fontSize: 13,
  },
  commentSubmitButton: {
    backgroundColor: '#4CAF50',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 6,
  },
  commentSubmitText: {
    color: '#000',
    fontWeight: 'bold',
    fontSize: 12,
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
