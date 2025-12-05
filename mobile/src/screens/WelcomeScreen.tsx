import React, { useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withDelay,
  FadeIn,
  FadeInDown,
} from 'react-native-reanimated';
import { FluidBackground } from '../components/FluidBackground';
import { LogoMorph } from '../components/LogoMorph';
import { useNavigation } from '@react-navigation/native';

const { width } = Dimensions.get('window');

export const WelcomeScreen: React.FC = () => {
  const navigation = useNavigation();
  const logoOpacity = useSharedValue(0);
  const titleOpacity = useSharedValue(0);
  const subtitleOpacity = useSharedValue(0);
  const buttonOpacity = useSharedValue(0);

  useEffect(() => {
    logoOpacity.value = withDelay(300, withTiming(1, { duration: 800 }));
    titleOpacity.value = withDelay(600, withTiming(1, { duration: 800 }));
    subtitleOpacity.value = withDelay(900, withTiming(1, { duration: 800 }));
    buttonOpacity.value = withDelay(1200, withTiming(1, { duration: 800 }));
  }, []);

  const logoStyle = useAnimatedStyle(() => ({
    opacity: logoOpacity.value,
  }));

  const titleStyle = useAnimatedStyle(() => ({
    opacity: titleOpacity.value,
    transform: [{ translateY: titleOpacity.value === 0 ? 20 : 0 }],
  }));

  const subtitleStyle = useAnimatedStyle(() => ({
    opacity: subtitleOpacity.value,
    transform: [{ translateY: subtitleOpacity.value === 0 ? 20 : 0 }],
  }));

  const buttonStyle = useAnimatedStyle(() => ({
    opacity: buttonOpacity.value,
    transform: [{ translateY: buttonOpacity.value === 0 ? 20 : 0 }],
  }));

  return (
    <View style={styles.container}>
      <FluidBackground />
      
      <View style={styles.content}>
        <Animated.View style={[styles.logoContainer, logoStyle]}>
          <LogoMorph
            size={150}
            source={require('../../assets/icon.png')}
          />
        </Animated.View>

        <Animated.View style={[styles.textContainer, titleStyle]}>
          <Text style={styles.title}>Eventa</Text>
          <Text style={styles.tagline}>Ghana Events & Parties Explorer</Text>
        </Animated.View>

        <Animated.View style={[styles.benefitsContainer, subtitleStyle]}>
          <View style={styles.benefit}>
            <Text style={styles.benefitIcon}>🎉</Text>
            <Text style={styles.benefitText}>Discover events near you</Text>
          </View>
          <View style={styles.benefit}>
            <Text style={styles.benefitIcon}>💳</Text>
            <Text style={styles.benefitText}>Buy tickets with MoMo</Text>
          </View>
          <View style={styles.benefit}>
            <Text style={styles.benefitIcon}>📍</Text>
            <Text style={styles.benefitText}>Find the best parties</Text>
          </View>
        </Animated.View>

        <Animated.View style={[styles.buttonContainer, buttonStyle]}>
          <TouchableOpacity
            style={styles.primaryButton}
            onPress={() => navigation.navigate('Auth' as never)}
            activeOpacity={0.8}
          >
            <LinearGradient
              colors={['#7C3AED', '#06B6D4']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.gradientButton}
            >
              <Text style={styles.primaryButtonText}>Get Started</Text>
            </LinearGradient>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.secondaryButton}
            onPress={() => navigation.navigate('Auth' as never)}
            activeOpacity={0.8}
          >
            <Text style={styles.secondaryButtonText}>Sign In</Text>
          </TouchableOpacity>
        </Animated.View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0B0F12',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
    zIndex: 1,
  },
  logoContainer: {
    marginBottom: 40,
  },
  textContainer: {
    alignItems: 'center',
    marginBottom: 48,
  },
  title: {
    fontSize: 48,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 8,
    letterSpacing: 2,
  },
  tagline: {
    fontSize: 16,
    color: '#A3A3A3',
    textAlign: 'center',
  },
  benefitsContainer: {
    width: '100%',
    marginBottom: 48,
  },
  benefit: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    paddingHorizontal: 20,
  },
  benefitIcon: {
    fontSize: 24,
    marginRight: 16,
  },
  benefitText: {
    fontSize: 16,
    color: '#FFFFFF',
    flex: 1,
  },
  buttonContainer: {
    width: '100%',
    gap: 16,
  },
  primaryButton: {
    width: '100%',
    borderRadius: 16,
    overflow: 'hidden',
  },
  gradientButton: {
    paddingVertical: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  primaryButtonText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  secondaryButton: {
    width: '100%',
    paddingVertical: 18,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#7C3AED',
    borderRadius: 16,
  },
  secondaryButtonText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#7C3AED',
  },
});

