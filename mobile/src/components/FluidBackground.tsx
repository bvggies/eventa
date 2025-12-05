import React, { useEffect } from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  interpolate,
  Easing,
} from 'react-native-reanimated';
import { LiquidBlob } from './LiquidBlob';

const { width, height } = Dimensions.get('window');

export const FluidBackground: React.FC = () => {
  const progress1 = useSharedValue(0);
  const progress2 = useSharedValue(0);
  const progress3 = useSharedValue(0);

  useEffect(() => {
    progress1.value = withRepeat(
      withTiming(1, {
        duration: 4000,
        easing: Easing.inOut(Easing.ease),
      }),
      -1,
      true
    );
    progress2.value = withRepeat(
      withTiming(1, {
        duration: 5000,
        easing: Easing.inOut(Easing.ease),
      }),
      -1,
      true
    );
    progress3.value = withRepeat(
      withTiming(1, {
        duration: 6000,
        easing: Easing.inOut(Easing.ease),
      }),
      -1,
      true
    );
  }, []);

  const animatedStyle1 = useAnimatedStyle(() => {
    const x = interpolate(progress1.value, [0, 1], [0, width * 0.3]);
    const y = interpolate(progress1.value, [0, 1], [0, height * 0.2]);
    return {
      transform: [{ translateX: x }, { translateY: y }],
    };
  });

  const animatedStyle2 = useAnimatedStyle(() => {
    const x = interpolate(progress2.value, [0, 1], [0, -width * 0.2]);
    const y = interpolate(progress2.value, [0, 1], [0, height * 0.3]);
    return {
      transform: [{ translateX: x }, { translateY: y }],
    };
  });

  const animatedStyle3 = useAnimatedStyle(() => {
    const x = interpolate(progress3.value, [0, 1], [0, width * 0.25]);
    const y = interpolate(progress3.value, [0, 1], [0, -height * 0.15]);
    return {
      transform: [{ translateX: x }, { translateY: y }],
    };
  });

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#0B0F12', '#1a1f2e', '#0B0F12']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={StyleSheet.absoluteFill}
      />
      <Animated.View style={[styles.blobContainer, animatedStyle1]}>
        <LiquidBlob width={400} height={400} color="#7C3AED" duration={4000} />
      </Animated.View>
      <Animated.View style={[styles.blobContainer, animatedStyle2]}>
        <LiquidBlob width={350} height={350} color="#06B6D4" duration={5000} />
      </Animated.View>
      <Animated.View style={[styles.blobContainer, animatedStyle3]}>
        <LiquidBlob width={300} height={300} color="#F59E0B" duration={6000} />
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    overflow: 'hidden',
  },
  blobContainer: {
    position: 'absolute',
  },
});

