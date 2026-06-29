import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, KeyboardAvoidingView, Platform, Alert, Modal } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { AuthStackParamList } from '../../App';
import { MILITARY_UNITS } from '../store/militaryUnits';
import { useStore } from '../store/useStore';
import { Header } from '../components/Header';
import { Calendar, LocaleConfig } from 'react-native-calendars';

LocaleConfig.locales.kr = {
  monthNames: ['1월','2월','3월','4월','5월','6월','7월','8월','9월','10월','11월','12월'],
  monthNamesShort: ['1월','2월','3월','4월','5월','6월','7월','8월','9월','10월','11월','12월'],
  dayNames: ['일요일','월요일','화요일','수요일','목요일','금요일','토요일'],
  dayNamesShort: ['일','월','화','수','목','금','토'],
  today: '오늘'
};
LocaleConfig.defaultLocale = 'kr';

type Props = NativeStackScreenProps<AuthStackParamList, 'Signup'>;

const BRANCHES = ['육군', '해군', '공군', '해병대'];
const RANKS = ['이병', '일병', '상병', '병장'];
const CLASSES = ['보병', '포병', '기갑', '통신병', '운전병', '의무병', '공병'];

// 스타일을 컴포넌트 위에 정의해 변수 사용 전 선언 오류 방지
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
  },
  content: {
    padding: 20,
    paddingBottom: 50,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFD700',
    marginBottom: 8,
    marginTop: 10,
  },
  subtitle: {
    fontSize: 14,
    color: '#888',
    marginBottom: 30,
  },
  section: { marginBottom: 25 },
  label: {
    color: '#E0E0E0',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  input: {
    backgroundColor: '#1E1E1E',
    borderWidth: 1,
    borderColor: '#333',
    borderRadius: 8,
    padding: 15,
    color: '#FFF',
    fontSize: 16,
  },
  cascadingContainer: {
    backgroundColor: '#1A1A1A',
    borderRadius: 12,
    padding: 15,
    borderWidth: 1,
    borderColor: '#333',
  },
  scrollSelection: { flexDirection: 'row', marginBottom: 12 },
  chip: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 20,
    backgroundColor: '#252525',
    borderWidth: 1,
    borderColor: '#444',
    marginRight: 10,
  },
  chipSelected: { backgroundColor: '#FFD700', borderColor: '#FFD700' },
  chipText: { color: '#888', fontSize: 14, fontWeight: 'bold' },
  chipTextSelected: { color: '#121212' },
  selectedUnitBox: { marginTop: 10, padding: 12, backgroundColor: '#2A2A2A', borderRadius: 8, alignItems: 'center' },
  selectedUnitText: { color: '#4CAF50', fontSize: 15, fontWeight: 'bold' },
  datePickerBtn: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  datePickerText: { color: '#FFF', fontSize: 16 },
  calendarIcon: { marginLeft: 8 },
  dDayBox: { marginTop: 8 },
  dDayLabel: { color: '#E0E0E0', fontSize: 14 },
  dDayValue: { color: '#FFD700', fontSize: 16, fontWeight: 'bold' },
  submitButton: { backgroundColor: '#4CAF50', padding: 15, borderRadius: 8, alignItems: 'center', marginTop: 20 },
  submitButtonText: { color: '#121212', fontSize: 16, fontWeight: 'bold' },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.7)', justifyContent: 'center', alignItems: 'center' },
  calendarContainer: { backgroundColor: '#1E1E1E', borderRadius: 12, padding: 20 },
  closeModalBtn: { marginTop: 10 },
  closeModalText: { color: '#FFF', fontSize: 16 },
  // 추가 아이콘 컨테이너 스타일
  rightContainer: { flexDirection: 'row', justifyContent: 'flex-end', marginTop: 8 },
  iconButton: { padding: 8 },
  iconText: { fontSize: 20, color: '#FFF' },
  keyboard: { flex: 1 },
});

