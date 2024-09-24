// SplashScreen.js
import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Image } from 'react-native';
import SplashScreen from 'react-native-splash-screen';

import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withDelay,
  withSequence,
  withRepeat,
} from 'react-native-reanimated';

const AnimatedNumber = ({ number, startDelay, repeatDelay }) => {
  const fillValue = useSharedValue(0);

  useEffect(() => {
    fillValue.value = withRepeat(withSequence(
      withDelay(startDelay, withTiming(1)),
      withDelay(1000, withTiming(0)),
      withDelay(repeatDelay, withTiming(0)),
    ), -1, false);
  }, [startDelay, repeatDelay]);

  const animatedStyle = useAnimatedStyle(() => ({
    color: fillValue.value == 1 ? 'black' : 'rgba(154, 31, 255, 1)',
    textShadowColor: 'black',
    // textShadowOffset: { width: 3, height: 3 },
    textShadowRadius: 3,
  }));

  return (
    <Animated.Text style={[styles.number, animatedStyle]}>
      {number}
    </Animated.Text>
  );
};

const SplashScreenComponent = () => {

    useEffect(() => {
      SplashScreen.hide(); // Скрыть нативный сплэш-экран после загрузки
    }, []);

    return (
      <View style={styles.container}>
        <AnimatedNumber number="143" startDelay={0} repeatDelay={3000} />
        <AnimatedNumber number="143" startDelay={1000} repeatDelay={2000} />
        <AnimatedNumber number="143" startDelay={2000} repeatDelay={1000} />
        <AnimatedNumber number="143" startDelay={3000} repeatDelay={0} />
      </View>
    );
};

  //   return (
  //     <View style={styles.container}>
  //       <Image 
  //         source={require('../assets/logo_code.png')}
  //         style={styles.image}
  //       />
  //     </View>
  //   );
  // };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     backgroundColor: '#232323',
//   },
//   image: {
//     width: 200,      // Ширина изображения
//     height: 200, 
//     resizeMode: 'contain',
//   },

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(154, 31, 255, 1)',
  },
  number: {
    flex: 1,
    fontSize: 220,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default SplashScreenComponent;
