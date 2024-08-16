import React, { useEffect, useState } from 'react';
import { View, Text, Image, StyleSheet, Button, ActivityIndicator, Alert, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const ProfileScreen = ({ navigation }) => {
  const [userData, setUserData] = useState(null);
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
  }, []);

  useEffect(() => {
    if (token) {
      fetchProfileData(token);
    }
  }, [token]);

  const fetchProfileData = async (token) => {
    try {
      const response = await fetch('http://127.0.0.1:8000/profile', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}` // передача токена
        },
      });
      const data = await response.json();
      console.log('Полученные данные:', data);
      if (data) {
        setUserData(data);
      } else {
        setError('Не удалось загрузить данные профиля');
      }
    } catch (error) {
      setError('Произошла ошибка при загрузке данных профиля');
    } finally {
      setLoading(false);
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
        <Button title="Попробовать снова" onPress={() => {
          setLoading(true);
          fetchProfileData(token);
        }} />
      </View>
    );
  }

  if (!userData) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Данные профиля не найдены</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Image source={{ uri: `http://127.0.0.1:8000/static/profile_pics/${userData.profile_picture}` }} style={styles.avatar} />

      <Text style={styles.title}>Профиль</Text>
      <Text style={styles.text}>Биография: {userData.bio}</Text>
      <Text style={styles.text}>Возраст: {userData.age}</Text>

      <Button title="Изменить профиль" onPress={() => navigation.navigate('EditProfile')} />
      <Button
        title="Выйти"
        onPress={() => {
          AsyncStorage.removeItem('token');
          navigation.navigate('Login');
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#f8f8f8',
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    alignSelf: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20,
    textAlign: 'center',
  },
  text: {
    fontSize: 18,
    color: '#333',
    marginBottom: 10,
    textAlign: 'center',
  },
  errorText: {
    fontSize: 18,
    color: 'red',
    textAlign: 'center',
    marginBottom: 20,
  },
});

export default ProfileScreen
