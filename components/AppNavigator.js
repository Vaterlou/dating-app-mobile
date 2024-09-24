// AppNavigator.js
import React from 'react';
import { View, Text, FlatList } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { Easing } from 'react-native-reanimated'; 

import SignupScreen from './../screens/SignupScreen';
import LoginScreen from './../screens/LoginScreen';
import MainTabNavigator from './MainTabNavigator';
import HelloScreen from '../screens/HelloScreen';
import LoginByEmailScreen from '../screens/LoginByEmailScreen';
import AboutMyselfScreen from '../screens/AboutMyselfScreen'

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="LoginByEmail">
        {/* <Stack.Screen name="Hello" component={HelloScreen} options={{ headerShown: false }} />
        <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} /> */}
        <Stack.Screen name="LoginByEmail" component={LoginByEmailScreen} options={{ headerShown: false }} />
        <Stack.Screen name="Signup" component={SignupScreen} options={{ headerShown: false }} />
        <Stack.Screen name="About" component={AboutMyselfScreen} options={{ headerShown: false }} />
        <Stack.Screen name="MainTabs" component={MainTabNavigator} options={{ headerShown: false }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

