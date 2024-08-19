import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Image } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { apiUrl } from '../config';

const MapScreen = () => {
  const [users, setUsers] = useState([]);
  const [token, setToken] = useState(null);
  const [error, setError] = useState(null); // Добавлено состояние для ошибок

  useEffect(() => {
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

    getToken();
  }, []);

  useEffect(() => {
    if (token) {
      fetchUsers(); // Вызов fetchUsers только если токен существует
    }
  }, [token]);

  const fetchUsers = async () => {
    try {
      const response = await fetch(`${apiUrl}/users?radius=0`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      const data = await response.json();
      console.log(data);
      setUsers(data.users || []);
    } catch (error) {
      console.error('Ошибка при загрузке пользователей:', error);
      setError('Не удалось загрузить пользователей');
    }
  };

  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        initialRegion={{
          latitude: -8.61936998409111,
          longitude: 115.1483769589381,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        }}
      >
        {users.map((user) => (
          <Marker
            key={user.id}
            coordinate={{
              latitude: user.latitude,
              longitude: user.longitude,
            }}
            title={user.username}
            description={`Возраст: ${user.age}`}
          >
            <Image
              source={{ uri: `${apiUrl}/static/profile_pics/${user.profile_picture}` }}
              style={styles.avatar}
            />
          </Marker>
        ))}
      </MapView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
});

export default MapScreen;
