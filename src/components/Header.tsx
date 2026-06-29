import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface HeaderProps {
  title: string;
  onBack?: () => void;
  showBackButton?: boolean;
}

export const Header: React.FC<HeaderProps> = ({ title, onBack, showBackButton = true }) => {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const canGoBack = navigation.canGoBack();

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else {
      navigation.goBack();
    }
  };

  const showBack = showBackButton && canGoBack;

  return (
    <View style={[styles.container, { marginTop: insets.top, height: 60 }]}>
      {showBack ? (
        <>
          <View style={styles.leftContainer}>
            <TouchableOpacity onPress={handleBack} style={styles.backButton}>
              <Text style={styles.backText}>◀</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.centerContainer} pointerEvents="none">
            <Text style={styles.title}>{title}</Text>
          </View>
          <View style={styles.rightContainer} />
        </>
      ) : (
        <View style={styles.fullCenterContainer}>
          <Text style={styles.title}>{title}</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#121212', // 어두운 차콜/블랙
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(213, 0, 249, 0.4)', // 1px 희미한 보라색 네온 라인
    shadowColor: '#D500F9',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  leftContainer: {
    width: 60,
    alignItems: 'flex-start',
    paddingLeft: 16,
  },
  rightContainer: {
    width: 60,
  },
  centerContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  fullCenterContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  backButton: {
    padding: 8,
    marginLeft: -8,
  },
  backText: {
    color: '#E0E0E0',
    fontSize: 20,
    fontWeight: 'bold',
  },
  title: {
    color: '#E0E0E0',
    fontSize: 18,
    fontWeight: '900',
    letterSpacing: 1.5,
  },
});
