import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Alert, ScrollView } from 'react-native';
import { useStore } from '../store/useStore';
import { Header } from '../components/Header';
import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { TabParamList } from '../../App';

type Props = BottomTabScreenProps<TabParamList, 'BarracksTab'>;

interface PlatoonMember {
  id: string;
  nickname: string;
  rank: string;
  company?: string;
  level: number;
  xp: number;
  isMe?: boolean;
}

const COMPANIES = ['전체', '1중대', '2중대', '3중대', '대대본부중대', '단본부중대', '단지원중대'];

// 랭킹 구성을 위한 더미 데이터 (시나리오 부대 통합)
const MOCK_RANKING_MEMBERS: PlatoonMember[] = [
  { id: 'u0', nickname: '김민석', rank: '일병', company: '단본부중대', level: 5, xp: 600 },
  { id: 'u1', nickname: '박상병', rank: '상병', company: '1중대', level: 35, xp: 15200 },
  { id: 'u2', nickname: '이일병', rank: '일병', company: '2중대', level: 28, xp: 9200 },
  { id: 'u3', nickname: '최병장', rank: '병장', company: '단지원중대', level: 40, xp: 21000 },
  { id: 'u4', nickname: '정일병', rank: '일병', company: '3중대', level: 15, xp: 3600 },
  { id: 'u5', nickname: '강이병', rank: '이병', company: '대대본부중대', level: 8, xp: 1150 },
  { id: 'u6', nickname: '황병장', rank: '병장', company: '단본부중대', level: 42, xp: 22000 },
];

export const BarracksScreen: React.FC<Props> = ({ navigation: _navigation }) => {
  const profile = useStore(state => state.profile);
  const [selectedCompany, setSelectedCompany] = useState<string>('전체');

  // 현재 유저 데이터를 더미 리스트에 포함
  const allMembers: PlatoonMember[] = [
    ...MOCK_RANKING_MEMBERS,
    { 
      id: 'me', 
      nickname: profile.nickname, 
      rank: profile.rank, 
      company: profile.company,
      level: profile.level, 
      xp: profile.currentXP, 
      isMe: true 
    }
  ];

  // 선택된 중대에 따라 필터링 후 레벨/경험치 정렬
  const filteredMembers = allMembers
    .filter(m => selectedCompany === '전체' || m.company === selectedCompany)
    .sort((a, b) => {
      if (b.level !== a.level) return b.level - a.level;
      return b.xp - a.xp;
    });

  const handlePoke = (nickname: string) => {
    Alert.alert('알림', `${nickname} 유저를 응원했습니다! 👍`);
  };

  const renderItem = ({ item, index }: { item: PlatoonMember; index: number }) => {
    // 현재 리스트(필터링된 상태)에서의 내 위치를 찾음
    const myIndex = filteredMembers.findIndex(m => m.isMe);
    const isHigherRanked = index < myIndex;

    return (
      <View style={[styles.card, item.isMe && styles.myCard]}>
        <View style={styles.rankBadge}>
          <Text style={styles.rankNumber}>{index + 1}</Text>
        </View>
        <View style={styles.userInfo}>
          <Text style={[styles.userName, item.isMe && styles.myUserName]}>
            <Text style={styles.companyText}>[{item.company}] </Text>
            {item.rank} {item.nickname} {item.isMe && '(나)'}
          </Text>
          <Text style={styles.userStats}>Lv.{item.level} ({item.xp} XP)</Text>
        </View>
        {isHigherRanked && !item.isMe && (
          <TouchableOpacity 
            style={styles.pokeButton} 
            onPress={() => handlePoke(item.nickname)}
          >
            <Text style={styles.pokeButtonText}>👍 응원하기</Text>
          </TouchableOpacity>
        )}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <Header title="랭킹" showBackButton={false} />
      
      {/* 부대 필터링 탭 */}
      <View style={styles.filterContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filterScroll}>
          {COMPANIES.map(company => {
            const isActive = selectedCompany === company;
            return (
              <TouchableOpacity
                key={company}
                style={[styles.filterChip, isActive && styles.activeFilterChip]}
                onPress={() => setSelectedCompany(company)}
              >
                <Text style={[styles.filterChipText, isActive && styles.activeFilterChipText]}>
                  {company}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      <View style={styles.content}>
        <Text style={styles.listTitle}>
          {selectedCompany === '전체' ? '전체 유저 랭킹' : `${selectedCompany} 소속 랭킹`}
        </Text>
        <FlatList
          data={filteredMembers}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          contentContainerStyle={styles.listContainer}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0A0A0A' },
  
  filterContainer: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#222',
  },
  filterScroll: {
    paddingHorizontal: 16,
    gap: 8,
  },
  filterChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#1A1A1A',
    borderWidth: 1,
    borderColor: '#333',
    marginRight: 8,
  },
  activeFilterChip: {
    backgroundColor: '#4CAF50',
    borderColor: '#4CAF50',
  },
  filterChipText: {
    color: '#888',
    fontSize: 14,
    fontWeight: 'bold',
  },
  activeFilterChipText: {
    color: '#000',
  },

  content: { flex: 1, padding: 16 },
  listTitle: { color: '#FFF', fontSize: 18, fontWeight: 'bold', marginBottom: 16 },
  listContainer: { paddingBottom: 20 },
  
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1A1A1A',
    padding: 16,
    borderRadius: 12,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#333',
  },
  myCard: {
    backgroundColor: '#1E3320', 
    borderColor: '#4CAF50',
  },
  
  rankBadge: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#2C2C2C',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  rankNumber: { color: '#FFF', fontWeight: 'bold', fontSize: 16 },
  
  userInfo: { flex: 1 },
  companyText: { color: '#4CAF50', fontSize: 13, fontWeight: 'normal' },
  userName: { color: '#E0E0E0', fontSize: 16, fontWeight: 'bold', marginBottom: 4 },
  myUserName: { color: '#A5D6A7' },
  userStats: { color: '#B0B0B0', fontSize: 14 },
  
  pokeButton: {
    backgroundColor: '#333',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#555',
  },
  pokeButtonText: { color: '#FFF', fontSize: 13, fontWeight: 'bold' },
});
