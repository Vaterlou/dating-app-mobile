// MainTabNavigator.js
import React from 'react';

import ProfileScreen from './../screens/ProfileScreen';
import EditProfileScreen from './../screens/EditProfileScreen';
import UserListScreen from './../screens/UsersListScreen';
// import MessagesScreen from './MessagesScreen';
// import MapScreen from './MapScreen';
// import SettingsScreen from './SettingsScreen';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

// Экран, который будет использоваться внутри таба
const ProfileStack = () => {
  return (
    <Stack.Navigator initialRouteName="Profile">
      <Stack.Screen name="Profile" component={ProfileScreen} />
      <Stack.Screen name="EditProfile" component={EditProfileScreen} /> {/* Добавьте ваш экран редактирования профиля */}
    </Stack.Navigator>
  );
};

// Основной навигационный таб
const MainTabNavigator = () => {
  return (
    <Tab.Navigator initialRouteName="Profile">
      <Tab.Screen name="Users" component={UserListScreen} />
      {/* <Tab.Screen name="Messages" component={MessagesScreen} />
      <Tab.Screen name="Map" component={MapScreen} />
      <Tab.Screen name="Settings" component={SettingsScreen} /> */}
      <Tab.Screen name="Profile" component={ProfileStack} />
    </Tab.Navigator>
  );
};

export default MainTabNavigator;
