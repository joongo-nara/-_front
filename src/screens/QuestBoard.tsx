import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { useStore, QuestType } from '../store/useStore';
import { Header } from '../components/Header';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../App';
import { useFocusEffect } from '@react-navigation/native';

type Props = NativeStackScreenProps<RootStackParamList, 'QuestBoard'>;

const TABS: { id: QuestType; label: string }[] = [
  { id: 'daily', label: '일일' },
  { id: 'weekly', label: '주간' },
  { id: 'coop', label: '협동' },
  { id: 'special', label: '스페셜' },
];

export const QuestBoardScreen: React.FC<Props> = ({ navigation }) => {
  const { quests, rerollSingleDailyQuest, completeQuest, profile, fetchQuests } = useStore();
  const [activeTab, setActiveTab] = useState<QuestType>('daily');

  useFocusEffect(
    useCallback(() => {
      fetchQuests();
    }, [fetchQuests])
  );

  const filteredQuests = quests.filter(q => q.type === activeTab);

  return (
    <View style={styles.container}>
      <Header title="퀘스트 보드" onBack={() => navigation.goBack()} />
      
      <View style={styles.tabContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
          {TABS.map((tab) => (
            <TouchableOpacity
              key={tab.id}
              style={[styles.tabButton, activeTab === tab.id && styles.activeTabButton]}
              onPress={() => setActiveTab(tab.id)}
            >
              <Text style={[styles.tabText, activeTab === tab.id && styles.activeTabText]}>
                {tab.label}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <FlatList
        data={filteredQuests}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        renderItem={({ item }) => (
          <View style={[styles.questCard, item.isCompleted && styles.completedCard]}>
            <View style={styles.questInfo}>
              <View style={styles.titleRow}>
                <Text style={styles.titleText}>{item.title}</Text>
                {activeTab === 'daily' && !item.isCompleted && (
                  <TouchableOpacity 
                    style={[styles.rerollButton, item.isRerolled && styles.disabledRerollButton]}
                    disabled={item.isRerolled}
                    onPress={() => rerollSingleDailyQuest(item.id)}
                  >
                    <Text style={[styles.rerollText, item.isRerolled && styles.disabledRerollText]}>
                      ↻
                    </Text>
                  </TouchableOpacity>
                )}
              </View>
              <Text style={styles.description}>{item.description}</Text>
              <View style={styles.detailsRow}>
                <Text style={styles.difficulty}>난이도: {item.difficulty}</Text>
                <Text style={styles.reward}>
                  보상: +{item.rewardXP} XP {
                    item.targetStat && item.statIncrease 
                      ? `/ ${
                          { strength: '근력', stamina: '체력', intelligence: '지력', mental: '정신력', survival: '생존술' }[item.targetStat] || item.targetStat
                        } +${item.statIncrease}` 
                      : ''
                  }
                </Text>
              </View>
            </View>
            <TouchableOpacity 
              style={[styles.actionButton, item.isCompleted && styles.completedButton]}
              disabled={item.isCompleted}
              onPress={() => {
                if (!profile.buddyGroupPin) {
                  Alert.alert(
                    '전우조 미결속',
                    '마이페이지에서 전우조 PIN을 먼저 등록해주세요.',
                    [{ text: '확인' }]
                  );
                  return;
                }
                
                Alert.alert(
                  '승인 요청',
                  `전우조(PIN: ${profile.buddyGroupPin})에게 퀘스트 완료 승인을 요청했습니다.`,
                  [
                    { 
                      text: '확인', 
                      onPress: async () => {
                        try {
                          await completeQuest(item.id, profile.buddyGroupPin!);
                          Alert.alert('승인 완료', '동기가 퀘스트를 승인하여 보상을 획득했습니다!');
                        } catch (e: any) {
                          Alert.alert('승인 실패', e.message || '인증 중 오류가 발생했습니다.');
                        }
                      }
                    }
                  ]
                );
              }}
            >
              <Text style={styles.actionButtonText}>
                {item.isCompleted ? '완료됨' : '수행하기'}
              </Text>
            </TouchableOpacity>
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0A0A0A' },
  tabContainer: { paddingVertical: 12, backgroundColor: '#1A1A1A', borderBottomWidth: 1, borderBottomColor: '#333' },
  scrollContent: { paddingHorizontal: 16 },
  tabButton: { paddingVertical: 8, paddingHorizontal: 20, borderRadius: 20, backgroundColor: '#2C2C2C', marginRight: 10 },
  activeTabButton: { backgroundColor: '#4CAF50' },
  tabText: { color: '#B0B0B0', fontWeight: 'bold' },
  activeTabText: { color: '#FFF' },
  listContent: { padding: 16 },
  questCard: { 
    flexDirection: 'row', 
    backgroundColor: '#1A1A1A', 
    padding: 16, 
    borderRadius: 12, 
    marginBottom: 16, 
    borderWidth: 1, 
    borderColor: '#333',
    alignItems: 'center'
  },
  completedCard: { opacity: 0.5 },
  questInfo: { flex: 1, paddingRight: 12 },
  titleRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 6 },
  titleText: { fontSize: 18, fontWeight: 'bold', color: '#FFF', flex: 1 },
  rerollButton: { 
    width: 32, 
    height: 32, 
    borderRadius: 16, 
    backgroundColor: '#0A140A', 
    borderWidth: 1, 
    borderColor: '#39FF14', 
    justifyContent: 'center', 
    alignItems: 'center', 
    marginLeft: 12,
    shadowColor: '#39FF14',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 8,
    elevation: 8
  },
  disabledRerollButton: { 
    backgroundColor: '#111', 
    borderWidth: 1, 
    borderColor: '#333',
    shadowOpacity: 0, 
    elevation: 0,
    opacity: 0.8
  },
  rerollText: { fontSize: 16, color: '#39FF14', fontWeight: '900', marginTop: -2 },
  disabledRerollText: { color: '#555' },
  description: { fontSize: 14, color: '#B0B0B0', marginBottom: 12 },
  detailsRow: { flexDirection: 'row', alignItems: 'center' },
  difficulty: { fontSize: 12, color: '#FF9800', marginRight: 12, fontWeight: 'bold' },
  reward: { fontSize: 12, color: '#4CAF50', fontWeight: 'bold' },
  actionButton: { backgroundColor: '#1E88E5', paddingVertical: 12, paddingHorizontal: 16, borderRadius: 8, justifyContent: 'center', alignItems: 'center', minWidth: 80 },
  completedButton: { backgroundColor: '#2C2C2C' },
  actionButtonText: { color: '#FFF', fontWeight: 'bold', fontSize: 14 },
  globalRerollButton: { paddingVertical: 8, paddingHorizontal: 16, borderRadius: 20, backgroundColor: '#0A140A', borderWidth: 1, borderColor: '#39FF14', marginLeft: 10, justifyContent: 'center' },
  globalRerollText: { color: '#39FF14', fontWeight: 'bold', fontSize: 13 },
});
