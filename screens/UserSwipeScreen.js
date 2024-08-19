import React, { useState, useEffect } from 'react';
import { View, Text, Image, StyleSheet, ActivityIndicator, Alert } from 'react-native';
import Swiper from 'react-native-deck-swiper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { apiUrl } from '../config';

const UserSwipeScreen = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [token, setToken] = useState(null);

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

  const onSwipedRight = (cardIndex) => {
    if (users[cardIndex]) {
      handleLike(users[cardIndex].id);
    }
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
        renderCard={(user) => (
          <View style={styles.card}>
            <Image source={{ uri: `${apiUrl}/static/profile_pics/${user.profile_picture}` }} style={styles.avatar} />
            <Text style={styles.name}>{user.username}</Text>
            <Text style={styles.age}>{user.age} лет</Text>
          </View>
        )}
        onSwipedLeft={(cardIndex) => console.log('Swiped left:', users[cardIndex].username)}
        onSwipedRight={onSwipedRight}
        cardIndex={0}
        backgroundColor={'#f8f8f8'}
        stackSize={3}
        verticalSwipe={false}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f8f8',
  },
  card: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 10,
    elevation: 4,
    padding: 20,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 10,
  },
  name: {
    fontSize: 22,
    fontWeight: 'bold',
  },
  age: {
    fontSize: 18,
    color: '#666',
  },
  errorText: {
    fontSize: 18,
    color: 'red',
    textAlign: 'center',
  },
});

export default UserSwipeScreen;
