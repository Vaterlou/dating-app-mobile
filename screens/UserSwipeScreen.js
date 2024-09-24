import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, Image, StyleSheet, ActivityIndicator, Alert, Animated, TouchableOpacity, ImageBackground } from 'react-native';
import Swiper from 'react-native-deck-swiper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';
import { apiUrl } from '../config';
import { getDistance } from 'geolib';
import { getSocket } from '../components/socket';
import Icon from 'react-native-vector-icons/FontAwesome5'; 
import Svg, { Path, Circle, Rect } from 'react-native-svg';

const UserSwipeScreen = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [token, setToken] = useState(null);
  const [offset, setOffset] = useState(0);  // Смещение
  const [limit] = useState(10);  // Количество пользователей на странице
  const [totalUsers, setTotalUsers] = useState(0);
  const [swipingCardIndex, setSwipingCardIndex] = useState(0);
  const [swipeValue] = useState(new Animated.Value(0));
  const socket = getSocket();

  useFocusEffect(
    useCallback(() => {
      const fetchData = async () => {
        try {
          const storedToken = await AsyncStorage.getItem('token');
          if (storedToken) {
            setToken(storedToken);
            setLoading(true);
            await fetchUsers(storedToken);
          } else {
            setError('Токен не найден');
          }
        } catch (e) {
          setError('Ошибка получения токена');
        } finally {
          setLoading(false);
        }
      };

      const listenersCount = socket.listeners('like_response').length;
      console.log(`Количество обработчиков для события "match": ${listenersCount}`);

      socket.on('like_response', (response) => {
        console.log(response);
        if (response.success) {
          Alert.alert('Успех', response.message);
        } else {
          Alert.alert('Ошибка', response.error);
        }
      });
  
      fetchData();

      return () => {
        socket.off('like_response');
        const listenersCount1 = socket.listeners('like_response').length;
        console.log(`Количество обработчиков для события "match": ${listenersCount1}`);
      };
    }, []) 
  );

  const fetchUsers = async (token) => {
    try {
      const response = await fetch(`${apiUrl}/users?radius=0&limit=${limit}&offset=${offset}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      const data = await response.json();
      // console.log(data);

      if(data.users){
        console.log(data);
        setUsers(prevUsers => [...prevUsers, ...data.users]);  // Добавляем новые данные к существующим
        setTotalUsers(data.total);  // Обновляем общее количество пользователей
        setOffset(prevOffset => prevOffset + limit);  //
      }

    } catch (error) {
      console.error('Ошибка при загрузке пользователей:', error);
      setError('Не удалось загрузить пользователей');
    }
    finally {
      setLoading(false);
    }
  };

  const loadMoreUsers = () => {
    console.log('load_more_users');
    if (users.length < totalUsers) {
      console.log('users lenght: ' + users.length);
      console.log('total users: ' + totalUsers);
      fetchUsers(token);
    }
  };

  const handleLike = (userId) => {
    try {
      socket.emit('like', { liked_user_id: userId });
    } catch (error) {
      Alert.alert('Ошибка', 'Ошибка при отправке лайка через сокет');
    }
  };

  const onSwiping = (value) => {
    swipeValue.setValue(value);
  };

  const onSwipedAborted = () => {
    swipeValue.setValue(0);
  };

  const handleSwipe = () => {
    setSwipingCardIndex(prevIndex => prevIndex + 1);  // Обновление индекса карты
    swipeValue.setValue(0);  // Сброс Animated.Value в 0

    if(swipingCardIndex >= users.length - 3)
      loadMoreUsers();
  };

  const onSwipedRight = (cardIndex) => {
    if (users[cardIndex]) {
      handleLike(users[cardIndex].id);
    }
  };

  const renderCard = (user, cardIndex) => {
    const isTopCard = swipingCardIndex == cardIndex;
    const shadowOpacity = isTopCard ? swipeValue.interpolate({
      inputRange: [0, 150],
      outputRange: [0, 1],
      extrapolate: 'clamp',
    }) : 0;

    const likeButtonScale = isTopCard ? swipeValue.interpolate({
      inputRange: [0, 150],
      outputRange: [1, 1.6],
      extrapolate: 'clamp',
    }) : 0;

    const dislikeButtonOpacity = isTopCard ? swipeValue.interpolate({
      inputRange: [0, 75],
      outputRange: [1, 0],
      extrapolate: 'clamp',
    }) : 0;
    
    return (
      <View style={styles.card}>
        <Animated.View style={[styles.animatedCard, { shadowOpacity }]}>
          <Image 
            source={{ uri: `${apiUrl}/static/profile_pics/2/${user.profile_picture}` }} 
            style={[styles.avatar]} 
          />
        </Animated.View>
        <View style={styles.infoContainer}>
          <Text style={styles.name}>{user.username}</Text>
          <Text style={styles.age}>Кайфарик по жизни</Text>
          <Icon name="map-marker-alt" style={styles.positionIcon} />
          <Text style={styles.city}>Чанггу</Text>
        </View>
        <View style={styles.swipeInterface}>
          <TouchableOpacity style={styles.shareButton}>
            <Svg width="50" height="50" viewBox="0 0 110 110" fill="none" xmlns="http://www.w3.org/2000/svg">
              <Path d="M26.2433 55.1949C25.3603 54.2375 25.3603 52.7625 26.2433 51.8051L49.9122 26.1411C51.4555 24.4677 54.25 25.5596 54.25 27.836L54.25 79.164C54.25 81.4403 51.4555 82.5322 49.9122 80.8589L26.2433 55.1949Z" fill="#B6B6B6" stroke="#B6B6B6"/>
              <Path d="M88.2813 51.0561C90.9127 51.6229 90.9127 55.3771 88.2813 55.9439L55.2765 63.0541C53.7195 63.3896 52.25 62.2029 52.25 60.6102L52.25 46.3898C52.25 44.7971 53.7195 43.6104 55.2765 43.9459L88.2813 51.0561Z" fill="#B6B6B6" stroke="#B6B6B6"/>
              <Circle cx="55" cy="55" r="52.5" stroke="#B6B6B6" strokeWidth="5"/>
            </Svg>
          </TouchableOpacity>
          <Animated.View style={[styles.dislikeButton, { opacity: dislikeButtonOpacity }]}>
            <TouchableOpacity>
              <Text style={styles.cross}>+</Text>
            </TouchableOpacity>
          </Animated.View>
          <Text style={styles.matchProbability}>99%</Text>
          <TouchableOpacity style={[styles.LikeButton, { transform: [{ scale: likeButtonScale }] }]}>
            <Icon name="heart" style={styles.heartIcon} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.ProfileButton}>
            <Svg width="50" height="50" viewBox="0 0 110 110" fill="none" xmlns="http://www.w3.org/2000/svg">
              <Path d="M55.1949 83.7567C54.2375 84.6397 52.7625 84.6397 51.8051 83.7567L26.1411 60.0878C24.4677 58.5445 25.5596 55.75 27.836 55.75L79.164 55.75C81.4403 55.75 82.5322 58.5445 80.8589 60.0878L55.1949 83.7567Z" fill="#B6B6B6" stroke="#B6B6B6"/>
              <Path d="M51.0561 21.7187C51.6229 19.0873 55.3771 19.0873 55.9439 21.7187L63.0541 54.7235C63.3896 56.2805 62.2029 57.75 60.6102 57.75L46.3898 57.75C44.7971 57.75 43.6104 56.2805 43.9459 54.7235L51.0561 21.7187Z" fill="#B6B6B6" stroke="#B6B6B6"/>
              <Circle cx="55" cy="55" r="52.5" transform="rotate(-90 55 55)" stroke="#B6B6B6" strokeWidth="5"/>
            </Svg>
          </TouchableOpacity>
        </View>
        <View style={styles.aboutMyselfContainer}>
            <Text style={styles.aboutMyself}>Я очень сильно хочу рожать!!Я очень сильно хочу рожать!!Я очень сильно хочу рожать!!Я очень сильно хочу рожать!!Я очень сильно хочу рожать!!Я очень сильно хочу рожать!!Я очень сильно хочу рожать!!Я очень сильно хочу рожать!!Я очень сильно хочу рожать!!!</Text>
        </View>
      </View>
    );
  };
  
  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#007BFF" />
      </View>
    );
  }

  if (users.length == totalUsers) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Нет доступных пользователей</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.filterButton}>
        <Svg width="40" height="40" viewBox="0 0 71 59" fill="none" xmlns="http://www.w3.org/2000/svg">
          <Rect y="8.875" width="71" height="7.88889" rx="3.94444" fill="#B6B6B6"/>
          <Rect y="41.417" width="71" height="7.88889" rx="3.94444" fill="#B6B6B6"/>
          <Circle cx="58.1803" cy="12.8194" r="9.31944" fill="white" stroke="#B6B6B6" strokeWidth="7"/>
          <Circle cx="12.8194" cy="45.3614" r="9.31944" fill="white" stroke="#B6B6B6" strokeWidth="7"/>
        </Svg>
      </TouchableOpacity>
      <TouchableOpacity style={styles.inviteButton}>
        <Svg width="40" height="40" viewBox="0 0 99 69" fill="none" xmlns="http://www.w3.org/2000/svg">
          <Circle cx="66.25" cy="18" r="14.5" stroke="#B6B6B6" strokeWidth="7"/>
          <Path d="M95.5 69C95.5 52.8457 82.4043 39.75 66.25 39.75C50.0957 39.75 37 52.8457 37 69" stroke="#B6B6B6" strokeWidth="7"/>
          <Path d="M4 40.5H25.5" stroke="#B6B6B6" strokeWidth="7" strokeLinecap="round"/>
          <Path d="M15 29L15 50.5" stroke="#B6B6B6" strokeWidth="7" strokeLinecap="round"/>
        </Svg>
      </TouchableOpacity>
      <Swiper
        cards={users}
        renderCard={(user, cardIndex) => renderCard(user, cardIndex)}
        onSwiped={handleSwipe}
        onSwiping={(x) => onSwiping(x)}
        onSwipedLeft={(cardIndex) => console.log('Swiped left:', users[cardIndex].username)}
        onSwipedRight={onSwipedRight}
        onSwipedAborted={onSwipedAborted}
        cardIndex={0}
        backgroundColor={'#f8f8f8'}
        stackSize={3}
        stackSeparation={30}
        verticalSwipe={false}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center', // Центрирование по вертикали
    alignItems: 'center',  // Центрирование по горизонтали
    backgroundColor: 'white',
  },
  filterButton: {
    width: 40,
    height: 40,
    borderRadius: 30,
    zIndex: 2,
    position: 'absolute',
    left: '8%',
    top: '10%',
    //backgroundColor: '#eaeaea',
  },
  inviteButton: {
    width: 40,
    height: 40,
    borderRadius: 30,
    right: '8%',
    top: '10%',
    position: 'absolute',
    zIndex: 2,
    //backgroundColor: '#eaeaea',
  },
  card: {
    top: '10%',
    width: '100%', // Уменьшение ширины карты до 50%
    height: '65%', // Уменьшение высоты карты до 50%
    backgroundColor: 'white',
    alignItems: 'center', // Центрирование содержимого карты
    justifyContent: 'center', // Центрирование содержимого карты
    marginTop: '15%',
    //overflow: 'hidden', // Скрыть все, что выходит за границы карты
    // borderColor: 'yellow',  // Красная граница контейнера
    // borderWidth: 2,      // Толщина границы 2 пикселя
  },
  animatedCard: {
    //borderRadius: 20,
    //backgroundColor: 'transparent',
    shadowColor: 'rgba(154, 31, 255, 1)',
    shadowOffset: { width: 3, height: 3 },
    shadowRadius: 50, // Чем больше значение, тем более размытая тень
    width: '100%',
    height: '60%',
    zIndex: 1,
    // borderColor: 'yellow',  // Красная граница контейнера
    // borderWidth: 2,      // Толщина границы 2 пикселя
  },
  avatar: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  infoContainer: {
    position: 'absolute',
    // paddingLeft: '5%',
    // paddingRight: '5%',
    bottom: '52%',
    width: '100%',
    //backgroundColor: 'white', // Полупрозрачный черный фон
    // borderColor: 'green',  // Красная граница контейнера
    // borderWidth: 2,      // Толщина границы 2 пикселя
    zIndex: 1,
  },
  swipeInterface: {
    //width: '100%',
    backgroundColor: 'white', // Полупрозрачный черный фон
    flexDirection: 'row',
    // alignItems: 'center', // Центрирование содержимого карты
    //justifyContent: 'center', // Центрирование содержимого карты
    // borderColor: 'red',  // Красная граница контейнера
    // borderWidth: 2,      // Толщина границы 2 пикселя
    marginTop: '5%',
    // marginRight: '9%',
    zIndex: 0,
  },
  shareButton: {
    width: 70,
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 30,
  },
  dislikeButton: {
    // position: 'absolute',
    // top: '5%',
    // left: '22%',
    width: 60,           // Ширина кнопки
    height: 60,          // Высота кнопки
    borderRadius: 30,    // Радиус для создания круглой формы
    backgroundColor: 'black',  // Черный фон кнопки
  },
  cross: {
    color: 'white',      // Белый цвет крестика
    fontSize: 50,        // Размер крестика
    transform: [{ rotate: '45deg' }],
    left: '21%',
    top: '10%', 
  },
  matchProbability: {
    // position: 'absolute',
    // top: '5%',
    // left: '39%',
    fontSize: 50, // Уменьшение размера шрифта возраста
    color: 'white',
    textShadowColor: 'rgba(154, 31, 255, 1)',
    // textShadowOffset: { width: 3, height: 3 },
    textShadowRadius: 3,
    fontWeight: '700', // Толщина шрифта (полужирный)
  },
  LikeButton: {
    // position: 'absolute',
    // top: '5%',
    // left: '69%',
    width: 60,           // Ширина кнопки
    height: 60,          // Высота кнопки
    borderRadius: 30,    // Радиус для создания круглой формы
    backgroundColor: 'rgba(154, 31, 255, 1)',
    justifyContent: 'center',  // Центрирование содержимого по вертикали
    alignItems: 'center',      // Центрирование содержимого по горизонтали
  },
  ProfileButton: {
    width: 70,
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 30,
    //backgroundColor: '#eaeaea',
  },
  positionIcon: {
    position: 'absolute',
    color: 'white',      // Белый цвет сердечка
    fontSize: 28,        // Размер иконки
    right: '10%',
    top: '2%',
  },
  city: {
    position: 'absolute',
    bottom: '20%',
    right: '6%',
    fontSize: 17, // Уменьшение размера шрифта имени
    fontWeight: '120',
    color: 'white', // Белый цвет текста
  },
  heartIcon: {
    color: 'white',      // Белый цвет сердечка
    fontSize: 28,        // Размер иконки
  },
  aboutMyselfContainer: {
    paddingTop: '3%',
    // top: '15%',
    // left: '6%',
    // borderColor: 'red',  // Красная граница контейнера
    // borderWidth: 2,      // Толщина границы 2 пикселя
    overflow: 'hidden', // Скрыть все, что выходит за границы карты
    width: '90%',
    height: '50%',
  },
  aboutMyself: {
    fontSize: 17, // Уменьшение размера шрифта имени
    fontWeight: '120',
    color: 'black',
  },
  name: {
    fontSize: 26, // Уменьшение размера шрифта имени
    fontWeight: 'bold',
    color: '#fff', // Белый цвет текста
    paddingLeft:'3%',
  },
  age: {
    fontSize: 17, // Уменьшение размера шрифта возраста
    fontWeight: 'medium',
    color: '#fff', // Белый цвет текста
    paddingLeft:'3%',
    paddingBottom:'3%',
  },
  distance: {
    fontSize: 16, // Уменьшение размера шрифта возраста
    fontWeight: 'bold',
    color: '#fff', // Белый цвет текста
  },
  errorText: {
    fontSize: 25,
    color: 'red',
    textAlign: 'center',
    justifyContent: 'center',
  },
});

export default UserSwipeScreen;
