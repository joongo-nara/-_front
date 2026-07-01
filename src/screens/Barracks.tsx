import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Alert, ScrollView } from 'react-native';
import { useStore } from '../store/useStore';
import { Header } from '../components/Header';
import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { TabParamList } from '../../App';
import { useFocusEffect } from '@react-navigation/native';


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

export const BarracksScreen: React.FC<Props> = ({ navigation: _navigation }) => {
  const profile = useStore(state => state.profile);
  const [selectedCompany, setSelectedCompany] = useState<string>('전체');
  const [rankings, setRankings] = useState<PlatoonMember[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchRankings = React.useCallback(async (unit: string) => {
    setIsLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 300));
      
      const mockOthers: PlatoonMember[] = [
        { id: '1', nickname: '안상병', rank: '상병', company: '1중대', level: 39, xp: 3972, isMe: false },
        { id: '2', nickname: '이일병', rank: '일병', company: '1중대', level: 12, xp: 1226, isMe: false },
        { id: '3', nickname: '장일병', rank: '일병', company: '1중대', level: 16, xp: 1609, isMe: false },
        { id: '4', nickname: '이상병', rank: '상병', company: '1중대', level: 39, xp: 3924, isMe: false },
        { id: '5', nickname: '오병장', rank: '병장', company: '1중대', level: 10, xp: 1034, isMe: false },
        { id: '6', nickname: '이상병', rank: '상병', company: '1중대', level: 32, xp: 3202, isMe: false },
        { id: '7', nickname: '윤일병', rank: '일병', company: '1중대', level: 19, xp: 1903, isMe: false },
        { id: '8', nickname: '강병장', rank: '병장', company: '1중대', level: 21, xp: 2168, isMe: false },
        { id: '9', nickname: '최병장', rank: '병장', company: '2중대', level: 29, xp: 2991, isMe: false },
        { id: '10', nickname: '안상병', rank: '상병', company: '2중대', level: 8, xp: 828, isMe: false },
        { id: '11', nickname: '송이병', rank: '이병', company: '2중대', level: 15, xp: 1562, isMe: false },
        { id: '12', nickname: '강일병', rank: '일병', company: '2중대', level: 1, xp: 117, isMe: false },
        { id: '13', nickname: '윤이병', rank: '이병', company: '2중대', level: 4, xp: 416, isMe: false },
        { id: '14', nickname: '송이병', rank: '이병', company: '2중대', level: 25, xp: 2544, isMe: false },
        { id: '15', nickname: '한이병', rank: '이병', company: '2중대', level: 33, xp: 3339, isMe: false },
        { id: '16', nickname: '윤일병', rank: '일병', company: '2중대', level: 15, xp: 1515, isMe: false },
        { id: '17', nickname: '임이병', rank: '이병', company: '3중대', level: 4, xp: 464, isMe: false },
        { id: '18', nickname: '이일병', rank: '일병', company: '3중대', level: 20, xp: 2006, isMe: false },
        { id: '19', nickname: '홍이병', rank: '이병', company: '3중대', level: 20, xp: 2019, isMe: false },
        { id: '20', nickname: '홍일병', rank: '일병', company: '3중대', level: 37, xp: 3792, isMe: false },
        { id: '21', nickname: '정병장', rank: '병장', company: '3중대', level: 34, xp: 3495, isMe: false },
        { id: '22', nickname: '오일병', rank: '일병', company: '3중대', level: 16, xp: 1631, isMe: false },
        { id: '23', nickname: '조이병', rank: '이병', company: '3중대', level: 20, xp: 2011, isMe: false },
        { id: '24', nickname: '조병장', rank: '병장', company: '3중대', level: 27, xp: 2788, isMe: false },
        { id: '25', nickname: '전이병', rank: '이병', company: '대대본부중대', level: 2, xp: 226, isMe: false },
        { id: '26', nickname: '강병장', rank: '병장', company: '대대본부중대', level: 10, xp: 1041, isMe: false },
        { id: '27', nickname: '임일병', rank: '일병', company: '대대본부중대', level: 24, xp: 2499, isMe: false },
        { id: '28', nickname: '안상병', rank: '상병', company: '대대본부중대', level: 20, xp: 2071, isMe: false },
        { id: '29', nickname: '전일병', rank: '일병', company: '대대본부중대', level: 12, xp: 1285, isMe: false },
        { id: '30', nickname: '이상병', rank: '상병', company: '대대본부중대', level: 6, xp: 606, isMe: false },
        { id: '31', nickname: '조이병', rank: '이병', company: '대대본부중대', level: 13, xp: 1347, isMe: false },
        { id: '32', nickname: '정이병', rank: '이병', company: '대대본부중대', level: 17, xp: 1701, isMe: false },
        { id: '33', nickname: '황상병', rank: '상병', company: '단본부중대', level: 7, xp: 713, isMe: false },
        { id: '34', nickname: '조병장', rank: '병장', company: '단본부중대', level: 31, xp: 3169, isMe: false },
        { id: '35', nickname: '조상병', rank: '상병', company: '단본부중대', level: 33, xp: 3321, isMe: false },
        { id: '36', nickname: '김상병', rank: '상병', company: '단본부중대', level: 34, xp: 3459, isMe: false },
        { id: '37', nickname: '서일병', rank: '일병', company: '단본부중대', level: 1, xp: 196, isMe: false },
        { id: '38', nickname: '안병장', rank: '병장', company: '단본부중대', level: 26, xp: 2611, isMe: false },
        { id: '39', nickname: '이일병', rank: '일병', company: '단본부중대', level: 22, xp: 2204, isMe: false },
        { id: '40', nickname: '송일병', rank: '일병', company: '단본부중대', level: 9, xp: 919, isMe: false },
        { id: '41', nickname: '황일병', rank: '일병', company: '단지원중대', level: 15, xp: 1588, isMe: false },
        { id: '42', nickname: '조일병', rank: '일병', company: '단지원중대', level: 40, xp: 4080, isMe: false },
        { id: '43', nickname: '장상병', rank: '상병', company: '단지원중대', level: 16, xp: 1643, isMe: false },
        { id: '44', nickname: '박일병', rank: '일병', company: '단지원중대', level: 32, xp: 3209, isMe: false },
        { id: '45', nickname: '황이병', rank: '이병', company: '단지원중대', level: 33, xp: 3372, isMe: false },
        { id: '46', nickname: '황상병', rank: '상병', company: '단지원중대', level: 7, xp: 718, isMe: false },
        { id: '47', nickname: '서상병', rank: '상병', company: '단지원중대', level: 32, xp: 3246, isMe: false },
        { id: '48', nickname: '윤일병', rank: '일병', company: '단지원중대', level: 15, xp: 1525, isMe: false },
      ];
      
      const me: PlatoonMember = {
        id: profile.userId,
        nickname: profile.nickname,
        rank: profile.rank,
        company: profile.company,
        level: profile.level,
        xp: profile.currentXP,
        isMe: true,
      };
      
      let all = [...mockOthers, me].sort((a, b) => b.level - a.level);
      
      if (unit !== '전체') {
        all = all.filter(m => m.company === unit);
      }
      
      setRankings(all);
    } catch (e) {
      console.error("fetchRankings error", e);
    } finally {
      setIsLoading(false);
    }
  }, [profile.nickname]);

  useFocusEffect(
    React.useCallback(() => {
      fetchRankings(selectedCompany);
    }, [selectedCompany, fetchRankings])
  );

  const handlePoke = async (userId: string, nickname: string) => {
    try {
      await new Promise(resolve => setTimeout(resolve, 200));
      Alert.alert('알림', `${nickname} 유저를 응원했습니다! 👍`);
    } catch (e: any) {
      Alert.alert('오류', e.message || '응원에 실패했습니다.');
    }
  };

  const renderItem = ({ item, index }: { item: PlatoonMember; index: number }) => {
    const myIndex = rankings.findIndex(m => m.isMe);
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
            onPress={() => handlePoke(item.id, item.nickname)}
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
        {isLoading ? (
          <Text style={styles.loadingText}>불러오는 중...</Text>
        ) : (
          <FlatList
            data={rankings}
            keyExtractor={(item) => item.id}
            renderItem={renderItem}
            contentContainerStyle={styles.listContainer}
          />
        )}
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
  loadingText: { color: '#888', marginTop: 20 },
  
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
