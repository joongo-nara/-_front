import { create } from 'zustand';

import { ALL_QUESTS } from './questsData';

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

export interface CommsPost {
  id: string;
  authorRank: string;
  authorNickname: string;
  authorClass: string;
  content: string;
  likes: number;
  isLikedByMe: boolean;
  comments?: number;
  timestamp: string;
  type?: 'general' | 'quest';
}

interface AppState {
  profile: UserProfile;
  quests: Quest[];
  inventory: Inventory;
  commsPosts: CommsPost[];
  isAdminMode: boolean;
  equippedTitleId: string;
  isAuthenticated: boolean;
  equipTitle: (titleId: string) => void;
  login: () => void;
  logout: () => void;
  signup: (userData: Partial<UserProfile>) => void;
  setBuddyGroupPin: (pin: string) => void;
  completeQuest: (questId: string) => void;
  rerollSingleDailyQuest: (questId: string) => void;
  rerollAllQuests: () => void;
  addCommsPost: (content: string, type?: 'general' | 'quest') => void;
  toggleLikeCommsPost: (postId: string) => void;
  toggleAdminMode: () => void;
}

const generateRandomQuests = (): Quest[] => {
  const daily = ALL_QUESTS.filter(q => q.type === 'daily').sort(() => 0.5 - Math.random()).slice(0, 3);
  const weekly = ALL_QUESTS.filter(q => q.type === 'weekly').sort(() => 0.5 - Math.random()).slice(0, 3);
  const coop = ALL_QUESTS.filter(q => q.type === 'coop').sort(() => 0.5 - Math.random()).slice(0, 1);
  const special = ALL_QUESTS.filter(q => q.type === 'special').sort(() => 0.5 - Math.random()).slice(0, 1);
  return [...daily, ...weekly, ...coop, ...special];
};

const initialQuests: Quest[] = generateRandomQuests();

const backupDailyQuests: Quest[] = [
  { id: 'D010', title: '스쿼트 50개', description: '하체 단련을 위한 스쿼트', difficulty: '중', rewardXP: 25, isCompleted: false, type: 'daily' },
  { id: 'D011', title: '플랭크 2분', description: '코어 강화를 위한 플랭크 유지', difficulty: '중', rewardXP: 25, isCompleted: false, type: 'daily' },
  { id: 'D012', title: '군가 3곡 암기', description: '기본 군가 3곡 가사 암기', difficulty: '하', rewardXP: 15, isCompleted: false, type: 'daily' },
  { id: 'D013', title: '관물대 정리', description: '모포와 전투복 각 잡기', difficulty: '하', rewardXP: 15, isCompleted: false, type: 'daily' },
];

const initialCommsPosts: CommsPost[] = [
  {
    id: 'c2',
    authorRank: '일병',
    authorNickname: '정일병',
    authorClass: '소총수',
    content: '[알림] 사격 2급 칭호 획득 완료했습니다!',
    likes: 12,
    isLikedByMe: true,
    timestamp: '1시간 전',
  },
  {
    id: 'c1',
    authorRank: '상병',
    authorNickname: '박상병',
    authorClass: '공병',
    content: '일일 퀘스트 "윗몸일으키기 30개" 퀘스트를 완료했습니다. 👍',
    likes: 5,
    isLikedByMe: false,
    timestamp: '2시간 전',
  }
];