export const SignupScreen: React.FC<Props> = ({ navigation: _ }) => {
  const [nickname, setNickname] = useState('');
  const [branch, setBranch] = useState(BRANCHES[0]);
  const [rank, setRank] = useState(RANKS[0]);
  const [playerClass, setPlayerClass] = useState(CLASSES[0]);

  // 3단계 소속 상태 관리
  const [level1, setLevel1] = useState(Object.keys(MILITARY_UNITS)[0]);
  const [level2, setLevel2] = useState(Object.keys(MILITARY_UNITS[Object.keys(MILITARY_UNITS)[0]])[0]);
  const [level3, setLevel3] = useState(
    MILITARY_UNITS[Object.keys(MILITARY_UNITS)[0]][Object.keys(MILITARY_UNITS[Object.keys(MILITARY_UNITS)[0]])[0]][0]
  );

  const todayStr = '2026-06-29'; // 데모용 고정 날짜
  const [enlistDate, setEnlistDate] = useState(todayStr);
  const [calculatedDDay, setCalculatedDDay] = useState(500);
  const [showCalendar, setShowCalendar] = useState(false);

  const signup = useStore(state => state.signup);

  // 복무기간 자동 계산기
  const calculateDischarge = (dateString: string, currentBranch: string) => {
    try {
      const enlist = new Date(dateString);
      if (isNaN(enlist.getTime())) return;
      let monthsToAdd = 18; // 육군, 해병대 기본
      if (currentBranch === '해군') monthsToAdd = 20;
      if (currentBranch === '공군') monthsToAdd = 21;
      const discharge = new Date(enlist);
      discharge.setMonth(discharge.getMonth() + monthsToAdd);
      discharge.setDate(discharge.getDate() - 1);
      const today = new Date();
      const diffDays = Math.ceil((discharge.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
      setCalculatedDDay(diffDays > 0 ? diffDays : 0);
    } catch {}
  };

  React.useEffect(() => {
    calculateDischarge(enlistDate, branch);
  }, [enlistDate, branch]);

  const handleSignup = () => {
    if (nickname.trim() === '') {
      Alert.alert('알림', '닉네임을 입력해주세요.');
      return;
    }
    const fullCompany = `${level1} ${level2} ${level3}`;
    const generatedUserId = Math.floor(1000 + Math.random() * 9000).toString();
    
    signup({
      userId: generatedUserId,
      nickname,
      rank,
      company: fullCompany,
      playerClass,
      dDay: calculatedDDay,
      level: 1,
      currentXP: 0,
      maxXP: 100,
    });
  };

  const renderSelection = (label: string, options: string[], selected: string, setter: (v: string) => void) => (
    <View style={styles.section}>
      <Text style={styles.label}>{label}</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.scrollSelection}>
        {options.map(opt => (
          <TouchableOpacity key={opt} style={[styles.chip, selected === opt && styles.chipSelected]} onPress={() => setter(opt)}>
            <Text style={[styles.chipText, selected === opt && styles.chipTextSelected]}>{opt}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );

  return (
    <View style={styles.container}>
      <Header title="회원가입" showBackButton={true} />
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={styles.keyboard}>
        <ScrollView contentContainerStyle={styles.content}>
          <Text style={styles.title}>회원가입</Text>
          <Text style={styles.subtitle}>복무성장 RPG에서 사용할 프로필을 설정합니다.</Text>

          {/* 닉네임 */}
          <View style={styles.section}>
            <Text style={styles.label}>닉네임</Text>
            <TextInput
              style={styles.input}
              placeholder="사용할 닉네임을 입력하세요"
              placeholderTextColor="#666"
              value={nickname}
              onChangeText={setNickname}
              maxLength={10}
            />
          </View>

          {renderSelection('군종', BRANCHES, branch, setBranch)}
          {renderSelection('계급', RANKS, rank, setRank)}

          {/* 부대 선택 */}
          <View style={styles.section}>
            <Text style={styles.label}>소속 부대 선택</Text>
            <View style={styles.cascadingContainer}>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.scrollSelection}>
                {Object.keys(MILITARY_UNITS).map(opt => (
                  <TouchableOpacity 
                    key={opt} 
                    style={[styles.chip, level1 === opt && styles.chipSelected]} 
                    onPress={() => {
                      setLevel1(opt);
                      const nextLevel2 = Object.keys(MILITARY_UNITS[opt])[0];
                      setLevel2(nextLevel2);
                      setLevel3(MILITARY_UNITS[opt][nextLevel2][0]);
                    }}
                  >
                    <Text style={[styles.chipText, level1 === opt && styles.chipTextSelected]}>{opt}</Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.scrollSelection}>
                {Object.keys(MILITARY_UNITS[level1] || {}).map(opt => (
                  <TouchableOpacity 
                    key={opt} 
                    style={[styles.chip, level2 === opt && styles.chipSelected]} 
                    onPress={() => {
                      setLevel2(opt);
                      if (MILITARY_UNITS[level1][opt]) {
                        setLevel3(MILITARY_UNITS[level1][opt][0]);
                      }
                    }}
                  >
                    <Text style={[styles.chipText, level2 === opt && styles.chipTextSelected]}>{opt}</Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.scrollSelection}>
                {(MILITARY_UNITS[level1]?.[level2] || []).map((opt: string) => (
                  <TouchableOpacity key={opt} style={[styles.chip, level3 === opt && styles.chipSelected]} onPress={() => setLevel3(opt)}>
                    <Text style={[styles.chipText, level3 === opt && styles.chipTextSelected]}>{opt}</Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
              <View style={styles.selectedUnitBox}>
                <Text style={styles.selectedUnitText}>선택된 소속: {level1} {level2} {level3}</Text>
              </View>
            </View>
          </View>

          {renderSelection('주특기', CLASSES, playerClass, setPlayerClass)}

          {/* 입대일 */}
          <View style={styles.section}>
            <Text style={styles.label}>입대일 (터치하여 달력 열기)</Text>
            <TouchableOpacity style={styles.datePickerBtn} onPress={() => setShowCalendar(true)}>
              <Text style={styles.datePickerText}>{enlistDate}</Text>
              <Text style={styles.calendarIcon}>📅</Text>
            </TouchableOpacity>
            <View style={styles.dDayBox}>
              <Text style={styles.dDayLabel}>예상 전역일까지 남은 시간</Text>
              <Text style={styles.dDayValue}>D - {calculatedDDay}</Text>
            </View>
          </View>

          <TouchableOpacity style={styles.submitButton} onPress={handleSignup}>
            <Text style={styles.submitButtonText}>회원가입 (시작하기)</Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>

      {/* 캘린더 모달 */}
      <Modal visible={showCalendar} transparent={true} animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.rightContainer}>
            <TouchableOpacity onPress={() => {}} style={styles.iconButton}>
              <Text style={styles.iconText}>🏠</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => {}} style={styles.iconButton}>
              <Text style={styles.iconText}>⚙️</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.calendarContainer}>
            <Calendar
              current={enlistDate}
              onDayPress={(day: any) => {
                setEnlistDate(day.dateString);
                setShowCalendar(false);
              }}
              theme={{
                backgroundColor: '#1E1E1E',
                calendarBackground: '#1E1E1E',
                textSectionTitleColor: '#FFD700',
                selectedDayBackgroundColor: '#4CAF50',
                selectedDayTextColor: '#ffffff',
                todayTextColor: '#4CAF50',
                dayTextColor: '#FFF',
                textDisabledColor: '#555',
                monthTextColor: '#FFD700',
                arrowColor: '#FFD700',
              }}
              markedDates={{
                [enlistDate]: { selected: true, selectedColor: '#4CAF50' },
              }}
            />
            <TouchableOpacity style={styles.closeModalBtn} onPress={() => setShowCalendar(false)}>
              <Text style={styles.closeModalText}>닫기</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};
