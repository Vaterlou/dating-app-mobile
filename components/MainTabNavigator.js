import React, { useState, useEffect, useCallback } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useIsFocused } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import ProfileScreen from './../screens/ProfileScreen';
import EditProfileScreen from './../screens/EditProfileScreen';
import UserSwipeScreen from './../screens/UserSwipeScreen';
import MatchsListsScreen from './../screens/MatchsListsScreen';
import ChatScreen from './../screens/ChatScreen';
import MapScreen from './../screens/MapScreen';
import Svg, { Path, Circle } from 'react-native-svg';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { apiUrl, wsURL } from '../config';
import LikesScreen from '../screens/LikesScreen';
import { initializeSocket } from './socket'; 

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

// Определяем компоненты иконок с Path
const SwipeIcon = ({ size, focused }) => (
  <Svg width={size * 1.3} height={size  * 1.3} viewBox="0 0 104 57" fill="none" xmlns="http://www.w3.org/2000/svg">
    <Path d="M43.0564 10.0273C38.9105 6.27911 33.4357 4 27.4338 4C14.4917 4 4 14.5977 4 27.6705C4 40.7434 14.4917 51.3411 27.4338 51.3411C33.4357 51.3411 38.9105 49.062 43.0564 45.3138" stroke={focused ? '#9A1FFF' : '#B6B6B6'} strokeWidth="7" strokeLinecap="round"/>
    <Path d="M60.5134 46.4974C64.6907 50.2455 70.2071 52.5247 76.2544 52.5247C89.2946 52.5247 99.8657 41.927 99.8657 28.8541C99.8657 15.7812 89.2946 5.18357 76.2544 5.18357C70.2071 5.18357 64.6907 7.46267 60.5134 11.2108C57.7519 13.4929 53.7082 22.9365 52.2287 28.8541C50.7493 34.7718 45.3248 44.2153 41.8729 46.4974" stroke={focused ? '#9A1FFF' : '#B6B6B6'} strokeWidth="7" strokeLinecap="round"/>
  </Svg>
);

const InterestingIcon = ({ size, focused }) => (
  <Svg width={size} height={size} viewBox="0 0 63 69" fill="none" xmlns="http://www.w3.org/2000/svg">
    <Path fillRule="evenodd" clipRule="evenodd" d="M57.3344 14.1766H19.4196L19.4196 62.9087H57.3344V14.1766ZM19.4196 8.86035C16.3552 8.86035 13.8711 11.2405 13.8711 14.1766V62.9087C13.8711 65.8448 16.3552 68.225 19.4196 68.225H57.3344C60.3988 68.225 62.8829 65.8448 62.8829 62.9087V14.1766C62.8829 11.2405 60.3988 8.86035 57.3344 8.86035H19.4196Z" fill={focused ? '#9A1FFF' : '#B6B6B6'}/>
    <Path d="M0 5.31623C0 2.38016 2.48415 0 5.54851 0H43.4633C46.5277 0 49.0118 2.38016 49.0118 5.31623V54.0484C49.0118 56.9844 46.5277 59.3646 43.4633 59.3646H5.54851C2.48415 59.3646 0 56.9844 0 54.0484V5.31623Z" fill={focused ? '#9A1FFF' : 'white'}/>
    <Path fillRule="evenodd" clipRule="evenodd" d="M43.4633 5.31623H5.54851L5.54851 54.0484H43.4633V5.31623ZM5.54851 0C2.48415 0 0 2.38016 0 5.31623V54.0484C0 56.9844 2.48415 59.3646 5.54851 59.3646H43.4633C46.5277 59.3646 49.0118 56.9845 49.0118 54.0484V5.31623C49.0118 2.38016 46.5277 0 43.4633 0H5.54851Z" fill={focused ? '#9A1FFF' : '#B6B6B6'}/>
  </Svg>
);

