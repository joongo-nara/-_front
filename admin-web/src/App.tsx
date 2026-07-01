import React, { useState } from 'react';
import { 
  Users, Activity, CheckCircle, Shield, 
  Settings, LogOut, Search, Bell, TrendingUp, TrendingDown,
  Plus
} from 'lucide-react';
import { 
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, 
  AreaChart, Area, CartesianGrid, PieChart, Pie, Cell
} from 'recharts';

// --- Types ---
type ToastMessage = { id: string; msg: string; type?: 'success' | 'info' | 'error' };
type User = { id: string; name: string; branch: string; status: '정상' | '휴면'; lastActive: string; level: number; xp: number };
type Quest = { id: string; title: string; reward: string; completions: number; isActive: boolean };

// --- Mock Data ---
const mockActivityData = [
  { name: '월', 접속자: 400, 완료퀘스트: 240 },
  { name: '화', 접속자: 300, 완료퀘스트: 139 },
  { name: '수', 접속자: 200, 완료퀘스트: 380 },
  { name: '목', 접속자: 278, 완료퀘스트: 390 },
  { name: '금', 접속자: 189, 완료퀘스트: 480 },
  { name: '토', 접속자: 239, 완료퀘스트: 980 },
  { name: '일', 접속자: 349, 완료퀘스트: 430 },
];

const mockBranchData = [
  { name: '소총수', count: 120 },
  { name: '통신병', count: 45 },
  { name: '의무병', count: 25 },
  { name: '운전병', count: 50 },
  { name: '취사병', count: 30 },
  { name: '공병', count: 15 },
  { name: '포병', count: 85 },
];

const mockQuestTypeData = [
  { name: '체력 증진', value: 45 },
  { name: '지적 성장', value: 25 },
  { name: '정신 수양', value: 15 },
  { name: '기타 임무', value: 15 },
];
const PIE_COLORS = ['#FF5252', '#00B0FF', '#D500F9', '#39FF14'];

const mockQuestTrend = [
  { day: '월', completions: 240 },
  { day: '화', completions: 139 },
  { day: '수', completions: 380 },
  { day: '목', completions: 390 },
  { day: '금', completions: 480 },
  { day: '토', completions: 980 },
  { day: '일', completions: 430 },
];

const initialUsers: User[] = [
  { id: '9999', name: '말년병장', branch: '운전병', status: '정상', lastActive: '2분 전', level: 42, xp: 9900 },
  { id: '1000', name: '고차원', branch: '소총수', status: '휴면', lastActive: '1일 전', level: 3, xp: 120 },
  { id: '2024', name: '김전사', branch: '포병', status: '휴면', lastActive: '15분 전', level: 15, xp: 2400 },
  { id: '3055', name: '박통신', branch: '통신병', status: '휴면', lastActive: '1시간 전', level: 8, xp: 850 },
  { id: '4001', name: '이의무', branch: '의무병', status: '휴면', lastActive: '3일 전', level: 2, xp: 50 },
  { id: '1023', name: '강철보병', branch: '소총수', status: '휴면', lastActive: '5분 전', level: 22, xp: 4500 },
  { id: '2291', name: '불꽃포병', branch: '포병', status: '휴면', lastActive: '방금 전', level: 18, xp: 3200 },
  { id: '5501', name: '매의눈', branch: '통신병', status: '휴면', lastActive: '2시간 전', level: 28, xp: 6200 },
  { id: '3310', name: '와이파이', branch: '통신병', status: '휴면', lastActive: '10분 전', level: 11, xp: 1500 },
  { id: '4099', name: '힐러김상병', branch: '의무병', status: '휴면', lastActive: '30분 전', level: 25, xp: 5500 },
  { id: '8821', name: '베스트드라이버', branch: '운전병', status: '휴면', lastActive: '1분 전', level: 31, xp: 7100 },
  { id: '1105', name: '신병받아라', branch: '소총수', status: '휴면', lastActive: '5일 전', level: 1, xp: 0 },
  { id: '2933', name: '자주포마스터', branch: '포병', status: '휴면', lastActive: '45분 전', level: 19, xp: 3500 },
  { id: '5002', name: '전차장', branch: '포병', status: '휴면', lastActive: '12분 전', level: 35, xp: 8200 },
  { id: '9012', name: '건축왕', branch: '공병', status: '휴면', lastActive: '2분 전', level: 14, xp: 2100 },
];

