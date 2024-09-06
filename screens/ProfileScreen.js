import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, Image, StyleSheet, Button, TouchableOpacity, ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';
import { apiUrl } from '../config';

const ProfileScreen = ({ navigation, route }) => {
  const { userId } = route.params;
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [token, setToken] = useState(null);
  const [currentUserId, setCurrentUserId] = useState(null); 

  useEffect(() => {
    const fetchAuthData = async () => {
      try {
        const storedToken = await AsyncStorage.getItem('token');
        const storedUserId = await AsyncStorage.getItem('user_id');
        
        if (storedToken && storedUserId) {
          setToken(storedToken);
          setCurrentUserId(storedUserId);
        } else {
          setError('Ошибка при загрузке данных аутентификации');
          setLoading(false);
        }
      } catch (e) {
        setError('Ошибка получения данных аутентификации');
        setLoading(false);
      }
    };

    fetchAuthData();
  }, []);

  useFocusEffect(
    useCallback(() => {
      if (token) {
        setLoading(true);
        fetchProfileData(token);
      }
    }, [token])
  );

  const fetchProfileData = async (token) => {
    try {
      const response = await fetch(`${apiUrl}/profile?user_id=${userId}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
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
      <Image source={{ uri: `${apiUrl}/static/profile_pics/${currentUserId}/${userData.profile_picture}` }} style={styles.avatar} />
      <Text style={styles.title}>Профиль</Text>
      <Text style={styles.text}>Биография: {userData.bio}</Text>
      <Text style={styles.text}>Возраст: {userData.age}</Text>

      {currentUserId == userId && (
        <Button title="Изменить профиль" onPress={() => navigation.navigate('EditProfile')} />
      )}
      <TouchableOpacity style={styles.exitBtn} onPress={() => {
          AsyncStorage.removeItem('token');
          AsyncStorage.removeItem('user_id');
          navigation.navigate('Login');
        }}>
        <Text style={styles.textExitBtn}>Выйти</Text> 
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f8f8',
    textAlign: 'center',
  },
  avatar: {
    width: '100%',
    height: '50%',
  },
  exitBtn: {
   backgroundColor: 'red',
   textAlign: 'center',
   borderColor: 'red',  // Красная граница контейнера
   borderWidth: 2,     // Толщина границы 2 пикселя
   margin: 100,
  },
  textExitBtn: {
    fontSize: 25,
    textAlign: 'center',
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

export default ProfileScreen;
