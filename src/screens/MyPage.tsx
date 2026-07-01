import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Switch, TextInput, Alert } from 'react-native';
import { useStore } from '../store/useStore';
import { Header } from '../components/Header';
import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { TabParamList } from '../../App';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

type Props = BottomTabScreenProps<TabParamList, 'MyPageTab'>;

const CLASSES = ['소총수', '통신병', '의무병', '운전병', '취사병', '공병', '포병'];

const MOCK_TITLES = [
  { id: '신병', name: '신병' },
  { id: '강철 신병', name: '강철 신병' },
  { id: '무쇠 전사', name: '무쇠 전사' },
  { id: '태산의 파괴자', name: '태산의 파괴자' },
  { id: '전장의 철인', name: '전장의 철인' },
  { id: '끝없는 진격', name: '끝없는 진격' },
  { id: '두 개의 심장', name: '두 개의 심장' },
  { id: '작전 분석관', name: '작전 분석관' },
  { id: '전략 책사', name: '전략 책사' },
  { id: '전장의 제갈량', name: '전장의 제갈량' },
  { id: '의지의 군인', name: '의지의 군인' },
  { id: '강철 멘탈', name: '강철 멘탈' },
  { id: '부처님', name: '부처님' },
  { id: '노련한 척후병', name: '노련한 척후병' },
  { id: '고독한 늑대', name: '고독한 늑대' },
  { id: '불사조', name: '불사조' },
];

const getAsciiLabel = (cls: string) => {
  switch (cls) {
    case '소총수': return '[ ︻┳═一 소총 ]';
    case '의무병': return '[ ✚ 의무 ]';
    case '통신병': return '[ 📡 통신 ]';
    case '운전병': return '[ 🚚 운전 ]';
    case '취사병': return '[ 🍳 취사 ]';
    case '공병': return '[ ⚒ 공병 ]';
    case '포병': return '[ ☄ 포병 ]';
    default: return '[ ︻┳═一 소총 ]';
  }
};

const PixelAvatar = ({ classType, themeColor }: { classType: string, themeColor: string }) => {
  const PALETTE = {
    0: 'transparent',
    1: '#2E3B22', 
    2: '#F5D0C5', 
    3: '#111',    
    4: '#333333', 
    5: '#FF1744', 
    6: '#FFFFFF', 
    7: '#00E5FF', 
    8: '#888888', 
    9: '#FFEA00', 
    10: '#D500F9',
  };

  const baseGrid = [
    [0, 0, 1, 1, 1, 1, 1, 1, 0, 0],
    [0, 1, 1, 1, 1, 1, 1, 1, 1, 0],
    [0, 1, 1, 1, 1, 1, 1, 1, 1, 0],
    [0, 0, 2, 2, 2, 2, 2, 2, 0, 0],
    [0, 0, 2, 3, 2, 2, 3, 2, 0, 0],
    [0, 0, 2, 2, 2, 2, 2, 2, 0, 0],
    [0, 0, 1, 1, 1, 1, 1, 1, 0, 0],
    [0, 4, 4, 4, 4, 4, 4, 4, 4, 0],
    [0, 4, 4, 4, 4, 4, 4, 4, 4, 0],
    [0, 4, 4, 4, 4, 4, 4, 4, 4, 0],
  ];

  const grid = JSON.parse(JSON.stringify(baseGrid)); 

  if (classType === '의무병') {
    grid[1][4] = 5; grid[1][5] = 5; 
    grid[2][4] = 5; grid[2][5] = 5;
    grid[7][1] = 6; grid[7][2] = 6; 
    grid[8][1] = 6; grid[8][2] = 6;
    grid[7][1] = 5; 
  } else if (classType === '통신병') {
    grid[7][8] = 1; grid[8][8] = 1; grid[9][8] = 1;
    grid[7][9] = 1; grid[8][9] = 1; grid[9][9] = 1;
    grid[4][9] = 7; grid[5][9] = 7; grid[6][9] = 7;
  } else if (classType === '운전병') {
    grid[7][4] = 8; grid[7][5] = 8;
    grid[8][3] = 8; grid[8][6] = 8;
    grid[9][4] = 8; grid[9][5] = 8;
  } else if (classType === '취사병') {
    for(let c=2; c<=7; c++) { grid[0][c] = 6; grid[1][c] = 6; grid[2][c] = 6; }
    grid[5][8] = 8; grid[6][8] = 8; grid[7][8] = 8; grid[8][8] = 8; grid[9][8] = 8;
    grid[4][8] = 6; grid[4][9] = 6; 
  } else if (classType === '공병') {
    for(let r=0; r<=2; r++) {
      for(let c=0; c<10; c++) {
        if(grid[r][c] === 1) grid[r][c] = 9;
      }
    }
    grid[6][1] = 8; grid[7][2] = 8; grid[8][3] = 8; grid[9][4] = 8;
  } else if (classType === '포병') {
    grid[3][1] = 10; grid[4][1] = 10; grid[5][1] = 10;
    grid[3][8] = 10; grid[4][8] = 10; grid[5][8] = 10;
    grid[6][8] = 3; grid[7][8] = 3; grid[8][8] = 3; grid[9][8] = 3;
    grid[6][9] = 3; grid[7][9] = 3; grid[8][9] = 3; grid[9][9] = 3;
  }

  return (
    <View style={[styles.pixelGrid, styles.shadowHeavy, { shadowColor: themeColor }]}>
      {grid.map((row: number[], rIdx: number) => (
        <View key={`row-${rIdx}`} style={styles.pixelRow}>
          {row.map((cell: number, cIdx: number) => (
            <View 
              key={`cell-${rIdx}-${cIdx}`} 
              style={[
                styles.pixelCell, 
                { backgroundColor: PALETTE[cell as keyof typeof PALETTE] }
              ]} 
            />
          ))}
        </View>
      ))}
    </View>
  );
};

