// MainTabNavigator.js
import React from 'react';

import ProfileScreen from './../screens/ProfileScreen';
import EditProfileScreen from './../screens/EditProfileScreen';
import UserSwipeScreen from './../screens/UserSwipeScreen';
import MatchsListsScreen from './../screens/MatchsListsScreen';
import ChatScreen from '../screens/ChatScreen';
import MapScreen from '../screens/MapScreen';
// import MessagesScreen from './MessagesScreen';
// import MapScreen from './MapScreen';
// import SettingsScreen from './SettingsScreen';
import { Icon } from 'react-native-elements';
import {  Image } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

// Экран, который будет использоваться внутри таба
const ProfileStack = () => {
  return (
    <Stack.Navigator initialRouteName="Profile">
      <Stack.Screen name="Profile" component={ProfileScreen} options={{ headerShown: false }} />
      <Stack.Screen name="EditProfile" component={EditProfileScreen} />
    </Stack.Navigator>
  );
};

const MatchesStack = () => {
    return (
      <Stack.Navigator initialRouteName="Matches">
        <Stack.Screen name="Matches" component={MatchsListsScreen} options={{ headerShown: false }} />
        <Stack.Screen name="ProfileUser" component={ProfileScreen} />
        <Stack.Screen name="Chat" component={ChatScreen} />
      </Stack.Navigator>
    );
  };

// Основной навигационный таб
const MainTabNavigator = () => {
  return (
    <Tab.Navigator
      initialRouteName="ProfileStack"
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconSource;

          // Определите иконки для каждой вкладки
          switch (route.name) {
            case 'Users':
              iconSource = focused ? require('../assets/icons/home/active.png') : require('../assets/icons/home/inactive.png');
              break;
            case 'Map':
              iconSource = focused ? require('../assets/icons/matches/active.png') : require('../assets/icons/matches/inactive.png');
              break;
            case 'MatchesStack':
              iconSource = focused ? require('../assets/icons/chat/active.png') : require('../assets/icons/chat/inactive.png');
              break;
            case 'ProfileStack':
              iconSource = focused ? require('../assets/icons/account/active.png') : require('../assets/icons/account/inactive.png');
              break;
            default:
              iconSource = focused ? require('../assets/icons/home/active.png') : require('../assets/icons/home/inactive.png');
          }

          // Верните иконку для каждой вкладки
          return <Image source={iconSource} color={color} size={size} />;
        },
      })}
    >
      <Tab.Screen name="Users" component={UserSwipeScreen} />
      <Tab.Screen name="Map" component={MapScreen} />
      <Tab.Screen name="MatchesStack" component={MatchesStack} />
      <Tab.Screen name="ProfileStack" component={ProfileStack} />
    </Tab.Navigator>
  );
};

export default MainTabNavigator;