const initialQuests: Quest[] = [
  { id: 'q1', title: '연병장 3바퀴 달리기', reward: '체력 +5', completions: 1420, isActive: true },
  { id: 'q2', title: '독서 연등 1시간', reward: '지력 +3', completions: 850, isActive: true },
  { id: 'q3', title: '선임과 커피 한 잔', reward: '정신력 +10', completions: 210, isActive: false },
  { id: 'q4', title: '개인 정비 및 총기 수입', reward: '근력 +2', completions: 3400, isActive: true },
  { id: 'q5', title: '야간 경계 근무 완수', reward: '정신력 +5', completions: 2800, isActive: true },
  { id: 'q6', title: '전투 체육 (축구/농구)', reward: '체력 +10', completions: 1950, isActive: true },
  { id: 'q7', title: '자격증 공부 2시간', reward: '지력 +8', completions: 420, isActive: true },
  { id: 'q8', title: '후임 멘토링 30분', reward: '정신력 +4', completions: 670, isActive: true },
  { id: 'q9', title: '뜀걸음 5km 완주', reward: '체력 +15', completions: 890, isActive: true },
  { id: 'q10', title: '제초 작업 지원', reward: '생존술 +5', completions: 1500, isActive: false },
  { id: 'q11', title: '부모님께 안부 전화', reward: '정신력 +3', completions: 4100, isActive: true },
  { id: 'q12', title: '군장 메고 산악 행군', reward: '체력 +20', completions: 120, isActive: true },
  { id: 'q13', title: '막사 대청소', reward: '근력 +3', completions: 2100, isActive: true },
  { id: 'q14', title: '진지 보수 공사', reward: '근력 +8', completions: 310, isActive: true },
];

// --- Toast Component ---
const ToastContainer = ({ toasts }: { toasts: ToastMessage[] }) => (
  <div className="toast-container">
    {toasts.map(t => (
      <div key={t.id} className="toast">
        <CheckCircle size={18} color="#39FF14" />
        {t.msg}
      </div>
    ))}
  </div>
);


const S = {
  logoImage: { width: 28, height: 28, objectFit: 'contain' as const },
  bellIcon: { margin: '0 16px' },
  logoutIcon: { cursor: 'pointer', marginLeft: '12px' },
  chartContainer: { height: 300, marginTop: 20 },
  tooltipContent: { backgroundColor: '#16181d', borderColor: '#272a31', color: '#fff' },
  tooltipItem: { color: '#fff' },
  flex1: { flex: 1 },
  margin0: { margin: 0 },
  subText: { fontSize: 13, color: '#9ea3b0', marginTop: 4 },
  width200: { width: 200 },
  width120: { width: 120 },
  textRight: { textAlign: 'right' as const },
  textCenterMuted: { textAlign: 'center' as const, color: '#9ea3b0' },
  boldText: { fontWeight: 600, color: '#f0f2f5' },
  smallMutedText: { color: '#9ea3b0', fontSize: 12 },
  mutedText: { color: '#9ea3b0' },
  flexEndGap4: { justifyContent: 'flex-end', gap: 4 },
  badge: { padding: '4px 8px', fontSize: 12 },
  flexColGap24: { display: 'flex', flexDirection: 'column' as const, gap: 24, flex: 1 },
  chartSmallContainer: { height: 250, marginTop: 10 },
  legendContainer: { display: 'flex', justifyContent: 'center', gap: 16, marginTop: -10 },
  legendItem: { display: 'flex', alignItems: 'center', gap: 4, fontSize: 12, color: '#9ea3b0' },
  legendDot: { width: 8, height: 8, borderRadius: '50%' },
  greenText: { color: '#39FF14' },
  settingsContainer: { display: 'flex', flexDirection: 'column' as const, gap: 24, maxWidth: 600 },
  settingsRowBorder: { padding: '16px 0', borderBottom: '1px solid #272a31' },
  settingsRow: { padding: '16px 0' },
  settingsTitle: { fontWeight: 600, color: '#f0f2f5', marginBottom: 4 }
};

