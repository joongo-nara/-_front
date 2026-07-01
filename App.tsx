import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Text } from 'react-native';

import { MainScreen } from './src/screens/Main';
import { QuestBoardScreen } from './src/screens/QuestBoard';
import { BarracksScreen } from './src/screens/Barracks';
import { MyPageScreen } from './src/screens/MyPage';
import { CommsScreen } from './src/screens/Comms';
import { SplashScreen } from './src/screens/Splash';
import { OnboardingScreen } from './src/screens/Onboarding';
import { LoginScreen } from './src/screens/Login';
import { SignupScreen } from './src/screens/Signup';
import { useStore } from './src/store/useStore';

export type TabParamList = {
  MainTab: undefined;
  BarracksTab: undefined;
  CommsTab: undefined;
  MyPageTab: undefined;
};

export type AuthStackParamList = {
  Splash: undefined;
  Onboarding: undefined;
  Login: undefined;
  Signup: undefined;
};

export type RootStackParamList = {
  Tabs: undefined;
  QuestBoard: undefined;
};

const Tab = createBottomTabNavigator<TabParamList>();
const Stack = createNativeStackNavigator<RootStackParamList>();
const AuthStack = createNativeStackNavigator<AuthStackParamList>();

const MainIcon = ({ color }: { color: string }) => <Text style={[styles.tabIcon, { color }]}>⛺</Text>;
const CommsIcon = ({ color }: { color: string }) => <Text style={[styles.tabIcon, { color }]}>📡</Text>;
const BarracksIcon = ({ color }: { color: string }) => <Text style={[styles.tabIcon, { color }]}>🏆</Text>;
const MyPageIcon = ({ color }: { color: string }) => <Text style={[styles.tabIcon, { color }]}>👤</Text>;

function TabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: '#121212',
          borderTopWidth: 1,
          borderTopColor: '#2C2C2C',
        },
        tabBarActiveTintColor: '#FFD700',
        tabBarInactiveTintColor: '#666',
      }}
    >
      <Tab.Screen
        name="MainTab"
        component={MainScreen as any}
        options={{
          tabBarLabel: '홈',
          tabBarIcon: MainIcon
        }}
      />
      <Tab.Screen
        name="CommsTab"
        component={CommsScreen as any}
        options={{
          tabBarLabel: '커뮤니티',
          tabBarIcon: CommsIcon
        }}
      />
      <Tab.Screen
        name="BarracksTab"
        component={BarracksScreen as any}
        options={{
          tabBarLabel: '랭킹',
          tabBarIcon: BarracksIcon
        }}
      />
      <Tab.Screen
        name="MyPageTab"
        component={MyPageScreen as any}
        options={{
          tabBarLabel: '마이페이지',
          tabBarIcon: MyPageIcon
        }}
      />
    </Tab.Navigator>
  );
}

import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StyleSheet } from 'react-native';

export default function App() {
  const isAuthenticated = useStore(state => state.isAuthenticated);

  return (
    <SafeAreaProvider>
      <NavigationContainer>
        {!isAuthenticated ? (
          <AuthStack.Navigator screenOptions={{ headerShown: false }} initialRouteName="Splash">
            <AuthStack.Screen name="Splash" component={SplashScreen as any} />
            <AuthStack.Screen name="Onboarding" component={OnboardingScreen as any} />
            <AuthStack.Screen name="Login" component={LoginScreen as any} />
            <AuthStack.Screen name="Signup" component={SignupScreen as any} />
          </AuthStack.Navigator>
        ) : (
          <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name="Tabs" component={TabNavigator} />
            <Stack.Screen name="QuestBoard" component={QuestBoardScreen as any} />
          </Stack.Navigator>
        )}
      </NavigationContainer>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  tabIcon: {
    fontSize: 20,
  },
});
