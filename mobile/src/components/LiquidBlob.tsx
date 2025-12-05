import React, { useEffect } from 'react';
import { StyleSheet } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  interpolate,
  Easing,
} from 'react-native-reanimated';

const AnimatedPath = Animated.createAnimatedComponent(Path);

interface LiquidBlobProps {
  width?: number;
  height?: number;
  color?: string;
  duration?: number;
}

export const LiquidBlob: React.FC<LiquidBlobProps> = ({
  width = 300,
  height = 300,
  color = '#7C3AED',
  duration = 3000,
}) => {
  const progress = useSharedValue(0);

  useEffect(() => {
    progress.value = withRepeat(
      withTiming(1, {
        duration,
        easing: Easing.inOut(Easing.ease),
      }),
      -1,
      true
    );
  }, []);

  const animatedStyle = useAnimatedStyle(() => {
    const offset = interpolate(progress.value, [0, 1], [0, 20]);
    return {
      transform: [{ translateY: offset }],
    };
  });

  const generateBlobPath = (offset: number) => {
    const w = width;
    const h = height;
    const centerX = w / 2;
    const centerY = h / 2;
    const radius = Math.min(w, h) / 2;

    const points = 8;
    let path = `M ${centerX + radius * Math.cos(0 + offset)} ${centerY + radius * Math.sin(0 + offset)}`;

    for (let i = 1; i <= points; i++) {
      const angle = (i * 2 * Math.PI) / points + offset;
      const r = radius + Math.sin(i * 0.5 + offset) * 20;
      const x = centerX + r * Math.cos(angle);
      const y = centerY + r * Math.sin(angle);
      path += ` L ${x} ${y}`;
    }

    path += ' Z';
    return path;
  };

  return (
    <Animated.View style={[styles.container, animatedStyle]}>
      <Svg width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
        <AnimatedPath
          d={generateBlobPath(0)}
          fill={color}
          opacity={0.3}
        />
      </Svg>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
  },
});