export default function App() {

  const [activeTab, setActiveTab] = useState('dashboard');
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  
  const tabTitles: Record<string, string> = {
    dashboard: '대시보드',
    users: '부대원 관리',
    quests: '퀘스트 통계',
    settings: '시스템 설정'
  };
  
  // Users State
  const [search, setSearch] = useState('');
  const [branchFilter, setBranchFilter] = useState('all');
  const [users] = useState(initialUsers);

  // Quests State
  const [quests] = useState(initialQuests);

  // Settings State
  const [settings, setSettings] = useState({ burningTime: false, maintenance: false, disableSignup: false });

  const showToast = (msg: string) => {
    const id = Date.now().toString();
    setToasts(prev => [...prev, { id, msg }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 3000);
  };

  const handleAction = (action: string, userName: string) => {
    showToast(`${userName}님에 대한 [${action}] 요청이 처리되었습니다.`);
  };

  const filteredUsers = users.filter(u => {
    const matchSearch = u.name.includes(search) || u.id.includes(search);
    const matchBranch = branchFilter === 'all' || u.branch.includes(branchFilter);
    return matchSearch && matchBranch;
  });

  return (
    <div className="dashboard-layout">
      {/* Sidebar */}
      <aside className="sidebar">
        <div className="sidebar-brand">
          <img src="/logo.png" alt="Logo" style={S.logoImage} />
          <span>관리자 대시보드</span>
        </div>
        
        <nav style={{ width: '100%' }}>
          <a className={`nav-item ${activeTab === 'dashboard' ? 'active' : ''}`} onClick={() => setActiveTab('dashboard')}>
            <Activity size={20} /> 대시보드
          </a>
          <a className={`nav-item ${activeTab === 'users' ? 'active' : ''}`} onClick={() => setActiveTab('users')}>
            <Users size={20} /> 부대원 관리
          </a>
          <a className={`nav-item ${activeTab === 'quests' ? 'active' : ''}`} onClick={() => setActiveTab('quests')}>
            <CheckCircle size={20} /> 퀘스트 통계
          </a>
          <a className={`nav-item ${activeTab === 'settings' ? 'active' : ''}`} onClick={() => setActiveTab('settings')}>
            <Settings size={20} /> 시스템 설정
          </a>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="main-content">
        <header className="header">
          <div className="header-title">{tabTitles[activeTab]}</div>
          <div className="user-profile">
            <Search size={20} color="#9ea3b0" />
            <Bell size={20} color="#9ea3b0" style={S.bellIcon} />
            <div className="avatar">A</div>
            <LogOut size={20} color="#FF5252" style={S.logoutIcon} />
          </div>
        </header>

        <div className="dashboard-content">
          
          {/* TAB: DASHBOARD */}
          {activeTab === 'dashboard' && (
            <>
              <div className="stats-grid">
                <div className="card">
                  <div className="card-title">총 등록 병력 <Users size={16} /></div>
                  <div className="stat-value">1,284</div>
                  <div className="stat-trend trend-up"><TrendingUp size={14} /> +12% 이번 달</div>
                </div>
                <div className="card">
                  <div className="card-title">오늘의 일일 퀘스트 완수 <CheckCircle size={16} /></div>
                  <div className="stat-value">842</div>
                  <div className="stat-trend trend-up"><TrendingUp size={14} /> +5% 어제 대비</div>
                </div>
                <div className="card">
                  <div className="card-title">활성 전우조 <Shield size={16} /></div>
                  <div className="stat-value">315</div>
                  <div className="stat-trend trend-up"><TrendingUp size={14} /> +2% 이번 주</div>
                </div>
                <div className="card">
                  <div className="card-title">이탈률 <Activity size={16} /></div>
                  <div className="stat-value">1.2%</div>
                  <div className="stat-trend trend-down"><TrendingDown size={14} /> -0.5% 지난 달 대비</div>
                </div>
              </div>

              <div className="charts-grid">
                <div className="card">
                  <div className="card-title">주간 활동 추이</div>
                  <div style={S.chartContainer}>
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={mockActivityData}>
                        <defs>
                          <linearGradient id="colorActive" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#39FF14" stopOpacity={0.3}/>
                            <stop offset="95%" stopColor="#39FF14" stopOpacity={0}/>
                          </linearGradient>
                          <linearGradient id="colorQuests" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#00B0FF" stopOpacity={0.3}/>
                            <stop offset="95%" stopColor="#00B0FF" stopOpacity={0}/>
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="#272a31" />
                        <XAxis dataKey="name" stroke="#9ea3b0" />
                        <YAxis stroke="#9ea3b0" />
                        <Tooltip contentStyle={S.tooltipContent} itemStyle={S.tooltipItem} />
                        <Area type="monotone" dataKey="접속자" stroke="#39FF14" fillOpacity={1} fill="url(#colorActive)" />
                        <Area type="monotone" dataKey="완료퀘스트" stroke="#00B0FF" fillOpacity={1} fill="url(#colorQuests)" />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                <div className="card">
                  <div className="card-title">보직별 분포</div>
                  <div style={S.chartContainer}>
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={mockBranchData} layout="vertical">
                        <CartesianGrid strokeDasharray="3 3" stroke="#272a31" />
                        <XAxis type="number" stroke="#9ea3b0" />
                        <YAxis dataKey="name" type="category" stroke="#9ea3b0" width={70} />
                        <Tooltip contentStyle={S.tooltipContent} cursor={{fill: '#1e2128'}} />
                        <Bar dataKey="count" fill="#D500F9" radius={[0, 4, 4, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>
            </>
          )}

          {/* TAB: USERS */}
          {activeTab === 'users' && (
            <div className="card" style={S.flex1}>
              <div className="flex-between mb-4">
                <div>
                  <div className="card-title" style={S.margin0}>전체 부대원 명부</div>
                  <div style={S.subText}>
                    부대원들의 활동과 레벨을 모니터링하고, 우수 장병 포상 및 불량 유저 제재를 진행합니다.
                  </div>
                </div>
                <div className="flex-row">
                  <div className="input-group" style={S.width200}>
                    <Search size={16} />
                    <input 
                      type="text" 
                      placeholder="이름/ID 검색..." 
                      value={search} 
                      onChange={e => setSearch(e.target.value)} 
                    />
                  </div>
                  <div className="input-group" style={S.width120}>
                    <select value={branchFilter} onChange={e => setBranchFilter(e.target.value)}>
                      <option value="all">전체 보직</option>
                      <option value="소총수">소총수</option>
                      <option value="통신병">통신병</option>
                      <option value="의무병">의무병</option>
                      <option value="운전병">운전병</option>
                      <option value="취사병">취사병</option>
                      <option value="공병">공병</option>
                      <option value="포병">포병</option>
                    </select>
                  </div>
                </div>
              </div>

              <table className="data-table">
                <thead>
                  <tr>
                    <th>유저 ID</th>
                    <th>닉네임</th>
                    <th>레벨 (XP)</th>
                    <th>보직</th>
                    <th>상태</th>
                    <th>마지막 활동</th>
                    <th style={S.textRight}>관리</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.length === 0 ? (
                    <tr><td colSpan={7} style={S.textCenterMuted}>검색 결과가 없습니다.</td></tr>
                  ) : filteredUsers.map((user) => (
                    <tr key={user.id}>
                      <td>#{user.id}</td>
                      <td style={S.boldText}>{user.name}</td>
                      <td>Lv.{user.level} <span style={S.smallMutedText}>({user.xp} XP)</span></td>
                      <td>{user.branch}</td>
                      <td>
                        <span className={`badge ${user.status === '정상' ? 'active' : 'inactive'}`}>
                          {user.status === '정상' ? '활성' : '비활성'}
                        </span>
                      </td>
                      <td style={S.mutedText}>{user.lastActive}</td>
                      <td style={S.textRight}>
                        <div className="flex-row" style={S.flexEndGap4}>
                          <button className="btn btn-secondary" style={S.badge} onClick={() => handleAction('포상 휴가 지급', user.name)}>포상 휴가</button>
                          <button className="btn btn-danger" style={S.badge} onClick={() => handleAction('계정 정지', user.name)}>계정 정지</button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* TAB: QUESTS */}
          {activeTab === 'quests' && (
            <div style={S.flexColGap24}>
              
              <div className="charts-grid">
                <div className="card">
                  <div className="card-title">요일별 퀘스트 달성 추이</div>
                  <div style={S.chartSmallContainer}>
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={mockQuestTrend}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#272a31" vertical={false} />
                        <XAxis dataKey="day" stroke="#9ea3b0" />
                        <YAxis stroke="#9ea3b0" />
                        <Tooltip contentStyle={S.tooltipContent} cursor={{fill: '#1e2128'}} />
                        <Bar dataKey="completions" fill="#39FF14" radius={[4, 4, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                <div className="card">
                  <div className="card-title">퀘스트 유형별 달성 비율</div>
                  <div style={S.chartSmallContainer}>
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={mockQuestTypeData}
                          cx="50%"
                          cy="50%"
                          innerRadius={60}
                          outerRadius={90}
                          paddingAngle={5}
                          dataKey="value"
                          stroke="none"
                        >
                          {mockQuestTypeData.map((_entry, index) => (
                            <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip contentStyle={S.tooltipContent} />
                      </PieChart>
                    </ResponsiveContainer>
                    <div style={S.legendContainer}>
                      {mockQuestTypeData.map((entry, index) => (
                        <div key={entry.name} style={S.legendItem}>
                          <div style={{ ...S.legendDot, backgroundColor: PIE_COLORS[index] }} />
                          {entry.name}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <div className="card">
                <div className="flex-between mb-4">
                  <div className="card-title" style={S.margin0}>전역 퀘스트 리스트</div>
                  <button className="btn btn-primary" onClick={() => showToast('새로운 퀘스트가 시스템에 등록되었습니다.')}>
                    <Plus size={16} /> 신규 퀘스트 발급
                  </button>
                </div>

              <table className="data-table">
                <thead>
                  <tr>
                    <th>퀘스트 ID</th>
                    <th>퀘스트 명</th>
                    <th>보상</th>
                    <th>달성 횟수</th>
                    <th>상태</th>
                  </tr>
                </thead>
                <tbody>
                  {quests.map((q) => (
                    <tr key={q.id}>
                      <td>{q.id.toUpperCase()}</td>
                      <td style={S.boldText}>{q.title}</td>
                      <td style={S.greenText}>{q.reward}</td>
                      <td>{q.completions.toLocaleString()}회</td>
                      <td>
                        <span className={`badge ${q.isActive ? 'active' : 'inactive'}`}>
                          {q.isActive ? '배포중' : '비활성'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          )}

          {/* TAB: SETTINGS */}
          {activeTab === 'settings' && (
            <div className="card" style={S.flex1}>
              <div className="card-title mb-4">시스템 전역 설정 <Settings size={16} /></div>
              
              <div style={S.settingsContainer}>
                <div className="flex-between" style={S.settingsRowBorder}>
                  <div>
                    <div style={S.settingsTitle}>버닝 타임 이벤트 (경험치 2배)</div>
                    <div style={{ fontSize: 13, color: '#9ea3b0' }}>모든 유저가 획득하는 경험치가 2배로 증가합니다. 주말에 켜는 것을 권장합니다.</div>
                  </div>
                  <label className="switch">
                    <input 
                      type="checkbox" 
                      checked={settings.burningTime} 
                      onChange={(e) => {
                        setSettings(s => ({ ...s, burningTime: e.target.checked }));
                        showToast(e.target.checked ? '버닝 타임이 시작되었습니다!' : '버닝 타임이 종료되었습니다.');
                      }} 
                    />
                    <span className="slider" />
                  </label>
                </div>

                <div className="flex-between" style={S.settingsRowBorder}>
                  <div>
                    <div style={S.settingsTitle}>서버 점검 모드</div>
                    <div style={{ fontSize: 13, color: '#9ea3b0' }}>활성화 시 유저의 앱 접속이 차단되고 점검 안내 페이지가 표시됩니다.</div>
                  </div>
                  <label className="switch">
                    <input 
                      type="checkbox" 
                      checked={settings.maintenance} 
                      onChange={(e) => {
                        setSettings(s => ({ ...s, maintenance: e.target.checked }));
                        showToast(e.target.checked ? '서버가 점검 모드로 전환되었습니다.' : '서버가 정상화되었습니다.');
                      }} 
                    />
                    <span className="slider" />
                  </label>
                </div>

                <div className="flex-between" style={S.settingsRow}>
                  <div>
                    <div style={S.settingsTitle}>신규 회원가입 차단</div>
                    <div style={{ fontSize: 13, color: '#9ea3b0' }}>이벤트 어뷰징을 막기 위해 임시로 신규 가입을 제한합니다.</div>
                  </div>
                  <label className="switch">
                    <input 
                      type="checkbox" 
                      checked={settings.disableSignup} 
                      onChange={(e) => {
                        setSettings(s => ({ ...s, disableSignup: e.target.checked }));
                        showToast(e.target.checked ? '신규 회원가입이 차단되었습니다.' : '신규 회원가입이 활성화되었습니다.');
                      }} 
                    />
                    <span className="slider" />
                  </label>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      <ToastContainer toasts={toasts} />
    </div>
  );
}