export const useStore = create<AppState>((set) => ({
  profile: {
    userId: '1000',
    nickname: '고차원',
    rank: '일병',
    company: '단본부중대',
    playerClass: '운전병',
    dDay: 427,
    buddyGroupPin: undefined,
    level: 6,
    currentXP: 800,
    maxXP: 1200,
    stats: {
      strength: 20,
      stamina: 25,
      intelligence: 15,
      mental: 30,
      survival: 18,
    },
  },
  inventory: {
    biscuits: 5,
    drinks: 2,
    unlockedTitles: ['t1', 't2', 't3', 't4'],
  },
  equippedTitleId: 't3',
  isAuthenticated: false,
  quests: initialQuests,
  commsPosts: initialCommsPosts,
  isAdminMode: false,
  
  equipTitle: (titleId: string) => set({ equippedTitleId: titleId }),
  
  login: () => set({ isAuthenticated: true }),
  
  logout: () => set({ isAuthenticated: false }),
  
  signup: (userData) => set((state) => ({
    profile: {
      ...state.profile,
      ...userData,
    },
    isAuthenticated: true,
  })),
  
  setBuddyGroupPin: (pin) => set((state) => ({
    profile: {
      ...state.profile,
      buddyGroupPin: pin,
    }
  })),
  
  toggleAdminMode: () => set((state) => ({ isAdminMode: !state.isAdminMode })),
  
  rerollAllQuests: () => set({ quests: generateRandomQuests() }),

  addCommsPost: (content: string, type = 'general') => set((state) => {
    const newPost: CommsPost = {
      id: `c_${Date.now()}`,
      authorRank: state.profile.rank,
      authorNickname: state.profile.nickname,
      authorClass: state.profile.playerClass,
      content,
      likes: 0,
      isLikedByMe: false,
      timestamp: '방금 전',
      type: type as 'general' | 'quest'
    };
    return { commsPosts: [newPost, ...state.commsPosts] };
  }),

  toggleLikeCommsPost: (postId: string) => set((state) => {
    const newPosts = state.commsPosts.map(post => {
      if (post.id === postId) {
        return {
          ...post,
          isLikedByMe: !post.isLikedByMe,
          likes: post.isLikedByMe ? post.likes - 1 : post.likes + 1
        };
      }
      return post;
    });
    return { commsPosts: newPosts };
  }),

  rerollSingleDailyQuest: (questId: string) => set((state) => {
    const questIndex = state.quests.findIndex(q => q.id === questId);
    if (questIndex === -1 || state.quests[questIndex].isRerolled || state.quests[questIndex].isCompleted) {
      return state;
    }
    const randomBackup = backupDailyQuests[Math.floor(Math.random() * backupDailyQuests.length)];
    const newQuest = { ...randomBackup, id: `${randomBackup.id}-${Date.now()}`, isRerolled: true };
    const newQuests = [...state.quests];
    newQuests[questIndex] = newQuest;
    return { quests: newQuests };
  }),
  
  completeQuest: (questId: string) => set((state) => {
    const quest = state.quests.find((q) => q.id === questId);
    if (!quest || quest.isCompleted) return state;

    let newXP = state.profile.currentXP + quest.rewardXP;
    let newLevel = state.profile.level;
    let newMaxXP = state.profile.maxXP;

    while (newXP >= newMaxXP) {
      newXP -= newMaxXP;
      newLevel += 1;
      newMaxXP = Math.floor(newMaxXP * 1.2);
    }

    const statMap: Record<string, keyof UserProfile['stats']> = {
      '근력': 'strength',
      '체력': 'stamina',
      '지능': 'intelligence',
      '정신력': 'mental',
      '생존력': 'survival',
    };
    
    const newStats = { ...state.profile.stats };
    if (quest.targetStat && quest.statIncrease) {
      const statKey = statMap[quest.targetStat] || 'strength';
      newStats[statKey] += quest.statIncrease;
    }

    const newPost: CommsPost = {
      id: `c_${Date.now()}`,
      authorRank: state.profile.rank,
      authorNickname: state.profile.nickname,
      authorClass: state.profile.playerClass,
      content: `[임무 완료] ${quest.title} 작전을 성공적으로 완수했습니다! 보상: ${quest.rewardXP}XP`,
      likes: 0,
      isLikedByMe: false,
      timestamp: '방금 전',
      type: 'quest'
    };

    return {
      quests: state.quests.map((q) =>
        q.id === questId ? { ...q, isCompleted: true } : q
      ),
      profile: {
        ...state.profile,
        level: newLevel,
        currentXP: newXP,
        maxXP: newMaxXP,
        stats: newStats,
      },
      commsPosts: [newPost, ...state.commsPosts],
    };
  }),
}));
