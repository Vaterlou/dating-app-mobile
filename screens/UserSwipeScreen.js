import React, { useState, useEffect } from 'react';
import { View, Text, Image, StyleSheet, ActivityIndicator, Alert, Animated } from 'react-native';
import Swiper from 'react-native-deck-swiper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { apiUrl } from '../config';
import { getDistance } from 'geolib';

const UserSwipeScreen = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [token, setToken] = useState(null);
  const [swipingCardIndex, setSwipingCardIndex] = useState(0);
  const [swipeValue] = useState(new Animated.Value(0));

  useEffect(() => {
    const getToken = async () => {
      try {
        const storedToken = await AsyncStorage.getItem('token');
        if (storedToken) {
          setToken(storedToken);
          fetchUsers(storedToken);
        } else {
          setError('Токен не найден');
          setLoading(false);
        }
      } catch (e) {
        setError('Ошибка получения токена');
        setLoading(false);
      }
    };

    getToken();
  }, []);

  const interpolateBackgroundColor = swipeValue.interpolate({
    inputRange: [-150, 0, 150],
    outputRange: ['rgba(255, 0, 0, 0.5)', 'rgba(132, 38, 135, 0.5)', 'rgba(0, 255, 0, 0.5)'],
    extrapolate: 'clamp',
  });

  const interpolateOpacity = swipeValue.interpolate({
    inputRange: [-150, 0, 150],
    outputRange: [0.4, 1, 0.4], // Прозрачность уменьшится при свайпе влево или вправо
    extrapolate: 'clamp',
  });

  const fetchUsers = async (token) => {
    try {
      const response = await fetch(`${apiUrl}/users?radius=0`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      const data = await response.json();
      setLoading(false);
  
      if(data.users)
        setUsers(data.users);

    } catch (error) {
      console.error('Ошибка при загрузке пользователей:', error);
      setError('Не удалось загрузить пользователей');
      setLoading(false);
    }
  };

  const handleLike = async (userId) => {
    try {
      const response = await fetch(`${apiUrl}/like`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ liked_user_id: userId }),
      });

      const data = await response.json();

      if (response.ok) {
        Alert.alert('Успех', data.message);
      } else {
        Alert.alert('Ошибка', data.error);
      }
    } catch (error) {
      Alert.alert('Ошибка', 'Ошибка при отправке лайка');
    }
  };

  const onSwiping = (value) => {
    swipeValue.setValue(value);
  };

  const handleSwipe = () => {
    setSwipingCardIndex(prevIndex => prevIndex + 1);  // Обновление индекса карты
    swipeValue.setValue(0);  // Сброс Animated.Value в 0
  };

  const onSwipedRight = (cardIndex) => {
    if (users[cardIndex]) {
      handleLike(users[cardIndex].id);
    }
  };

  const renderCard = (user, cardIndex) => {
    const backgroundColor = swipingCardIndex === cardIndex
      ? interpolateBackgroundColor
      : 'rgba(132, 38, 135, 0.5)'; // Цвет по умолчанию, если карта не в процессе свайпа
    const opacityImage = swipingCardIndex === cardIndex ? interpolateOpacity : 1
  
    return (
      <Animated.View style={[styles.card, { backgroundColor }]}>
        <Animated.Image 
          source={{ uri: `${apiUrl}/static/profile_pics/${user.id}/${user.profile_picture}` }} 
          style={[styles.avatar, { opacity: opacityImage }]} 
        />
        <View style={styles.infoContainer}>
          <Text style={styles.name}>{user.username}</Text>
          <Text style={styles.age}>{user.age} лет</Text>
          <Text>Расстояние: {user.distance} метров</Text>
        </View>
      </Animated.View>
    );
  };
  

  if (users.length === 0) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Нет доступных пользователей</Text>
      </View>
    );
  }

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#007BFF" />
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
      <Swiper
        cards={users}
        renderCard={(user, cardIndex) => renderCard(user, cardIndex)}
        onSwiped={handleSwipe}
        onSwiping={(x) => onSwiping(x)}
        onSwipedLeft={(cardIndex) => console.log('Swiped left:', users[cardIndex].username)}
        onSwipedRight={onSwipedRight}
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
    backgroundColor: 'rgba(132, 38, 135, 0.5)',
    // borderColor: 'red',  // Красная граница контейнера
    // borderWidth: 2,      // Толщина границы 2 пикселя
  },
  card: {
    width: '85%', // Уменьшение ширины карты до 50%
    height: '60%', // Уменьшение высоты карты до 50%
    backgroundColor: 'rgba(132, 38, 135, 0.5)', // Полупрозрачный черный фон
    borderRadius: 10,
    elevation: 4,
    alignItems: 'center', // Центрирование содержимого карты
    justifyContent: 'center', // Центрирование содержимого карты
    overflow: 'hidden', // Скрыть все, что выходит за границы карты
    left: '6%',
  },
  avatar: {
    width: '100%',
    height: '100%',
    borderRadius: 10,
  },
  infoContainer: {
    position: 'absolute',
    bottom: 0, // Расположить у нижней границы аватарки
    left: 0,
    right: 0,
    padding: 10,
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Полупрозрачный черный фон
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
  },
  name: {
    fontSize: 18, // Уменьшение размера шрифта имени
    fontWeight: 'bold',
    color: '#fff', // Белый цвет текста
  },
  age: {
    fontSize: 16, // Уменьшение размера шрифта возраста
    color: '#ccc', // Светло-серый цвет текста
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
