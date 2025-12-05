import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Switch,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'event' | 'ticket' | 'reminder' | 'promo';
  read: boolean;
  timestamp: string;
}

const MOCK_NOTIFICATIONS: Notification[] = [
  {
    id: '1',
    title: 'New Event Near You',
    message: 'Afrobeats Beach Party is happening this weekend!',
    type: 'event',
    read: false,
    timestamp: '2 hours ago',
  },
  {
    id: '2',
    title: 'Ticket Confirmed',
    message: 'Your ticket for Summer Festival has been confirmed',
    type: 'ticket',
    read: false,
    timestamp: '1 day ago',
  },
  {
    id: '3',
    title: 'Event Reminder',
    message: 'Don\'t forget: Beach Party starts in 2 hours!',
    type: 'reminder',
    read: true,
    timestamp: '3 days ago',
  },
  {
    id: '4',
    title: 'Promo Code Available',
    message: 'Use SUMMER20 for 20% off your next ticket!',
    type: 'promo',
    read: true,
    timestamp: '1 week ago',
  },
];

export const NotificationsScreen: React.FC = () => {
  const [notifications, setNotifications] = useState<Notification[]>(MOCK_NOTIFICATIONS);
  const [settings, setSettings] = useState({
    eventNotifications: true,
    ticketNotifications: true,
    reminders: true,
    promoNotifications: true,
  });

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'event':
        return '🎉';
      case 'ticket':
        return '🎫';
      case 'reminder':
        return '⏰';
      case 'promo':
        return '🎁';
      default:
        return '🔔';
    }
  };

  const markAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((notif) => (notif.id === id ? { ...notif, read: true } : notif))
    );
  };

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((notif) => ({ ...notif, read: true })));
  };

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.title}>Notifications</Text>
        {unreadCount > 0 && (
          <TouchableOpacity onPress={markAllAsRead}>
            <Text style={styles.markAllText}>Mark all as read</Text>
          </TouchableOpacity>
        )}
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {notifications.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyIcon}>🔔</Text>
            <Text style={styles.emptyText}>No notifications</Text>
          </View>
        ) : (
          <>
            {notifications.map((notification) => (
              <TouchableOpacity
                key={notification.id}
                style={[
                  styles.notificationCard,
                  !notification.read && styles.unreadCard,
                ]}
                onPress={() => markAsRead(notification.id)}
                activeOpacity={0.7}
              >
                <View style={styles.iconContainer}>
                  <Text style={styles.icon}>{getNotificationIcon(notification.type)}</Text>
                </View>
                <View style={styles.content}>
                  <View style={styles.headerRow}>
                    <Text style={styles.notificationTitle}>{notification.title}</Text>
                    {!notification.read && <View style={styles.unreadDot} />}
                  </View>
                  <Text style={styles.notificationMessage}>{notification.message}</Text>
                  <Text style={styles.timestamp}>{notification.timestamp}</Text>
                </View>
              </TouchableOpacity>
            ))}

            <View style={styles.settingsSection}>
              <Text style={styles.settingsTitle}>Notification Settings</Text>
              
              <View style={styles.settingItem}>
                <View style={styles.settingInfo}>
                  <Text style={styles.settingLabel}>Event Notifications</Text>
                  <Text style={styles.settingDescription}>New events near you</Text>
                </View>
                <Switch
                  value={settings.eventNotifications}
                  onValueChange={(value) =>
                    setSettings({ ...settings, eventNotifications: value })
                  }
                  trackColor={{ false: '#2A2F36', true: '#7C3AED' }}
                  thumbColor="#FFFFFF"
                />
              </View>

              <View style={styles.settingItem}>
                <View style={styles.settingInfo}>
                  <Text style={styles.settingLabel}>Ticket Notifications</Text>
                  <Text style={styles.settingDescription}>Ticket confirmations and updates</Text>
                </View>
                <Switch
                  value={settings.ticketNotifications}
                  onValueChange={(value) =>
                    setSettings({ ...settings, ticketNotifications: value })
                  }
                  trackColor={{ false: '#2A2F36', true: '#7C3AED' }}
                  thumbColor="#FFFFFF"
                />
              </View>

              <View style={styles.settingItem}>
                <View style={styles.settingInfo}>
                  <Text style={styles.settingLabel}>Event Reminders</Text>
                  <Text style={styles.settingDescription}>Reminders before events</Text>
                </View>
                <Switch
                  value={settings.reminders}
                  onValueChange={(value) =>
                    setSettings({ ...settings, reminders: value })
                  }
                  trackColor={{ false: '#2A2F36', true: '#7C3AED' }}
                  thumbColor="#FFFFFF"
                />
              </View>

              <View style={styles.settingItem}>
                <View style={styles.settingInfo}>
                  <Text style={styles.settingLabel}>Promo Notifications</Text>
                  <Text style={styles.settingDescription}>Promo codes and discounts</Text>
                </View>
                <Switch
                  value={settings.promoNotifications}
                  onValueChange={(value) =>
                    setSettings({ ...settings, promoNotifications: value })
                  }
                  trackColor={{ false: '#2A2F36', true: '#7C3AED' }}
                  thumbColor="#FFFFFF"
                />
              </View>
            </View>
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0B0F12',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 12,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  markAllText: {
    fontSize: 14,
    color: '#7C3AED',
    fontWeight: '600',
  },
  scrollView: {
    flex: 1,
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyIcon: {
    fontSize: 64,
    marginBottom: 16,
  },
  emptyText: {
    fontSize: 20,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  notificationCard: {
    flexDirection: 'row',
    backgroundColor: '#0F1724',
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#2A2F36',
  },
  unreadCard: {
    borderColor: '#7C3AED',
    backgroundColor: '#7C3AED10',
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#0B0F12',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  icon: {
    fontSize: 24,
  },
  content: {
    flex: 1,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  notificationTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
    flex: 1,
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#7C3AED',
    marginLeft: 8,
  },
  notificationMessage: {
    fontSize: 14,
    color: '#A3A3A3',
    marginBottom: 4,
  },
  timestamp: {
    fontSize: 12,
    color: '#A3A3A3',
  },
  settingsSection: {
    marginTop: 24,
    marginHorizontal: 16,
    marginBottom: 32,
    backgroundColor: '#0F1724',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#2A2F36',
  },
  settingsTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 16,
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#2A2F36',
  },
  settingInfo: {
    flex: 1,
    marginRight: 16,
  },
  settingLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  settingDescription: {
    fontSize: 12,
    color: '#A3A3A3',
  },
});

