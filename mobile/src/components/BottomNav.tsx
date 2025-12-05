import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation, useRoute } from '@react-navigation/native';

interface Tab {
  name: string;
  label: string;
  icon: string;
}

const tabs: Tab[] = [
  { name: 'Home', label: 'Home', icon: '🏠' },
  { name: 'Buzz', label: 'Buzz', icon: '🔥' },
  { name: 'Tickets', label: 'Tickets', icon: '🎫' },
  { name: 'Calendar', label: 'Calendar', icon: '📅' },
  { name: 'Profile', label: 'Profile', icon: '👤' },
];

export const BottomNav: React.FC = () => {
  const navigation = useNavigation();
  const route = useRoute();

  const isActive = (tabName: string) => {
    return route.name === tabName;
  };

  return (
    <View style={styles.container}>
      <BlurView intensity={80} tint="dark" style={styles.blurContainer}>
        <View style={styles.navContent}>
          {tabs.map((tab, index) => {
            const active = isActive(tab.name);
            const isTickets = tab.name === 'Tickets';

            if (isTickets) {
              return (
                <TouchableOpacity
                  key={tab.name}
                  style={styles.ticketsButton}
                  onPress={() => navigation.navigate(tab.name as never)}
                  activeOpacity={0.8}
                >
                  <LinearGradient
                    colors={['#7C3AED', '#06B6D4']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={styles.ticketsGradient}
                  >
                    <Text style={styles.ticketsIcon}>{tab.icon}</Text>
                    <Text style={styles.ticketsLabel}>{tab.label}</Text>
                  </LinearGradient>
                </TouchableOpacity>
              );
            }

            return (
              <TouchableOpacity
                key={tab.name}
                style={[styles.tab, active && styles.activeTab]}
                onPress={() => navigation.navigate(tab.name as never)}
                activeOpacity={0.7}
              >
                <Text style={[styles.tabIcon, active && styles.activeTabIcon]}>
                  {tab.icon}
                </Text>
                <Text style={[styles.tabLabel, active && styles.activeTabLabel]}>
                  {tab.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </BlurView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 90,
    paddingBottom: 20,
  },
  blurContainer: {
    flex: 1,
    borderTopWidth: 1,
    borderTopColor: 'rgba(124, 58, 237, 0.2)',
  },
  navContent: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingHorizontal: 8,
    paddingTop: 8,
  },
  tab: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 12,
    minWidth: 60,
  },
  activeTab: {
    backgroundColor: 'rgba(124, 58, 237, 0.15)',
  },
  tabIcon: {
    fontSize: 24,
    marginBottom: 4,
  },
  activeTabIcon: {
    transform: [{ scale: 1.1 }],
  },
  tabLabel: {
    fontSize: 11,
    color: '#A3A3A3',
    fontWeight: '500',
  },
  activeTabLabel: {
    color: '#7C3AED',
    fontWeight: '600',
  },
  ticketsButton: {
    marginTop: -20,
    borderRadius: 20,
    overflow: 'hidden',
    shadowColor: '#7C3AED',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 8,
  },
  ticketsGradient: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 80,
  },
  ticketsIcon: {
    fontSize: 24,
    marginBottom: 2,
  },
  ticketsLabel: {
    fontSize: 11,
    color: '#FFFFFF',
    fontWeight: '600',
  },
});

