import { create } from 'zustand';

export type QuestType = 'daily' | 'weekly' | 'coop' | 'special';

export interface Quest {
  id: string;
  title: string;
  description: string;
  difficulty: '하' | '중' | '상';
  rewardXP: number;
  isCompleted: boolean;
  type: QuestType;
  isRerolled?: boolean;
  targetStat?: string;
  statIncrease?: number;
}

export interface UserProfile {
  userId: string;
  nickname: string;
  rank: string;
  company: string;
  playerClass: string;
  dDay: number;
  dischargeDate?: string;
  buddyGroupPin?: string;
  level: number;
  currentXP: number;
  maxXP: number;
  stats: {
    strength: number;
    stamina: number;
    intelligence: number;
    mental: number;
    survival: number;
  };
}

export interface Inventory {
  biscuits: number;
  drinks: number;
  unlockedTitles: string[];
}

export interface CommentItem {
  id: string;
  authorRank: string;
  authorNickname: string;
  content: string;
  timestamp: string;
}

export interface CommsPost {
  id: string;
  authorRank: string;
  authorNickname: string;
  authorClass: string;
  content: string;
  likes: number;
  isLikedByMe: boolean;
  commentList?: CommentItem[];
  timestamp: string;
  type?: 'general' | 'quest';
}

interface AppState {
  token: string | null;
  profile: UserProfile;
  quests: Quest[];
  inventory: Inventory;
  commsPosts: CommsPost[];
  equippedTitleId: string;
  isAuthenticated: boolean;
  isLoading: boolean;

  // Auth
  login: (username: string, password?: string) => Promise<void>;
  logout: () => void;
  signup: (userData: any) => Promise<void>;

  // Data Fetching
  fetchMe: () => Promise<void>;
  fetchQuests: () => Promise<void>;
  fetchPosts: () => Promise<void>;

  // Actions
  equipTitle: (titleId: string) => void;
  setBuddyGroupPin: (pin: string) => Promise<void>;
  completeQuest: (questId: string, buddyPin: string) => Promise<void>;
  rerollSingleDailyQuest: (questId: string) => Promise<void>;
  rerollAllQuests: () => void;
  addCommsPost: (content: string, type?: 'general' | 'quest') => Promise<void>;
  toggleLikeCommsPost: (postId: string) => Promise<void>;
  addCommentToPost: (postId: string, content: string) => Promise<void>;
}

const defaultProfile: UserProfile = {
  userId: '1000',
  nickname: '고차원',
  rank: '이병',
  company: '단본부중대',
  playerClass: '보병',
  dDay: 500,
  buddyGroupPin: undefined,
  level: 1,
  currentXP: 0,
  maxXP: 100,
  stats: { strength: 0, stamina: 0, intelligence: 0, mental: 0, survival: 0 },
};

const veteranProfile: UserProfile = {
  userId: '9999',
  nickname: '말년병장',
  rank: '병장',
  company: '1중대',
  playerClass: '운전병',
  dDay: 14,
  buddyGroupPin: '0220',
  level: 42,
  currentXP: 14500,
  maxXP: 20000,
  stats: { strength: 95, stamina: 78, intelligence: 92, mental: 99, survival: 88 },
};

const initialQuests: Quest[] = [
  { id: 'q1', title: '아침 점호 참석', description: '06:30 아침 점호에 늦지 않게 참석하기', difficulty: '하', rewardXP: 15, isCompleted: false, type: 'daily', targetStat: 'mental', statIncrease: 1 },
  { id: 'q2', title: '체력 단련 (뜀걸음)', description: '연병장 3km 뜀걸음 완주', difficulty: '중', rewardXP: 30, isCompleted: false, type: 'daily', targetStat: 'stamina', statIncrease: 2 },
  { id: 'q3', title: '주특기 훈련', description: '오후 주특기 훈련 시간 집중하기', difficulty: '상', rewardXP: 45, isCompleted: false, type: 'daily', targetStat: 'intelligence', statIncrease: 2 },
  { id: 'q4', title: '주간 장비 점검', description: '개인 화기 및 장구류 A급 상태 유지하기', difficulty: '중', rewardXP: 100, isCompleted: false, type: 'weekly', targetStat: 'survival', statIncrease: 3 },
  { id: 'q7', title: '막사 대청소', description: '생활관 및 구역 대청소 실시', difficulty: '하', rewardXP: 80, isCompleted: false, type: 'weekly', targetStat: 'mental', statIncrease: 2 },
  { id: 'q8', title: '정신전력교육', description: '정신전력교육 집중해서 시청하기', difficulty: '중', rewardXP: 100, isCompleted: false, type: 'weekly', targetStat: 'mental', statIncrease: 3 },
  { id: 'q5', title: '전우조 야간 순찰', description: '전우들과 함께 부대 외곽 순찰 돌기', difficulty: '상', rewardXP: 150, isCompleted: false, type: 'coop', targetStat: 'survival', statIncrease: 4 },
  { id: 'q6', title: '대대장님 특별 지시', description: '진지 보수 공사 파견 지원', difficulty: '상', rewardXP: 300, isCompleted: false, type: 'special', targetStat: 'strength', statIncrease: 5 },
];

