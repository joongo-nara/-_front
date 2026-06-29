import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { Header } from '../components/Header';
import { useStore } from '../store/useStore';

type FilterTab = 'daily' | 'weekly' | 'monthly';

export const AdminDashboardScreen: React.FC = () => {
  const quests = useStore(state => state.quests);
  const [activeTab, setActiveTab] = useState<FilterTab>('daily');

  // 실제 데이터 연동: 전체 퀘스트 달성률 계산
  const totalQuests = quests.length;
  const completedQuests = quests.filter(q => q.isCompleted).length;
  const completionRate = totalQuests > 0 ? Math.round((completedQuests / totalQuests) * 100) : 0;

  // 관리자 액션 (알림 발송)
  const handleSendWarning = (userName: string) => {
    Alert.alert(
      "경고 알림 발송",
      `${userName} 유저에게 미활동 경고 푸시 알림을 전송하시겠습니까?`,
      [
        { text: "취소", style: "cancel" },
        { text: "발송", onPress: () => Alert.alert("전송 완료", "해당 유저에게 알림이 전송되었습니다.") }
      ]
    );
  };

  // 탭에 따라 변동되는 목업 데이터
  const getTabLabel = () => {
    if (activeTab === 'daily') return '일간';
    if (activeTab === 'weekly') return '주간';
    return '월간';
  };

  const mockUsersCount = activeTab === 'daily' ? 124 : activeTab === 'weekly' ? 840 : 3200;

  return (
    <View style={styles.container}>
      <Header title="관리자 대시보드" showBackButton={false} />
      
      {/* 탭 필터링 UI */}
      <View style={styles.tabContainer}>
        {(['daily', 'weekly', 'monthly'] as FilterTab[]).map(tab => (
          <TouchableOpacity 
            key={tab} 
            style={[styles.tabButton, activeTab === tab && styles.activeTabButton]}
            onPress={() => setActiveTab(tab)}
          >
            <Text style={[styles.tabText, activeTab === tab && styles.activeTabText]}>
              {tab === 'daily' ? '일간' : tab === 'weekly' ? '주간' : '월간'}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        
        {/* 전체 유저 통계 (실제 데이터 반영) */}
        <View style={styles.radarCard}>
          <Text style={styles.radarTitle}>[ 전체 유저 통계 ({getTabLabel()}) ]</Text>
          <View style={styles.statsGrid}>
            <View style={styles.statBox}>
              <Text style={styles.statLabel}>총 접속 인원</Text>
              <Text style={styles.statValue}>{mockUsersCount} 명</Text>
            </View>
            <View style={styles.statBox}>
              <Text style={styles.statLabel}>전체 퀘스트 달성률</Text>
              <Text style={styles.statValueGreen}>{completionRate} %</Text>
            </View>
          </View>
        </View>

        {/* 차트 */}
        <Text style={styles.sectionTitle}>{"// 주간 퀘스트 달성 추이"}</Text>
        <View style={styles.chartCard}>
          <View style={styles.mockChart}>
            <View style={styles.barContainer}><View style={[styles.bar, styles.barH40]} /><Text style={styles.barLabel}>월</Text></View>
            <View style={styles.barContainer}><View style={[styles.bar, styles.barH60]} /><Text style={styles.barLabel}>화</Text></View>
            <View style={styles.barContainer}><View style={[styles.bar, styles.barH50]} /><Text style={styles.barLabel}>수</Text></View>
            <View style={styles.barContainer}><View style={[styles.bar, styles.barH80]} /><Text style={styles.barLabel}>목</Text></View>
            <View style={styles.barContainer}><View style={[styles.bar, styles.barH95]} /><Text style={styles.barLabel}>금</Text></View>
            <View style={styles.barContainer}><View style={[styles.bar, styles.barH30]} /><Text style={styles.barLabel}>토</Text></View>
            <View style={styles.barContainer}><View style={[styles.bar, styles.barH20]} /><Text style={styles.barLabel}>일</Text></View>
          </View>
        </View>

        {/* 인사이트 (가장 많이 완료된 퀘스트 Top 3) */}
        <Text style={styles.sectionTitle}>{"// 가장 많이 완료된 퀘스트 Top 3"}</Text>
        <View style={styles.listCard}>
          <View style={styles.insightItem}>
            <View style={styles.insightRankBadge}><Text style={styles.insightRankText}>1</Text></View>
            <Text style={styles.insightName}>1km 달리기</Text>
            <Text style={styles.insightCount}>89회 달성</Text>
          </View>
          <View style={styles.insightItem}>
            <View style={styles.insightRankBadge}><Text style={styles.insightRankText}>2</Text></View>
            <Text style={styles.insightName}>팔굽혀펴기 30개</Text>
            <Text style={styles.insightCount}>65회 달성</Text>
          </View>
          <View style={[styles.insightItem, styles.lastListItem]}>
            <View style={styles.insightRankBadge}><Text style={styles.insightRankText}>3</Text></View>
            <Text style={styles.insightName}>주간 일기 작성</Text>
            <Text style={styles.insightCount}>42회 달성</Text>
          </View>
        </View>

        {/* 미활동 유저 목록 (관리자 액션) */}
        <Text style={styles.sectionTitle}>{"// 미활동 유저 목록"}</Text>
        <View style={styles.listCard}>
          <View style={styles.listItem}>
            <View style={styles.listTextContainer}>
              <Text style={styles.listItemName}>이병 김철수</Text>
              <Text style={styles.listItemStatus}>최근 3일 퀘스트 미달성</Text>
            </View>
            <TouchableOpacity style={styles.actionButton} onPress={() => handleSendWarning('김철수')}>
              <Text style={styles.actionButtonText}>알림 발송</Text>
            </TouchableOpacity>
          </View>
          <View style={[styles.listItem, styles.lastListItem]}>
            <View style={styles.listTextContainer}>
              <Text style={styles.listItemName}>일병 박영희</Text>
              <Text style={styles.listItemStatus}>5일 연속 접속 없음</Text>
            </View>
            <TouchableOpacity style={styles.actionButton} onPress={() => handleSendWarning('박영희')}>
              <Text style={styles.actionButtonText}>알림 발송</Text>
            </TouchableOpacity>
          </View>
        </View>

      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0A0A0A' },
  
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: '#111',
    borderBottomWidth: 1,
    borderBottomColor: '#222',
  },
  tabButton: {
    flex: 1,
    paddingVertical: 14,
    alignItems: 'center',
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  activeTabButton: {
    borderBottomColor: '#4CAF50',
    backgroundColor: '#1A1A1A',
  },
  tabText: {
    color: '#666',
    fontWeight: 'bold',
    fontSize: 14,
  },
  activeTabText: {
    color: '#4CAF50',
  },

  content: { padding: 16, paddingBottom: 40 },
  
  radarCard: {
    backgroundColor: '#111',
    borderWidth: 1,
    borderColor: '#333',
    padding: 20,
    borderRadius: 8,
    marginBottom: 24,
  },
  radarTitle: {
    color: '#4CAF50',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
    letterSpacing: 1,
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statBox: {
    flex: 1,
    backgroundColor: '#1A1A1A',
    padding: 16,
    borderRadius: 8,
    marginHorizontal: 4,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#222',
  },
  statLabel: {
    color: '#888',
    fontSize: 12,
    marginBottom: 8,
  },
  statValue: {
    color: '#FFF',
    fontSize: 24,
    fontWeight: 'bold',
  },
  statValueGreen: {
    color: '#4CAF50',
    fontSize: 24,
    fontWeight: 'bold',
  },

  sectionTitle: {
    color: '#666',
    fontSize: 14,
    fontStyle: 'italic',
    fontWeight: 'bold',
    marginBottom: 12,
  },
  
  chartCard: {
    backgroundColor: '#111',
    padding: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#333',
    marginBottom: 24,
  },
  mockChart: {
    flexDirection: 'row',
    height: 150,
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    paddingHorizontal: 8,
  },
  barContainer: {
    alignItems: 'center',
    width: 30,
    height: '100%',
    justifyContent: 'flex-end',
  },
  bar: {
    width: 20,
    backgroundColor: '#4CAF50',
    borderTopLeftRadius: 4,
    borderTopRightRadius: 4,
    marginBottom: 8,
  },
  barLabel: {
    color: '#888',
    fontSize: 12,
  },

  listCard: {
    backgroundColor: '#111',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#333',
    padding: 16,
    marginBottom: 24,
  },
  insightItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#222',
  },
  insightRankBadge: {
    width: 24, height: 24,
    borderRadius: 12,
    backgroundColor: '#333',
    justifyContent: 'center', alignItems: 'center',
    marginRight: 12,
  },
  insightRankText: { color: '#FFF', fontSize: 12, fontWeight: 'bold' },
  insightName: { flex: 1, color: '#E0E0E0', fontSize: 14, fontWeight: 'bold' },
  insightCount: { color: '#4CAF50', fontSize: 13, fontWeight: 'bold' },

  listItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#222',
  },
  listTextContainer: { flex: 1 },
  listItemName: {
    color: '#E0E0E0',
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  listItemStatus: {
    color: '#FF5252',
    fontSize: 13,
  },
  actionButton: {
    backgroundColor: '#1E3320',
    borderWidth: 1,
    borderColor: '#4CAF50',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 4,
  },
  actionButtonText: {
    color: '#4CAF50',
    fontSize: 12,
    fontWeight: 'bold',
  },

  barH40: { height: '40%' },
  barH60: { height: '60%' },
  barH50: { height: '50%' },
  barH80: { height: '80%' },
  barH95: { height: '95%' },
  barH30: { height: '30%', backgroundColor: '#444' },
  barH20: { height: '20%', backgroundColor: '#444' },
  lastListItem: { borderBottomWidth: 0 },
});
