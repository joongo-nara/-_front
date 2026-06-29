import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { useStore } from '../store/useStore';
import { Header } from '../components/Header';
import { useNavigation } from '@react-navigation/native';

export const MainScreen: React.FC = () => {
  const { profile, quests, completeQuest } = useStore();
  const navigation = useNavigation();

  const dailyQuests = quests.filter(q => q.type === 'daily').slice(0, 3);
  const progressPercent = (profile.currentXP / profile.maxXP) * 100;
  const remainingXP = profile.maxXP - profile.currentXP;

  return (
    <View style={styles.container}>
      <Header title="홈" showBackButton={false} />
      <ScrollView contentContainerStyle={styles.content}>

        {/* Profile & Status Section */}
        <View style={styles.profileSection}>
          <View style={styles.profileHeader}>
            <Text style={styles.rankText}>{profile.rank} {profile.nickname}</Text>
            <Text style={styles.dDayText}>D-{profile.dDay}</Text>
          </View>

          <View style={styles.levelContainer}>
            <Text style={styles.levelText}>Lv. {profile.level}</Text>
            <Text style={styles.xpText}>{profile.currentXP} / {profile.maxXP} XP</Text>
          </View>

          {/* Progress Bar */}
          <View style={styles.progressBarBackground}>
            <View style={[styles.progressBarFill, { width: `${progressPercent}%` }]} />
          </View>
          <Text style={styles.remainingXpText}>다음 진급까지 {remainingXP} XP</Text>

          {/* Stats Grid */}
          <View style={styles.statsGrid}>
            <StatBox label="근력" value={profile.stats.strength} />
            <StatBox label="체력" value={profile.stats.stamina} />
            <StatBox label="지력" value={profile.stats.intelligence} />
            <StatBox label="정신력" value={profile.stats.mental} />
            <StatBox label="생존술" value={profile.stats.survival} />
          </View>
        </View>

        {/* Daily Quests Section with Nav Link */}
        <View style={styles.sectionHeaderRow}>
          <Text style={styles.sectionTitle}>오늘의 퀘스트</Text>
          <TouchableOpacity onPress={() => navigation.navigate('QuestBoard' as never)}>
            <Text style={styles.seeAllText}>퀘스트 보드 보기 〉</Text>
          </TouchableOpacity>
        </View>

        {dailyQuests.map((quest) => (
          <TouchableOpacity
            key={quest.id}
            style={styles.questCard}
            activeOpacity={0.7}
            onPress={() => {
              if (quest.isCompleted) return;
              
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
                    onPress: () => {
                      setTimeout(() => {
                        completeQuest(quest.id);
                        Alert.alert('승인 완료', '동기가 퀘스트를 승인하여 보상을 획득했습니다!');
                      }, 1500);
                    }
                  }
                ]
              );
            }}
          >
            <View>
              <Text style={styles.questTitle}>{quest.title}</Text>
              <Text style={styles.questReward}>
                보상: {quest.rewardXP} XP
                {quest.targetStat && quest.statIncrease ? ` / ${quest.targetStat} +${quest.statIncrease}` : ''}
              </Text>
            </View>
            <Text style={quest.isCompleted ? styles.completedStatus : styles.pendingStatus}>
              {quest.isCompleted ? '완료됨' : '대기중'}
            </Text>
          </TouchableOpacity>
        ))}

      </ScrollView>
    </View>
  );
};

// Sub-components for cleaner code
const StatBox = ({ label, value }: { label: string, value: number }) => (
  <View style={styles.statBox}>
    <Text style={styles.statLabel}>{label}</Text>
    <Text style={styles.statValue}>{value}</Text>
  </View>
);

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0A0A0A' },
  content: { padding: 16, paddingBottom: 40 },

  profileSection: { backgroundColor: '#1A1A1A', padding: 20, borderRadius: 12, marginBottom: 24, borderWidth: 1, borderColor: '#333' },
  profileHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 16 },
  rankText: { color: '#E0E0E0', fontSize: 20, fontWeight: 'bold' },
  dDayText: { color: '#FF5252', fontSize: 18, fontWeight: 'bold' },

  levelContainer: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
  levelText: { color: '#FFD700', fontSize: 18, fontWeight: 'bold' },
  xpText: { color: '#9E9E9E', fontSize: 14 },

  progressBarBackground: { height: 10, backgroundColor: '#333', borderRadius: 5, overflow: 'hidden', marginBottom: 6 },
  progressBarFill: { height: '100%', backgroundColor: '#4CAF50', borderRadius: 5 },
  remainingXpText: { color: '#9E9E9E', fontSize: 12, textAlign: 'right', marginBottom: 20 },

  statsGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
  statBox: { backgroundColor: '#2C2C2C', paddingVertical: 10, paddingHorizontal: 12, borderRadius: 8, marginBottom: 10, width: '31%', alignItems: 'center' },
  statLabel: { color: '#B0B0B0', fontSize: 12, marginBottom: 4 },
  statValue: { color: '#FFF', fontSize: 16, fontWeight: 'bold' },

  sectionHeaderRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 12, marginTop: 8 },
  sectionTitle: { color: '#FFF', fontSize: 18, fontWeight: 'bold' },
  seeAllText: { color: '#4CAF50', fontSize: 14, fontWeight: 'bold', marginBottom: 2 },

  questCard: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#1A1A1A', padding: 16, borderRadius: 10, marginBottom: 10, borderWidth: 1, borderColor: '#333' },
  questTitle: { color: '#E0E0E0', fontSize: 16, fontWeight: 'bold', marginBottom: 4 },
  questReward: { color: '#FFD700', fontSize: 12 },
  completedStatus: { color: '#4CAF50', fontWeight: 'bold' },
  pendingStatus: { color: '#FF5252', fontWeight: 'bold' },
});
