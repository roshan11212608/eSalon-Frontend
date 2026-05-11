import React from 'react';
import { View, Animated } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

const PeriodSelectorLoader: React.FC = () => {
  const shimmerAnim = React.useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    const shimmerAnimation = Animated.loop(
      Animated.sequence([
        Animated.timing(shimmerAnim, {
          toValue: 1,
          duration: 1500,
          useNativeDriver: true,
        }),
        Animated.timing(shimmerAnim, {
          toValue: 0,
          duration: 1500,
          useNativeDriver: true,
        }),
      ])
    );
    shimmerAnimation.start();
    return () => shimmerAnimation.stop();
  }, []);

  const shimmerTranslateX = shimmerAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [-200, 200],
  });

  const ShimmerBox = ({ width }: { width: number }) => (
    <View style={{ width, height: 40, borderRadius: 20, overflow: 'hidden' }}>
      <View style={{ flex: 1, backgroundColor: '#F3F4F6' }}>
        <Animated.View
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            transform: [{ translateX: shimmerTranslateX }],
          }}
        >
          <LinearGradient
            colors={['transparent', 'rgba(255,255,255,0.4)', 'transparent']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={{ flex: 1 }}
          />
        </Animated.View>
      </View>
    </View>
  );

  return (
    <View style={{ 
      flexDirection: 'row', 
      justifyContent: 'space-between', 
      paddingHorizontal: 16,
      paddingVertical: 16 
    }}>
      <ShimmerBox width={80} />
      <ShimmerBox width={80} />
      <ShimmerBox width={80} />
    </View>
  );
};

export default PeriodSelectorLoader;