const LikesIcon = ({ size, focused }) => (
  <Svg width={size} height={size} viewBox="0 0 77 71" fill="none" xmlns="http://www.w3.org/2000/svg">
    <Path d="M9.1351 36.1759L11.7198 33.816L9.1351 36.1759ZM67.8652 36.1761L65.2805 33.8162L67.8652 36.1761ZM67.8594 36.157L70.4177 38.5456L67.8594 36.157ZM40.7157 65.9113L38.131 63.5514L40.7157 65.9113ZM36.2848 65.9113L38.8695 63.5514L36.2848 65.9113ZM41.2391 8.7807L38.9226 6.15698L41.2391 8.7807ZM9.14077 36.1573L6.58258 38.546L9.14077 36.1573ZM11.699 33.7687C9.09109 30.9757 7.5 27.235 7.5 23.1149H0.5C0.5 29.0777 2.81233 34.5081 6.58258 38.546L11.699 33.7687ZM7.5 23.1149C7.5 14.491 14.491 7.5 23.1149 7.5V0.5C10.625 0.5 0.5 10.625 0.5 23.1149H7.5ZM23.1149 7.5C27.0782 7.5 30.6893 8.97206 33.4443 11.4044L38.0772 6.15698C34.0924 2.63879 28.8491 0.5 23.1149 0.5V7.5ZM43.5556 11.4044C46.3106 8.97206 49.9216 7.5 53.885 7.5V0.5C48.1507 0.5 42.9075 2.63879 38.9226 6.15698L43.5556 11.4044ZM53.885 7.5C62.5088 7.5 69.4999 14.491 69.4999 23.1149H76.4999C76.4999 10.625 66.3748 0.5 53.885 0.5V7.5ZM69.4999 23.1149C69.4999 27.2348 67.9089 30.9754 65.3012 33.7684L70.4177 38.5456C74.1877 34.5078 76.4999 29.0775 76.4999 23.1149H69.4999ZM43.3004 68.2713L70.4499 38.5361L65.2805 33.8162L38.131 63.5514L43.3004 68.2713ZM6.5504 38.5359L33.7001 68.2713L38.8695 63.5514L11.7198 33.816L6.5504 38.5359ZM11.7198 33.816C13.5154 35.7826 12.5393 38.9545 9.94876 39.5714L8.32715 32.7619C5.72823 33.3808 4.74903 36.5629 6.5504 38.5359L11.7198 33.816ZM67.0513 39.5713C64.4605 38.9542 63.4855 35.7822 65.2805 33.8162L70.4499 38.5361C72.251 36.5635 71.2727 33.381 68.6733 32.7618L67.0513 39.5713ZM65.3012 33.7684C63.4668 35.733 64.4346 38.948 67.0513 39.5713L68.6733 32.7618C71.2814 33.383 72.246 36.5874 70.4177 38.5456L65.3012 33.7684ZM38.131 63.5514C38.3293 63.3342 38.6712 63.3342 38.8695 63.5514L33.7001 68.2713C36.2776 71.0943 40.7229 71.0943 43.3004 68.2713L38.131 63.5514ZM33.4443 11.4044C36.2806 13.9086 40.7193 13.9086 43.5556 11.4044L38.9226 6.15698C38.8707 6.20282 38.729 6.28253 38.4999 6.28253C38.2708 6.28253 38.1292 6.20282 38.0772 6.15698L33.4443 11.4044ZM6.58258 38.546C4.75394 36.5875 5.71896 33.383 8.32715 32.7619L9.94876 39.5714C12.5654 38.9483 13.5335 35.7334 11.699 33.7687L6.58258 38.546Z" stroke={focused ? '#9A1FFF' : '#B6B6B6'} fill={focused ? '#9A1FFF' : '#B6B6B6'}/>
  </Svg>
);

const MatchesIcon = ({ size, focused }) => (
  <Svg width={size} height={size} viewBox="0 0 82 74" fill="none" xmlns="http://www.w3.org/2000/svg">
    <Path d="M66.1846 52.2104L64.1918 49.3331L62.1671 50.7354L62.8034 53.1147L66.1846 52.2104ZM50.5284 58.6625L52.5401 55.7984L51.3163 54.9388L49.8492 55.229L50.5284 58.6625ZM65.1752 68.9501L67.1869 66.086L65.1752 68.9501ZM69.7977 65.7201L66.4165 66.6244L69.7977 65.7201ZM74.606 31.7897C74.606 38.44 70.8299 44.7355 64.1918 49.3331L68.1774 55.0877C76.2005 49.5308 81.606 41.287 81.606 31.7897H74.606ZM41.053 7.5C50.6008 7.5 59.11 10.4069 65.1534 14.9394C71.1957 19.4711 74.606 25.4645 74.606 31.7897H81.606C81.606 22.7672 76.7217 14.8656 69.3534 9.33943C61.9862 3.81404 51.9689 0.5 41.053 0.5V7.5ZM7.5 31.7897C7.5 25.4645 10.9103 19.4711 16.9526 14.9394C22.9959 10.4069 31.5052 7.5 41.053 7.5V0.5C30.137 0.5 20.1198 3.81404 12.7526 9.33943C5.38431 14.8656 0.5 22.7672 0.5 31.7897H7.5ZM41.053 56.0795C31.5052 56.0795 22.9959 53.1726 16.9526 48.64C10.9103 44.1083 7.5 38.115 7.5 31.7897H0.5C0.5 40.8123 5.38431 48.7139 12.7526 54.24C20.1198 59.7654 30.137 63.0795 41.053 63.0795V56.0795ZM49.8492 55.229C47.0497 55.7828 44.1014 56.0795 41.053 56.0795V63.0795C44.5548 63.0795 47.9581 62.7388 51.2076 62.096L49.8492 55.229ZM48.5167 61.5266L63.1635 71.8142L67.1869 66.086L52.5401 55.7984L48.5167 61.5266ZM63.1635 71.8142C68.132 75.304 74.7475 70.6813 73.1788 64.8158L66.4165 66.6244C66.4017 66.5689 66.3953 66.4407 66.4497 66.3034C66.4955 66.1878 66.5615 66.1214 66.6131 66.0853C66.6648 66.0493 66.7498 66.0102 66.8741 66.0069C67.0217 66.003 67.1399 66.053 67.1869 66.086L63.1635 71.8142ZM73.1788 64.8158L69.5658 51.3061L62.8034 53.1147L66.4165 66.6244L73.1788 64.8158Z" stroke={focused ? '#9A1FFF' : '#B6B6B6'} fill={focused ? '#9A1FFF' : '#B6B6B6'}/>
  </Svg>
);

