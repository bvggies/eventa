import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  ScrollView,
  TextInput,
} from 'react-native';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import { formatCurrency } from '../utils';

interface PaymentModalProps {
  visible: boolean;
  onClose: () => void;
  onComplete: (paymentData: PaymentData) => void;
  ticketPrice: number;
  quantity: number;
  eventName: string;
  promoCode?: string;
  onPromoCodeApply?: (code: string) => Promise<{ discount: number } | null>;
}

export interface PaymentData {
  paymentMethod: 'momo' | 'vodafone' | 'card' | 'cash';
  phoneNumber?: string;
  cardNumber?: string;
  promoCode?: string;
}

export const PaymentModal: React.FC<PaymentModalProps> = ({
  visible,
  onClose,
  onComplete,
  ticketPrice,
  quantity,
  eventName,
  promoCode: initialPromoCode,
  onPromoCodeApply,
}) => {
  const [selectedMethod, setSelectedMethod] = useState<'momo' | 'vodafone' | 'card' | 'cash'>('momo');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [promoCode, setPromoCode] = useState(initialPromoCode || '');
  const [discount, setDiscount] = useState(0);
  const [applyingPromo, setApplyingPromo] = useState(false);

  const subtotal = ticketPrice * quantity;
  const total = subtotal - discount;

  const handlePromoCode = async () => {
    if (!promoCode || !onPromoCodeApply) return;
    
    setApplyingPromo(true);
    try {
      const result = await onPromoCodeApply(promoCode);
      if (result) {
        setDiscount(result.discount);
      } else {
        alert('Invalid promo code');
      }
    } catch (error) {
      alert('Error applying promo code');
    } finally {
      setApplyingPromo(false);
    }
  };

  const handleComplete = () => {
    const paymentData: PaymentData = {
      paymentMethod: selectedMethod,
      phoneNumber: selectedMethod === 'momo' || selectedMethod === 'vodafone' ? phoneNumber : undefined,
      cardNumber: selectedMethod === 'card' ? cardNumber : undefined,
      promoCode: promoCode || undefined,
    };
    onComplete(paymentData);
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <View style={styles.modalContainer}>
        <BlurView intensity={80} tint="dark" style={styles.blurContainer}>
          <View style={styles.modalContent}>
            <View style={styles.header}>
              <Text style={styles.title}>Complete Payment</Text>
              <TouchableOpacity onPress={onClose}>
                <Text style={styles.closeButton}>✕</Text>
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
              <View style={styles.eventInfo}>
                <Text style={styles.eventName}>{eventName}</Text>
                <Text style={styles.ticketInfo}>
                  {quantity} ticket{quantity > 1 ? 's' : ''} × {formatCurrency(ticketPrice)}
                </Text>
              </View>

              {/* Promo Code */}
              {onPromoCodeApply && (
                <View style={styles.section}>
                  <Text style={styles.sectionTitle}>Promo Code</Text>
                  <View style={styles.promoContainer}>
                    <TextInput
                      style={styles.promoInput}
                      placeholder="Enter promo code"
                      placeholderTextColor="#A3A3A3"
                      value={promoCode}
                      onChangeText={setPromoCode}
                    />
                    <TouchableOpacity
                      style={styles.promoButton}
                      onPress={handlePromoCode}
                      disabled={applyingPromo}
                    >
                      <Text style={styles.promoButtonText}>
                        {applyingPromo ? '...' : 'Apply'}
                      </Text>
                    </TouchableOpacity>
                  </View>
                  {discount > 0 && (
                    <Text style={styles.discountText}>
                      Discount: -{formatCurrency(discount)}
                    </Text>
                  )}
                </View>
              )}

              {/* Payment Method */}
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Payment Method</Text>
                <View style={styles.methodContainer}>
                  <TouchableOpacity
                    style={[
                      styles.methodButton,
                      selectedMethod === 'momo' && styles.methodButtonSelected,
                    ]}
                    onPress={() => setSelectedMethod('momo')}
                  >
                    <Text style={styles.methodIcon}>📱</Text>
                    <Text
                      style={[
                        styles.methodText,
                        selectedMethod === 'momo' && styles.methodTextSelected,
                      ]}
                    >
                      MTN MoMo
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[
                      styles.methodButton,
                      selectedMethod === 'vodafone' && styles.methodButtonSelected,
                    ]}
                    onPress={() => setSelectedMethod('vodafone')}
                  >
                    <Text style={styles.methodIcon}>📱</Text>
                    <Text
                      style={[
                        styles.methodText,
                        selectedMethod === 'vodafone' && styles.methodTextSelected,
                      ]}
                    >
                      Vodafone Cash
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[
                      styles.methodButton,
                      selectedMethod === 'card' && styles.methodButtonSelected,
                    ]}
                    onPress={() => setSelectedMethod('card')}
                  >
                    <Text style={styles.methodIcon}>💳</Text>
                    <Text
                      style={[
                        styles.methodText,
                        selectedMethod === 'card' && styles.methodTextSelected,
                      ]}
                    >
                      Card
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[
                      styles.methodButton,
                      selectedMethod === 'cash' && styles.methodButtonSelected,
                    ]}
                    onPress={() => setSelectedMethod('cash')}
                  >
                    <Text style={styles.methodIcon}>💵</Text>
                    <Text
                      style={[
                        styles.methodText,
                        selectedMethod === 'cash' && styles.methodTextSelected,
                      ]}
                    >
                      Pay on Arrival
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>

              {/* Payment Details */}
              {(selectedMethod === 'momo' || selectedMethod === 'vodafone') && (
                <View style={styles.section}>
                  <Text style={styles.sectionTitle}>Phone Number</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="Enter phone number"
                    placeholderTextColor="#A3A3A3"
                    keyboardType="phone-pad"
                    value={phoneNumber}
                    onChangeText={setPhoneNumber}
                  />
                </View>
              )}

              {selectedMethod === 'card' && (
                <View style={styles.section}>
                  <Text style={styles.sectionTitle}>Card Number</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="Enter card number"
                    placeholderTextColor="#A3A3A3"
                    keyboardType="numeric"
                    value={cardNumber}
                    onChangeText={setCardNumber}
                  />
                </View>
              )}

              {/* Summary */}
              <View style={styles.summary}>
                <View style={styles.summaryRow}>
                  <Text style={styles.summaryLabel}>Subtotal</Text>
                  <Text style={styles.summaryValue}>{formatCurrency(subtotal)}</Text>
                </View>
                {discount > 0 && (
                  <View style={styles.summaryRow}>
                    <Text style={styles.summaryLabel}>Discount</Text>
                    <Text style={[styles.summaryValue, styles.discount]}>
                      -{formatCurrency(discount)}
                    </Text>
                  </View>
                )}
                <View style={[styles.summaryRow, styles.totalRow]}>
                  <Text style={styles.totalLabel}>Total</Text>
                  <Text style={styles.totalValue}>{formatCurrency(total)}</Text>
                </View>
              </View>
            </ScrollView>

            <View style={styles.footer}>
              <TouchableOpacity style={styles.cancelButton} onPress={onClose}>
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.payButton}
                onPress={handleComplete}
                disabled={!phoneNumber && (selectedMethod === 'momo' || selectedMethod === 'vodafone')}
              >
                <LinearGradient
                  colors={['#7C3AED', '#06B6D4']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={styles.payGradient}
                >
                  <Text style={styles.payButtonText}>
                    Pay {formatCurrency(total)}
                  </Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>
          </View>
        </BlurView>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  blurContainer: {
    flex: 1,
  },
  modalContent: {
    backgroundColor: '#0F1724',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: '90%',
    paddingTop: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#2A2F36',
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  closeButton: {
    fontSize: 24,
    color: '#A3A3A3',
    fontWeight: '300',
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: 20,
  },
  eventInfo: {
    marginTop: 20,
    marginBottom: 24,
    padding: 16,
    backgroundColor: '#0B0F12',
    borderRadius: 12,
  },
  eventName: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  ticketInfo: {
    fontSize: 14,
    color: '#A3A3A3',
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 12,
  },
  promoContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  promoInput: {
    flex: 1,
    backgroundColor: '#0B0F12',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    color: '#FFFFFF',
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#2A2F36',
  },
  promoButton: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 12,
    backgroundColor: '#7C3AED',
  },
  promoButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  discountText: {
    fontSize: 14,
    color: '#10B981',
    marginTop: 8,
    fontWeight: '600',
  },
  methodContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  methodButton: {
    flex: 1,
    minWidth: '45%',
    paddingVertical: 16,
    paddingHorizontal: 12,
    borderRadius: 12,
    backgroundColor: '#0B0F12',
    borderWidth: 2,
    borderColor: 'transparent',
    alignItems: 'center',
  },
  methodButtonSelected: {
    borderColor: '#7C3AED',
    backgroundColor: '#7C3AED20',
  },
  methodIcon: {
    fontSize: 24,
    marginBottom: 8,
  },
  methodText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#A3A3A3',
  },
  methodTextSelected: {
    color: '#7C3AED',
  },
  input: {
    backgroundColor: '#0B0F12',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    color: '#FFFFFF',
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#2A2F36',
  },
  summary: {
    marginTop: 8,
    marginBottom: 24,
    padding: 16,
    backgroundColor: '#0B0F12',
    borderRadius: 12,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  summaryLabel: {
    fontSize: 14,
    color: '#A3A3A3',
  },
  summaryValue: {
    fontSize: 14,
    color: '#FFFFFF',
    fontWeight: '600',
  },
  discount: {
    color: '#10B981',
  },
  totalRow: {
    marginTop: 8,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#2A2F36',
  },
  totalLabel: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  totalValue: {
    fontSize: 18,
    fontWeight: '700',
    color: '#7C3AED',
  },
  footer: {
    flexDirection: 'row',
    gap: 12,
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#2A2F36',
  },
  cancelButton: {
    flex: 1,
    paddingVertical: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#2A2F36',
    alignItems: 'center',
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#A3A3A3',
  },
  payButton: {
    flex: 2,
    borderRadius: 12,
    overflow: 'hidden',
  },
  payGradient: {
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  payButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});