const initialPosts: CommsPost[] = [
  {
    id: 'p1',
    authorRank: '병장',
    authorNickname: '말년병장',
    authorClass: '보병',
    content: '전역이 답이다...',
    likes: 42,
    isLikedByMe: false,
    timestamp: '1시간 전',
    type: 'general',
    commentList: [
      { id: 'c1', authorRank: '상병', authorNickname: '김전사', content: '공감합니다...', timestamp: '50분 전' },
      { id: 'c2', authorRank: '이병', authorNickname: '신병받아라', content: '전역은 언제쯤 올까요 ㅠㅠ', timestamp: '30분 전' }
    ]
  },
  {
    id: 'p2',
    authorRank: '상병',
    authorNickname: '작업반장',
    authorClass: '공병',
    content: '오늘 예초 작업 너무 힘들었다.',
    likes: 15,
    isLikedByMe: false,
    timestamp: '3시간 전',
    type: 'general',
    commentList: []
  },
];

export const useStore = create<AppState>((set, get) => ({
  token: null,
  profile: defaultProfile,
  inventory: { biscuits: 5, drinks: 2, unlockedTitles: ['신병'] },
  equippedTitleId: '',
  isAuthenticated: false,
  isLoading: false,
  quests: initialQuests,
  commsPosts: initialPosts,

  // --- Auth (Mocked) ---
  login: async (username, password) => {
    set({ isLoading: true });
    // 인위적인 지연 효과
    await new Promise(resolve => setTimeout(resolve, 500));

    if (username.toLowerCase() === 'test' && password === '1234') {
      set({
        profile: veteranProfile,
        inventory: {
          biscuits: 42,
          drinks: 15,
          unlockedTitles: [
            '신병', '강철 신병', '무쇠 전사', '태산의 파괴자',
            '전장의 철인', '끝없는 진격', '두 개의 심장',
            '작전 분석관', '전략 책사', '전장의 제갈량',
            '의지의 군인', '강철 멘탈', '부처님',
            '노련한 척후병', '고독한 늑대', '불사조'
          ]
        },
        equippedTitleId: '태산의 파괴자',
        token: 'mock-veteran-token',
        isAuthenticated: true,
        isLoading: false
      });
    } else {
      set({ token: 'mock-token-1234', isAuthenticated: true, isLoading: false });
    }
  },

  logout: () => set({
    isAuthenticated: false,
    token: null,
    profile: defaultProfile,
    quests: initialQuests,
    commsPosts: initialPosts
  }),

  signup: async (userData) => {
    set({ isLoading: true });
    await new Promise(resolve => setTimeout(resolve, 800));

    // 로컬 상태 프로필 덮어쓰기
    const newProfile = {
      ...defaultProfile,
      nickname: userData.nickname,
      rank: userData.rank,
      company: userData.company,
      playerClass: userData.playerClass,
      dDay: userData.dDay, // 회원가입 시 계산된 D-Day 저장
    };

    set({
      profile: newProfile,
      token: 'mock-token-1234',
      isAuthenticated: true,
      isLoading: false
    });
  },

  // --- Fetching (Mocked) ---
  fetchMe: async () => {
    // 로컬 스토어에 이미 데이터가 있으므로 별도 동작 필요 없음
  },

  fetchQuests: async () => {
    // 만약 퀘스트가 비어있다면 초기 퀘스트 지급
    const currentQuests = get().quests;
    if (currentQuests.length === 0) {
      set({ quests: initialQuests });
    }
  },

  fetchPosts: async () => {
    // 별도 동작 필요 없음 (로컬 상태 사용)
  },

  // --- Actions (Mocked) ---
  equipTitle: (titleId: string) => set({ equippedTitleId: titleId }),

  setBuddyGroupPin: async (pin) => {
    set({ isLoading: true });
    await new Promise(resolve => setTimeout(resolve, 300));
    set((state) => ({ profile: { ...state.profile, buddyGroupPin: pin }, isLoading: false }));
  },

  completeQuest: async (questId, _buddyPin) => {
    set({ isLoading: true });
    await new Promise(resolve => setTimeout(resolve, 4000));

    const state = get();
    const quest = state.quests.find(q => q.id === questId);

    if (quest && !quest.isCompleted) {
      let newXP = state.profile.currentXP + quest.rewardXP;
      let newLevel = state.profile.level;
      let newMaxXP = state.profile.maxXP;
      let newStats = { ...state.profile.stats };

      // 레벨업 로직
      if (newXP >= newMaxXP) {
        newLevel += 1;
        newXP = newXP - newMaxXP;
        newMaxXP = Math.floor(newMaxXP * 1.5);
      }

      let newUnlockedTitles = [...state.inventory.unlockedTitles];
      let newlyUnlocked = '';

      // 스탯 상승 및 칭호 획득 로직
      if (quest.targetStat && quest.statIncrease) {
        newStats = {
          ...newStats,
          [quest.targetStat]: (newStats[quest.targetStat as keyof typeof newStats] || 0) + quest.statIncrease
        };

        const titleMap: Record<string, [number, string][]> = {
          strength: [[70, '태산의 파괴자'], [50, '무쇠 전사'], [30, '강철 신병']],
          stamina: [[70, '두 개의 심장'], [50, '끝없는 진격'], [30, '전장의 철인']],
          intelligence: [[70, '전장의 제갈량'], [50, '전략 책사'], [30, '작전 분석관']],
          mental: [[70, '부처님'], [50, '강철 멘탈'], [30, '의지의 군인']],
          survival: [[70, '불사조'], [50, '고독한 늑대'], [30, '노련한 척후병']]
        };

        const possibleTitles = titleMap[quest.targetStat];
        if (possibleTitles) {
          const statVal = newStats[quest.targetStat as keyof typeof newStats] || 0;
          for (const [threshold, titleName] of possibleTitles) {
            if (statVal >= (threshold as number) && !newUnlockedTitles.includes(titleName as string)) {
              newUnlockedTitles.push(titleName as string);
              newlyUnlocked = titleName as string; // 가장 최근(높은) 달성 칭호 저장
            }
          }
        }
      }

      set({
        quests: state.quests.map((q) => q.id === questId ? { ...q, isCompleted: true } : q),
        profile: {
          ...state.profile,
          currentXP: newXP,
          level: newLevel,
          maxXP: newMaxXP,
          stats: newStats
        },
        inventory: {
          ...state.inventory,
          unlockedTitles: newUnlockedTitles
        },
        isLoading: false
      });

      // 퀘스트 완료 자동 포스트 추가 (스탯 증가 문구 한국어 변환 포함)
      const statMap: Record<string, string> = {
        strength: '근력',
        stamina: '체력',
        intelligence: '지력',
        mental: '정신력',
        survival: '생존술'
      };
      const statName = quest.targetStat ? statMap[quest.targetStat] || quest.targetStat : '';
      const statMsg = quest.targetStat ? ` 및 ${statName} +${quest.statIncrease}` : '';
      const titleMsg = newlyUnlocked ? `\\n🎉 신규 칭호 [${newlyUnlocked}] 획득!` : '';
      get().addCommsPost(`[퀘스트 완료] ${quest.title} 완료! (+${quest.rewardXP}XP${statMsg})${titleMsg}`, 'quest');
    } else {
      set({ isLoading: false });
    }
  },

  rerollAllQuests: () => { },

  rerollSingleDailyQuest: async (questId) => {
    set({ isLoading: true });
    await new Promise(resolve => setTimeout(resolve, 300));

    // 무작위 새 퀘스트 생성 (모의)
    const newQuest: Quest = {
      id: `q_${Date.now()}`,
      title: '새로운 임무 하달',
      description: '부대 환경 미화 작업 지원',
      difficulty: '중',
      rewardXP: 25,
      isCompleted: false,
      type: 'daily',
      isRerolled: true
    };

    set((state) => ({
      quests: state.quests.map(q => q.id === questId ? newQuest : q),
      isLoading: false
    }));
  },

  addCommsPost: async (content, type = 'general') => {
    const state = get();
    const newPost: CommsPost = {
      id: `post_${Date.now()}`,
      authorRank: state.profile.rank,
      authorNickname: state.profile.nickname,
      authorClass: state.profile.playerClass,
      content: content,
      likes: 0,
      isLikedByMe: false,
      timestamp: '방금 전',
      type: type
    };

    set((s) => ({
      commsPosts: [newPost, ...s.commsPosts]
    }));
  },

  toggleLikeCommsPost: async (postId) => {
    set(state => ({
      commsPosts: state.commsPosts.map(post => {
        if (post.id === postId) {
          const isLiked = !post.isLikedByMe;
          return {
            ...post,
            isLikedByMe: isLiked,
            likes: post.likes + (isLiked ? 1 : -1)
          };
        }
        return post;
      })
    }));
  },

  addCommentToPost: async (postId, content) => {
    const { profile } = get();
    const newComment: CommentItem = {
      id: Date.now().toString(),
      authorRank: profile.rank,
      authorNickname: profile.nickname,
      content,
      timestamp: '방금 전',
    };

    set(state => ({
      commsPosts: state.commsPosts.map(post => {
        if (post.id === postId) {
          return {
            ...post,
            commentList: [...(post.commentList || []), newComment]
          };
        }
        return post;
      })
    }));
  },
}));