export const MyPageScreen: React.FC<Props> = ({ navigation: _navigation }) => {
  const profile = useStore(state => state.profile);
  const inventory = useStore(state => state.inventory);
  const equippedTitleId = useStore(state => state.equippedTitleId);
  const equipTitle = useStore(state => state.equipTitle);
  const isAdminMode = useStore(state => state.isAdminMode);
  const toggleAdminMode = useStore(state => state.toggleAdminMode);
  const setBuddyGroupPin = useStore(state => state.setBuddyGroupPin);
  const insets = useSafeAreaInsets();
  
  const [buddyInput, setBuddyInput] = useState('');
  
  const [selectedClass, setSelectedClass] = useState<string>(CLASSES.includes(profile.playerClass) ? profile.playerClass : '포병');

  const activeTitle = MOCK_TITLES.find(t => t.id === equippedTitleId)?.name || '';
  const totalPower = profile.stats.strength + profile.stats.stamina + profile.stats.intelligence + profile.stats.mental + profile.stats.survival;
  const maxStatValue = 100; 

  const getThemeColor = () => {
    switch(selectedClass) {
      case '통신병': return '#00E5FF';
      case '의무병': return '#FF1744';
      case '공병': return '#FFEA00';
      case '포병': return '#D500F9';
      case '취사병': return '#FF9800';
      default: return '#39FF14'; 
    }
  };

  const themeColor = getThemeColor();

  const logout = useStore(state => state.logout);

  return (
    <View style={styles.container}>
      <Header title="내 관물대" showBackButton={false} />
      <ScrollView contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + 40 }]}>
        
        {/* Avatar & Combat Power Card */}
        <View style={styles.topCardContainer}>
          <View style={[styles.cornerTL, { borderColor: themeColor }]} />
          <View style={[styles.cornerBR, { borderColor: themeColor }]} />
          
          <View style={[styles.avatarCard, { borderColor: themeColor }]}>
            
            <View style={[styles.titleBadge, { borderColor: themeColor }]}>
              <Text style={[styles.titleBadgeText, { color: themeColor }]}>▣ 칭호: {activeTitle}</Text>
            </View>
            
            <View style={[styles.avatarBorder, { borderColor: themeColor, shadowColor: themeColor }]}>
              <PixelAvatar classType={selectedClass} themeColor={themeColor} />
            </View>

            <Text style={[styles.asciiLabel, { color: themeColor }]}>{getAsciiLabel(selectedClass)}</Text>
            
            <Text style={styles.nameText}>{profile.nickname} {profile.rank}</Text>
            <View style={[styles.uidBadge, { borderColor: themeColor }]}>
              <Text style={[styles.uidText, { color: themeColor }]}>고유 ID: {profile.userId}</Text>
            </View>
            <Text style={[styles.classText, { color: themeColor, textShadowColor: themeColor }]}>{`< ${selectedClass} >`}</Text>

            <View style={styles.powerContainer}>
              <Text style={styles.powerLabel}>종합 능력치</Text>
              <Text style={styles.powerValue}>{totalPower}</Text>
            </View>

          </View>
        </View>



        {/* Class Assignment */}
        <Text style={styles.sectionTitle}>{"// 보직 선택"}</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.chipScroll}>
          {CLASSES.map((cls) => {
            const isActive = selectedClass === cls;
            return (
              <TouchableOpacity
                key={cls}
                style={[
                  styles.classChip, 
                  isActive && styles.activeClassChip,
                  isActive && { backgroundColor: themeColor, shadowColor: themeColor }
                ]}
                onPress={() => setSelectedClass(cls)}
              >
                <Text style={[
                  styles.classChipText, 
                  isActive && styles.activeClassChipText
                ]}>
                  {cls}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        {/* Buddy Group Section */}
        <Text style={styles.sectionTitle}>{"// 전우조 결속"}</Text>
        <View style={styles.buddyCard}>
          {profile.buddyGroupPin ? (
            <View style={styles.buddyInfo}>
              <Text style={styles.buddyTitle}>현재 소속된 전우조 PIN</Text>
              <Text style={styles.buddyPinText}>{profile.buddyGroupPin}</Text>
              <Text style={styles.buddyDesc}>전우와 퀘스트를 상호 인증할 수 있습니다.</Text>
            </View>
          ) : (
            <View style={styles.buddyInputContainer}>
              <Text style={styles.buddyInputTitle}>전우조 PIN 등록</Text>
              <Text style={styles.buddyInputDesc}>동기와 동일한 4자리 숫자를 입력해 결속하세요.</Text>
              <View style={styles.buddyInputRow}>
                <TextInput 
                  style={styles.buddyInput}
                  placeholder="예: 0220"
                  placeholderTextColor="#666"
                  maxLength={4}
                  keyboardType="numeric"
                  value={buddyInput}
                  onChangeText={setBuddyInput}
                />
                <TouchableOpacity 
                  style={styles.buddySubmitBtn}
                  onPress={() => {
                    if(buddyInput.length === 4) {
                      setBuddyGroupPin(buddyInput);
                      Alert.alert('결속 완료', `전우조 PIN [${buddyInput}]에 연결되었습니다.`);
                    } else {
                      Alert.alert('오류', '4자리 숫자를 입력해주세요.');
                    }
                  }}
                >
                  <Text style={styles.buddySubmitText}>결속하기</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        </View>

        {/* Title Deployment */}
        <Text style={styles.sectionTitle}>{"// 칭호 장착"}</Text>
        <View style={styles.titlesGrid}>
          {MOCK_TITLES.map((title) => {
            const isEquipped = equippedTitleId === title.id;
            const isUnlocked = inventory.unlockedTitles.includes(title.id);
            return (
              <TouchableOpacity
                key={title.id}
                style={[
                  styles.titleChip,
                  isEquipped && styles.equippedTitleChip,
                  !isUnlocked && styles.lockedTitleChip
                ]}
                disabled={!isUnlocked}
                onPress={() => equipTitle(title.id)}
              >
                <Text style={[
                  styles.titleChipText,
                  isEquipped && styles.equippedTitleChipText,
                  !isUnlocked && styles.lockedTitleChipText
                ]}>
                  {title.name}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* 5 Stats Analysis */}
        <Text style={styles.sectionTitle}>{"// 능력치 분석"}</Text>
        <View style={styles.statsCard}>
          <StatBar label="근력" value={profile.stats.strength} max={maxStatValue} color="#FF5252" />
          <StatBar label="체력" value={profile.stats.stamina} max={maxStatValue} color="#FF9800" />
          <StatBar label="지력" value={profile.stats.intelligence} max={maxStatValue} color="#00B0FF" />
          <StatBar label="정신력" value={profile.stats.mental} max={maxStatValue} color="#D500F9" />
          <StatBar label="생존술" value={profile.stats.survival} max={maxStatValue} color="#4CAF50" />
        </View>


        {/* Logout Button */}
        <TouchableOpacity style={styles.logoutButton} onPress={() => logout()}>
          <Text style={styles.logoutButtonText}>로그아웃 (전역하기)</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

const StatBar = ({ label, value, max, color }: { label: string, value: number, max: number, color: string }) => {
  const percentage = Math.min((value / max) * 100, 100);
  return (
    <View style={styles.statRow}>
      <Text style={styles.statLabel}>{label}</Text>
      <View style={styles.barTrack}>
        <View style={[styles.barFill, styles.shadowMedium, { width: `${percentage}%`, backgroundColor: color, shadowColor: color }]} />
      </View>
      <Text style={[styles.statValue, styles.textShadow, { color, textShadowColor: color }]}>{value}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0A0A0A' }, 
  content: { padding: 16, paddingBottom: 40 },
  
  topCardContainer: {
    position: 'relative',
    marginBottom: 20,
    marginTop: 20,
  },
  cornerTL: {
    position: 'absolute', top: 0, left: 0, width: 20, height: 20,
    borderTopWidth: 4, borderLeftWidth: 4, zIndex: 10,
  },
  cornerBR: {
    position: 'absolute', bottom: 0, right: 0, width: 20, height: 20,
    borderBottomWidth: 4, borderRightWidth: 4, zIndex: 10,
  },
  avatarCard: { 
    alignItems: 'center', 
    backgroundColor: '#111111', 
    padding: 24, 
    borderWidth: 1,
  },
  
  titleBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderWidth: 1,
    marginBottom: 24,
  },
  titleBadgeText: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  
  pixelGrid: { flexDirection: 'column' },
  pixelRow: { flexDirection: 'row' },
  pixelCell: { width: 10, height: 10 }, 

  avatarBorder: { 
    padding: 12,
    borderWidth: 1, 
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
    backgroundColor: '#1A1A1A',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 15,
    elevation: 10,
  },

  asciiLabel: {
    fontSize: 12,
    fontWeight: '900',
    marginBottom: 16,
    letterSpacing: 1,
  },

  nameText: { color: '#FFFFFF', fontSize: 24, fontWeight: 'bold', marginBottom: 8 },
  classText: { fontSize: 16, fontWeight: '900', marginBottom: 16, textShadowOffset: { width: 0, height: 0 }, textShadowRadius: 10 },

  powerContainer: {
    alignItems: 'center',
    marginTop: 16,
    paddingVertical: 12,
    paddingHorizontal: 40,
    borderWidth: 1,
    borderColor: '#332b00', 
    width: '100%',
    backgroundColor: '#0a0a00'
  },
  powerLabel: { color: '#888', fontSize: 12, fontWeight: 'bold', marginBottom: 4 },
  powerValue: { color: '#FFEA00', fontSize: 56, fontWeight: '900', fontStyle: 'italic', textShadowColor: '#FFEA00', textShadowOffset: { width: 0, height: 0 }, textShadowRadius: 2 },

  sectionTitle: { color: '#666', fontSize: 14, fontStyle: 'italic', fontWeight: 'bold', marginBottom: 16 },
  
  chipScroll: { marginBottom: 20, paddingBottom: 8 },
  classChip: { 
    paddingVertical: 12, 
    paddingHorizontal: 24, 
    backgroundColor: '#111', 
    marginRight: 12, 
    borderWidth: 1,
    borderColor: '#333',
    borderLeftWidth: 4, 
    borderLeftColor: '#333',
  },
  classChipText: { color: '#666', fontWeight: 'bold', fontSize: 14 },

  titlesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 20,
  },
  titleChip: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    backgroundColor: '#111',
    borderWidth: 1,
    borderColor: '#222',
  },
  equippedTitleChip: {
    borderColor: '#FFEA00',
    shadowColor: '#FFEA00',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.6,
    shadowRadius: 10,
    elevation: 5
  },
  lockedTitleChip: {
    opacity: 0.3,
  },
  titleChipText: {
    color: '#666',
    fontWeight: 'bold',
    fontSize: 14,
  },
  equippedTitleChipText: {
    color: '#FFEA00',
    fontWeight: '900',
  },
  lockedTitleChipText: {
    color: '#444',
  },

  statsCard: {
    backgroundColor: '#111',
    padding: 24,
    borderRadius: 8,
    marginBottom: 20,
  },
  statRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  statLabel: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: 'bold',
    width: 50, 
  },
  barTrack: {
    flex: 1,
    height: 16,
    backgroundColor: '#000',
    marginRight: 16,
    borderWidth: 1,
    borderColor: '#222',
  },
  barFill: {
    height: '100%',
  },
  statValue: {
    fontSize: 16,
    fontWeight: '900',
    fontStyle: 'italic',
    width: 30,
    textAlign: 'right',
  },

  logoutButton: {
    marginTop: 30,
    marginBottom: 40,
    backgroundColor: '#333',
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  logoutButtonText: {
    color: '#FF6B6B',
    fontSize: 16,
    fontWeight: 'bold',
  },
  shadowHeavy: {
    shadowOffset: {width:0, height:0}, shadowOpacity: 0.8, shadowRadius: 15
  },
  shadowMedium: {
    shadowOffset: {width:0, height:0}, shadowOpacity: 0.8, shadowRadius: 5, elevation: 5
  },
  activeClassChip: {
    shadowOffset: {width:0, height:0}, shadowOpacity: 0.8, shadowRadius: 10, elevation: 5
  },
  activeClassChipText: {
    color: '#000', fontWeight: '900'
  },
  textShadow: {
    textShadowOffset: { width:0, height:0 }, textShadowRadius: 10
  },
  uidBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderWidth: 1,
    borderRadius: 4,
    marginBottom: 8,
    backgroundColor: '#0a0a00'
  },
  uidText: {
    fontSize: 12,
    fontWeight: 'bold'
  },
  buddyCard: {
    backgroundColor: '#111',
    padding: 20,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#333',
    marginBottom: 20,
  },
  buddyInfo: {
    alignItems: 'center',
  },
  buddyTitle: {
    color: '#888',
    fontSize: 14,
    marginBottom: 8,
  },
  buddyPinText: {
    color: '#FFEA00',
    fontSize: 32,
    fontWeight: '900',
    letterSpacing: 4,
    marginBottom: 8,
  },
  buddyDesc: {
    color: '#666',
    fontSize: 12,
  },
  buddyInputContainer: {
    
  },
  buddyInputTitle: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  buddyInputDesc: {
    color: '#888',
    fontSize: 12,
    marginBottom: 12,
  },
  buddyInputRow: {
    flexDirection: 'row',
  },
  buddyInput: {
    flex: 1,
    backgroundColor: '#000',
    borderWidth: 1,
    borderColor: '#333',
    color: '#FFF',
    fontSize: 18,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 4,
    marginRight: 12,
    letterSpacing: 2,
    textAlign: 'center',
  },
  buddySubmitBtn: {
    backgroundColor: '#39FF14',
    paddingHorizontal: 20,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 4,
  },
  buddySubmitText: {
    color: '#000',
    fontWeight: 'bold',
    fontSize: 16,
  }
});
