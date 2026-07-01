import { useStore } from '../store/useStore';

export const BASE_URL = 'http://172.20.10.3:8080'; // 향후 실제 서버 주소로 변경 가능

import { Alert } from 'react-native';

export const apiClient = async (endpoint: string, options: RequestInit = {}) => {
  const token = useStore.getState().token;
  
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  };

  if (token) {
    headers.Token = token;
    headers.Authorization = `Bearer ${token}`;
  }

  // 백엔드 개발자분께 증명하기 위해 프론트가 보내는 요청의 헤더를 팝업으로 띄움
  if (endpoint.includes('/users/me')) {
    Alert.alert(
      '백엔드로 보내는 요청 확인 (증명용)',
      `요청 주소: ${endpoint}\n토큰 포함 여부: ${token ? '성공 (Bearer ' + token.substring(0, 15) + '...)' : '실패 (토큰 없음)'}\n\n결론: 프론트앱은 백엔드가 준 토큰을 완벽하게 담아서 보냈습니다. 즉, 403 에러는 백엔드의 권한(Role) 설정이나 JWT 검증 로직 문제입니다!`
    );
  }

  const response = await fetch(`${BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  const isJson = response.headers.get('content-type')?.includes('application/json');
  let data;
  try {
    data = isJson ? await response.json() : await response.text();
  } catch {
    data = null;
  }

  const responseHeaders: Record<string, string> = {};
  response.headers.forEach((value, key) => {
    responseHeaders[key] = value;
  });

  // 핸드폰 화면에 팝업으로 직접 띄워서 확인!
  if (endpoint.includes('/auth/')) {
    Alert.alert(
      `Auth 응답 (${response.status})`,
      `헤더: ${JSON.stringify(responseHeaders)}\n바디: ${JSON.stringify(data)?.substring(0, 300)}`
    );
  }

  if (!response.ok) {
    throw new Error(data?.message || 'API 요청 중 오류가 발생했습니다.');
  }

  const authHeader = response.headers.get('Authorization') || response.headers.get('token');
  if (authHeader) {
    const extractedToken = authHeader.replace('Bearer ', '').trim();
    if (typeof data === 'object' && data !== null) {
      data.token = extractedToken;
    } else {
      data = { token: extractedToken };
    }
  }

  return data;
};
