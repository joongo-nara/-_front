with open('admin-web/src/App.tsx', 'r') as f:
    content = f.read()

# 1. Translate Mock Data & Texts
content = content.replace("'Mon'", "'월'").replace("'Tue'", "'화'").replace("'Wed'", "'수'")
content = content.replace("'Thu'", "'목'").replace("'Fri'", "'금'").replace("'Sat'", "'토'").replace("'Sun'", "'일'")

content = content.replace("active: 400", "접속자: 400").replace("quests: 240", "완료퀘스트: 240")
content = content.replace("active: 300", "접속자: 300").replace("quests: 139", "완료퀘스트: 139")
content = content.replace("active: 200", "접속자: 200").replace("quests: 980", "완료퀘스트: 980")
content = content.replace("active: 278", "접속자: 278").replace("quests: 390", "완료퀘스트: 390")
content = content.replace("active: 189", "접속자: 189").replace("quests: 480", "완료퀘스트: 480")
content = content.replace("active: 239", "접속자: 239").replace("quests: 380", "완료퀘스트: 380")
content = content.replace("active: 349", "접속자: 349").replace("quests: 430", "완료퀘스트: 430")

content = content.replace('dataKey="active"', 'dataKey="접속자"').replace('dataKey="quests"', 'dataKey="완료퀘스트"')

content = content.replace("status: 'active' | 'inactive'", "status: '정상' | '휴면'")
content = content.replace("status: 'active'", "status: '정상'")
content = content.replace("status: 'inactive'", "status: '휴면'")
content = content.replace("user.status === 'active'", "user.status === '정상'")
# Keep className="badge active/inactive" intact
# user.status === '정상' ? 'active' : 'inactive' (This string is generated in the badge class)

# lastActive
content = content.replace("'2 mins ago'", "'2분 전'")
content = content.replace("'1 day ago'", "'1일 전'")
content = content.replace("'15 mins ago'", "'15분 전'")
content = content.replace("'1 hour ago'", "'1시간 전'")
content = content.replace("'3 days ago'", "'3일 전'")
content = content.replace("'5 mins ago'", "'5분 전'")
content = content.replace("'2 hours ago'", "'2시간 전'")
content = content.replace("'10 mins ago'", "'10분 전'")
content = content.replace("'30 mins ago'", "'30분 전'")
content = content.replace("'1 min ago'", "'1분 전'")
content = content.replace("'5 days ago'", "'5일 전'")
content = content.replace("'45 mins ago'", "'45분 전'")
content = content.replace("'12 mins ago'", "'12분 전'")

# Trend text
content = content.replace("this month", "이번 달")
content = content.replace("vs yesterday", "어제 대비")
content = content.replace("this week", "이번 주")
content = content.replace("vs last month", "지난 달 대비")

# 2. Extract Inline Styles
styles_def = """
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
"""

content = content.replace('export default function App() {', styles_def)

# Replace the style tags
content = content.replace("style={{ width: 28, height: 28, objectFit: 'contain' }}", "style={S.logoImage}")
content = content.replace("style={{ margin: '0 16px' }}", "style={S.bellIcon}")
content = content.replace("style={{ cursor: 'pointer', marginLeft: '12px' }}", "style={S.logoutIcon}")
content = content.replace("style={{ height: 300, marginTop: 20 }}", "style={S.chartContainer}")
content = content.replace("contentStyle={{ backgroundColor: '#16181d', borderColor: '#272a31', color: '#fff' }}", "contentStyle={S.tooltipContent}")
content = content.replace("itemStyle={{ color: '#fff' }}", "itemStyle={S.tooltipItem}")
content = content.replace("style={{ flex: 1 }}", "style={S.flex1}")
content = content.replace("style={{ margin: 0 }}", "style={S.margin0}")
content = content.replace("style={{ fontSize: 13, color: '#9ea3b0', marginTop: 4 }}", "style={S.subText}")
content = content.replace("style={{ width: 200 }}", "style={S.width200}")
content = content.replace("style={{ width: 120 }}", "style={S.width120}")
content = content.replace("style={{ textAlign: 'right' }}", "style={S.textRight}")
content = content.replace("style={{ textAlign: 'center', color: '#9ea3b0' }}", "style={S.textCenterMuted}")
content = content.replace("style={{ fontWeight: 600, color: '#f0f2f5' }}", "style={S.boldText}")
content = content.replace("style={{ color: '#9ea3b0', fontSize: 12 }}", "style={S.smallMutedText}")
content = content.replace("style={{ color: '#9ea3b0' }}", "style={S.mutedText}")
content = content.replace("style={{ justifyContent: 'flex-end', gap: 4 }}", "style={S.flexEndGap4}")
content = content.replace("style={{ padding: '4px 8px', fontSize: 12 }}", "style={S.badge}")
content = content.replace("style={{ display: 'flex', flexDirection: 'column', gap: 24, flex: 1 }}", "style={S.flexColGap24}")
content = content.replace("style={{ height: 250, marginTop: 10 }}", "style={S.chartSmallContainer}")
content = content.replace("style={{ display: 'flex', justifyContent: 'center', gap: 16, marginTop: -10 }}", "style={S.legendContainer}")
content = content.replace("style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 12, color: '#9ea3b0' }}", "style={S.legendItem}")
content = content.replace("style={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: PIE_COLORS[index] }}", "style={{ ...S.legendDot, backgroundColor: PIE_COLORS[index] }}")
content = content.replace("style={{ color: '#39FF14' }}", "style={S.greenText}")
content = content.replace("style={{ display: 'flex', flexDirection: 'column', gap: 24, maxWidth: 600 }}", "style={S.settingsContainer}")
content = content.replace("style={{ padding: '16px 0', borderBottom: '1px solid #272a31' }}", "style={S.settingsRowBorder}")
content = content.replace("style={{ padding: '16px 0' }}", "style={S.settingsRow}")
content = content.replace("style={{ fontWeight: 600, color: '#f0f2f5', marginBottom: 4 }}", "style={S.settingsTitle}")

with open('admin-web/src/App.tsx', 'w') as f:
    f.write(content)