const ProfileIcon = ({ size, focused }) => (
  <Svg width={size} height={size} viewBox="0 0 66 69" fill="none" xmlns="http://www.w3.org/2000/svg">
  <Circle cx="32.75" cy="18" r="14.5" stroke={focused ? '#9A1FFF' : '#B6B6B6'}  strokeWidth="7"/>
  <Path d="M62 69C62 52.8457 48.9043 39.75 32.75 39.75C16.5957 39.75 3.5 52.8457 3.5 69" stroke={focused ? '#9A1FFF' : '#B6B6B6'} strokeWidth="7"/>
  </Svg>
);

// Основной навигационный таб
const MainTabNavigator = () => {

  const [newLikesCount, setNewLikesCount] = useState(0);
  const [token, setToken] = useState(null);
  const isFocused = useIsFocused(); // Проверяем, активен ли экран
  

  const resetLikes = useCallback(() => {
    if(newLikesCount != 0)
      setNewLikesCount(0); // Сброс счетчика лайков
  }, []); 

  const getToken = async () => {
    try {
      const storedToken = await AsyncStorage.getItem('token');
      if (storedToken) {
        setToken(storedToken);
      } else {
        setError('Токен не найден');
      }
    } catch (e) {
      setError('Ошибка получения токена');
    }
  };

  useEffect(() => {
    // Подключаемся к вебсокет-серверуr
    if(token) {
      const socket  = initializeSocket(wsURL, token);  // Инициализация сокета при монтировании компонента
      socket.connect();
      console.log('socket connected');
      // Слушаем событие "new_like" с сервера
      socket.on('new_like', (data) => {
        console.log('New like received:', data);
        setNewLikesCount((newLikesCount) => newLikesCount + 1); // обновляем количество лайков
      });

      socket.on('new_likes', (data) => {
        console.log('All likes received:', data);
        setNewLikesCount(data.new_likes); // обновляем количество лайков
      });

    // Очищаем соединение при размонтировании компонента
      return () => {
        socket.disconnect();
      };
    }
  }, [token]);

  // useEffect(() => {
  //   if (isFocused && token) { // Проверяем, что экран активен и есть токен
  //     fetchNewLikesCount(token);
  //   }

  //   const interval = setInterval(() => {
  //     if (isFocused && token) { // Обновляем данные только если экран активен
  //       fetchNewLikesCount(token);
  //     }
  //   }, 10000); // запрос каждые 10 секунд

  //   return () => clearInterval(interval); // Очищаем интервал при размонтировании
  // }, [isFocused, token]); // Добавляем isFocused в зависимости

  useEffect(() => {
    getToken(); // Получаем токен при монтировании компонента
  }, []);

  return (
    <Tab.Navigator
      initialRouteName="Users"
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, size }) => {
          let IconComponent;

          // Определяем иконки для каждой вкладки
          switch (route.name) {
            case 'Users':
              IconComponent = SwipeIcon;
              break;
            case 'Likes':
              IconComponent = LikesIcon;
              break;
            case 'Interesting':
              IconComponent = InterestingIcon;
              break;
            case 'MatchesStack':
              IconComponent = MatchesIcon;
              break;
            case 'ProfileStack':
              IconComponent = ProfileIcon;
              break;
            default:
              IconComponent = SwipeIcon;
          }

          // Возвращаем компонент SVG с Path для каждой вкладки
          return <IconComponent size={size} focused={focused} />;
        },
        tabBarActiveTintColor: '#9A1FFF',
        tabBarInactiveTintColor: '#888',
        tabBarShowLabel: false, // Убираем текст под иконками
      })}
    >
      <Tab.Screen name="MatchesStack" component={MatchesStack} />
      <Tab.Screen 
        name="Likes" 
        options={{
          tabBarBadge: newLikesCount > 0 ? newLikesCount : null, // отображаем, только если лайки > 0
          tabBarBadgeStyle: {
            backgroundColor: '#9A1FFF', // Устанавливаем цвет фона баджа
            color: '#FFFFFF',            // Цвет текста внутри баджа (белый)
          },
        }} 
      >
        {(props) => <LikesScreen {...props} resetLikes={resetLikes} />}
      </Tab.Screen>
      <Tab.Screen name="Users" component={UserSwipeScreen} options={{ headerShown: false }} />
      <Tab.Screen name="Interesting" component={MapScreen} />
      <Tab.Screen name="ProfileStack" component={ProfileStack} />
    </Tab.Navigator>
  );
};

export default MainTabNavigator;
