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
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

// Экран, который будет использоваться внутри таба
const ProfileStack = () => {
  return (
    <Stack.Navigator initialRouteName="Profile">
      <Stack.Screen name="Profile" component={ProfileScreen} />
      <Stack.Screen name="EditProfile" component={EditProfileScreen} />
    </Stack.Navigator>
  );
};

const MatchesStack = () => {
    return (
      <Stack.Navigator initialRouteName="Matches">
        <Stack.Screen name="Matches" component={MatchsListsScreen} />
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
        tabBarIcon: ({ color, size }) => {
          let iconName;

          // Определите иконки для каждой вкладки
          switch (route.name) {
            case 'Users':
              iconName = 'users';
              break;
            case 'Map':
              iconName = 'map';
              break;
            case 'MatchesStack':
              iconName = 'heart';
              break;
            case 'ProfileStack':
              iconName = 'user';
              break;
            default:
              iconName = 'home';
          }

          // Верните иконку для каждой вкладки
          return <Icon name={iconName} type='font-awesome' color={color} size={size} />;
        },
        tabBarActiveTintColor: '#FF6347', // Цвет активной вкладки
        tabBarInactiveTintColor: '#7f8c8d', // Цвет неактивных вкладок
        tabBarStyle: {
          backgroundColor: '#ffffff', // Цвет фона панели вкладок
          borderTopWidth: 1, // Толщина верхней границы
          borderTopColor: '#dddddd', // Цвет верхней границы
          elevation: 5, // Для Android (тень панели вкладок)
          shadowOpacity: 0.1, // Для iOS (тень панели вкладок)
          shadowOffset: { width: 0, height: 2 }, // Для iOS (смещение тени)
          shadowRadius: 4, // Для iOS (размытие тени)
        },
        tabBarLabelStyle: {
          fontSize: 14, // Размер шрифта текста вкладок
          fontWeight: 'bold', // Жирное начертание текста вкладок
        },
        tabBarIconStyle: {
          marginBottom: -5, // Смещение иконки
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

