import React, { useState, useEffect, useCallback} from 'react';
import { View, Text, Image, FlatList, StyleSheet, ActivityIndicator, Button } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { apiUrl } from '../config';

const LikesScreen = ( {navigation, resetLikes} ) => {
  const [users, setUsers] = useState([]);
  const [likes, setLikes] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [token, setToken] = useState(null);

  useEffect(() => {
    const getToken = async () => {
      try {
        const storedToken = await AsyncStorage.getItem('token');
        if (storedToken) {
          setToken(storedToken);
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
  }, [token]);

  useFocusEffect(
    useCallback(() => {
      if (token) {
        resetLikes();
        fetchUsers(token);
      }
    }, [token])
  );

  const fetchUsers = async (token) => {
    try {
      const response = await fetch(`${apiUrl}/matches`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}` // передача токена
      },
      });
      const data = await response.json();
      console.log('Полученные данные:', data);
      setUsers(data.matches);
      setLoading(false);
    } catch (error) {
      console.error('Ошибка при загрузке пользователей:', error);
      setError('Не удалось загрузить пользователей');
      setLoading(false);
    }
  };

  const renderItem = ({ item }) => (
    <View style={styles.itemContainer}>
      <Image source={{ uri: `${apiUrl}/static/profile_pics/${item.id}/${item.profile_picture}` }} style={styles.avatar} />
      <View style={styles.textContainer}>
        <Text style={styles.name}>{item.username}</Text>
        <Text style={styles.age}>{item.age} лет</Text>
      </View>
      <Button
        title="Написать"
        onPress={() => navigation.navigate('Chat', { recipientId: item.id, recipientName: item.username })}
      />
      <Button
        title="Профиль"
        onPress={() => navigation.navigate('ProfileUser', { userId: item.id })}
        color="#841584" // Можно задать цвет кнопки
      />
    </View>
  );

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
      
      const data = await response.json(); // Парсинг JSON-ответа

      if (response.ok) {
        console.log(data);
        setLikes(prevLikes => ({ ...prevLikes, [userId]: !prevLikes[userId] }));
      } else {
        console.error('Ошибка при отправке лайка', data);
      }
    } catch (error) {
      console.error('Ошибка при отправке лайка:', error);
    }
  };

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
    <FlatList
      data={users}
      renderItem={renderItem}
      keyExtractor={item => item.id.toString()} // Предположим, что у пользователя есть уникальный id
    />
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f8f8f8',
  },
  itemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 10,
  },
  textContainer: {
    flex: 1,
  },
  name: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  age: {
    fontSize: 16,
    color: '#666',
  },
  errorText: {
    fontSize: 18,
    color: 'red',
    textAlign: 'center',
  },
});

export default LikesScreen;
