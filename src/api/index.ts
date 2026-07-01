import { apiClient } from './client';

export const AuthAPI = {
  register: (data: { username: string; password?: string; nickname: string; rank: string; militaryUnit: string; classType: string }) =>
    apiClient('/api/auth/register', { method: 'POST', body: JSON.stringify(data) }),
  login: (data: { username: string; password?: string }) =>
    apiClient('/api/auth/login', { method: 'POST', body: JSON.stringify(data) }),
};

export const UserAPI = {
  getMe: () => apiClient('/api/users/me', { method: 'GET' }),
  joinBuddyGroup: (connectionPin: string) =>
    apiClient('/api/users/buddy/join', { method: 'POST', body: JSON.stringify({ connectionPin }) }),
  changeTitle: (titleId: number) =>
    apiClient('/api/users/title', { method: 'PUT', body: JSON.stringify({ titleId }) }),
};

export const QuestAPI = {
  getDailyQuests: () => apiClient('/api/quests?type=daily', { method: 'GET' }),
  authWithPin: (id: string, buddyPin: string) =>
    apiClient(`/api/quests/${id}/auth/pin`, { method: 'POST', body: JSON.stringify({ buddyPin }) }),
  authWithText: (id: string, summary: string) =>
    apiClient(`/api/quests/${id}/auth/text`, { method: 'POST', body: JSON.stringify({ summary }) }),
  rerollQuest: (id: string) => apiClient(`/api/quests/${id}/reroll`, { method: 'POST' }),
};

export const PostAPI = {
  getPosts: (page = 1, size = 20) => apiClient(`/api/posts?page=${page}&size=${size}`, { method: 'GET' }),
  createPost: (content: string) =>
    apiClient('/api/posts', { method: 'POST', body: JSON.stringify({ content }) }),
  likePost: (id: string) => apiClient(`/api/posts/${id}/like`, { method: 'POST' }),
  createComment: (id: string, content: string) =>
    apiClient(`/api/posts/${id}/comments`, { method: 'POST', body: JSON.stringify({ content }) }),
};

export const RankingAPI = {
  getRankings: (unit?: string) =>
    apiClient(`/api/rankings${unit ? `?unit=${unit}` : ''}`, { method: 'GET' }),
  pokeUser: (userId: string) => apiClient(`/api/rankings/${userId}/poke`, { method: 'POST' }),
};

export const AdminAPI = {
  getStats: (period = 'weekly') => apiClient(`/api/admin/stats?period=${period}`, { method: 'GET' }),
  getTopQuests: (period = 'weekly') => apiClient(`/api/admin/quests/top?period=${period}`, { method: 'GET' }),
  getInactiveUsers: (days = 3) => apiClient(`/api/admin/users/inactive?days=${days}`, { method: 'GET' }),
  warnUser: (id: string, messageType: string) =>
    apiClient(`/api/admin/users/${id}/warn`, { method: 'POST', body: JSON.stringify({ messageType }) }),
};
