import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Modal, Share } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ticketsApi } from '../services/api';
import { Ticket } from '../types';
import { formatCurrency, formatDate } from '../utils';
import { QRCodeScanner } from '../components/QRCodeScanner';

export const TicketsScreen: React.FC = () => {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [showScanner, setShowScanner] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
  const [showQRModal, setShowQRModal] = useState(false);

  useEffect(() => {
    loadTickets();
  }, []);

  const loadTickets = async () => {
    try {
      const response = await ticketsApi.getMyTickets();
      setTickets(response.data);
    } catch (error) {
      console.error('Error loading tickets:', error);
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.title}>My Tickets</Text>
        <TouchableOpacity
          style={styles.scanButton}
          onPress={() => setShowScanner(true)}
        >
          <Text style={styles.scanButtonText}>📷 Scan</Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
      >
        {tickets.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyIcon}>🎫</Text>
            <Text style={styles.emptyText}>No tickets yet</Text>
            <Text style={styles.emptySubtext}>
              Your purchased tickets will appear here
            </Text>
          </View>
        ) : (
          tickets.map((ticket) => (
            <View key={ticket.id} style={styles.ticketCard}>
              <View style={styles.ticketHeader}>
                <Text style={styles.ticketType}>{ticket.ticketType}</Text>
                <View
                  style={[
                    styles.statusBadge,
                    ticket.paymentStatus === 'completed' && styles.statusCompleted,
                  ]}
                >
                  <Text style={styles.statusText}>
                    {ticket.paymentStatus.toUpperCase()}
                  </Text>
                </View>
              </View>
              <Text style={styles.ticketQuantity}>
                Quantity: {ticket.quantity}
              </Text>
              <Text style={styles.ticketPrice}>
                {formatCurrency(ticket.total)}
              </Text>
              <Text style={styles.ticketDate}>
                Purchased: {formatDate(ticket.createdAt)}
              </Text>
              {ticket.paymentStatus === 'completed' && (
                <View style={styles.ticketActions}>
                  <TouchableOpacity
                    style={styles.viewButton}
                    onPress={() => {
                      setSelectedTicket(ticket);
                      setShowQRModal(true);
                    }}
                  >
                    <Text style={styles.viewButtonText}>View QR Code</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.shareButton}
                    onPress={() => handleShareTicket(ticket)}
                  >
                    <Text style={styles.shareButtonText}>Share</Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>
          ))
        )}
      </ScrollView>

      {/* QR Code Modal */}
      {selectedTicket && (
        <Modal
          visible={showQRModal}
          transparent
          animationType="fade"
          onRequestClose={() => setShowQRModal(false)}
        >
          <View style={styles.qrModalContainer}>
            <View style={styles.qrModalContent}>
              <Text style={styles.qrModalTitle}>Your Ticket</Text>
              <View style={styles.qrCodeContainer}>
                <Text style={styles.qrCodeText}>{selectedTicket.qrCode}</Text>
                <Text style={styles.qrCodeLabel}>QR Code</Text>
              </View>
              <Text style={styles.qrModalInfo}>
                Show this code at the event entrance
              </Text>
              <TouchableOpacity
                style={styles.closeQRButton}
                onPress={() => setShowQRModal(false)}
              >
                <Text style={styles.closeQRButtonText}>Close</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      )}

      {/* QR Scanner */}
      <QRCodeScanner
        visible={showScanner}
        onClose={() => setShowScanner(false)}
        onScan={(data) => {
          console.log('Scanned:', data);
          // Handle scanned QR code
        }}
      />
    </SafeAreaView>
  );

  function handleShareTicket(ticket: Ticket) {
    Share.share({
      message: `Event Ticket\nTicket ID: ${ticket.id}\nQR Code: ${ticket.qrCode}`,
      title: 'My Event Ticket',
    });
  }
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
  scanButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 12,
    backgroundColor: '#7C3AED',
  },
  scanButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 100,
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
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#A3A3A3',
    textAlign: 'center',
  },
  ticketCard: {
    backgroundColor: '#0F1724',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
  },
  ticketHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  ticketType: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    backgroundColor: '#F59E0B',
  },
  statusCompleted: {
    backgroundColor: '#10B981',
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  ticketQuantity: {
    fontSize: 14,
    color: '#A3A3A3',
    marginBottom: 4,
  },
  ticketPrice: {
    fontSize: 20,
    fontWeight: '700',
    color: '#7C3AED',
    marginBottom: 4,
  },
  ticketDate: {
    fontSize: 12,
    color: '#A3A3A3',
    marginBottom: 12,
  },
  viewButton: {
    paddingVertical: 12,
    borderRadius: 12,
    backgroundColor: '#7C3AED',
    alignItems: 'center',
  },
  viewButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  ticketActions: {
    flexDirection: 'row',
    gap: 8,
  },
  shareButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 12,
    backgroundColor: '#0F1724',
    borderWidth: 1,
    borderColor: '#2A2F36',
    alignItems: 'center',
  },
  shareButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  qrModalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  qrModalContent: {
    backgroundColor: '#0F1724',
    borderRadius: 20,
    padding: 24,
    width: '100%',
    maxWidth: 400,
    alignItems: 'center',
  },
  qrModalTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 24,
  },
  qrCodeContainer: {
    width: 200,
    height: 200,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
    padding: 16,
  },
  qrCodeText: {
    fontSize: 12,
    color: '#000000',
    textAlign: 'center',
    fontFamily: 'monospace',
  },
  qrCodeLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#000000',
    marginTop: 8,
  },
  qrModalInfo: {
    fontSize: 14,
    color: '#A3A3A3',
    textAlign: 'center',
    marginBottom: 24,
  },
  closeQRButton: {
    width: '100%',
    paddingVertical: 14,
    borderRadius: 12,
    backgroundColor: '#7C3AED',
    alignItems: 'center',
  },
  closeQRButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
});

