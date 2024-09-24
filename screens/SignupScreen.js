import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, StyleSheet } from 'react-native';
import { apiUrl } from '../config';
import AsyncStorage from '@react-native-async-storage/async-storage';

const SignupScreen = ({navigation}) => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const saveToken = async (token) => {
    try {
      await AsyncStorage.setItem('token', token);
    } catch (e) {
      console.log('Ошибка при сохранении токена', e);
    }
  };
  
  const saveUserId = async (user_id) => {
    try {
      await AsyncStorage.setItem('user_id', String(user_id));
    } catch (e) {
      console.log('Ошибка при сохранении юзер id', e);
    }
  };

  const handleRegister = () => {
    fetch(`${apiUrl}/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, email, password }),
    })
      .then(response => response.json())
      .then(data => {
        if (data.message) {
          Alert.alert('Регистрация успешна!', data.message);
          saveToken(data.token);
          saveUserId(data.user_id);
          navigation.navigate('About', { userId: data.user_id });
        } else {
          Alert.alert('Ошибка регистрации', data.error);
        }
      })
      .catch(error => {
        Alert.alert('Ошибка', 'Что-то пошло не так');
        console.log(error);
      });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome to the island</Text>

      <TextInput
        style={styles.input}
        placeholder="Имя пользователя"
        value={username}
        onChangeText={setUsername}
        placeholderTextColor="#999"
      />

      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        placeholderTextColor="#999"
        keyboardType="email-address"
      />

      <TextInput
        style={styles.input}
        placeholder="Пароль"
        value={password}
        onChangeText={setPassword}
        placeholderTextColor="#999"
        secureTextEntry
      />

      <TouchableOpacity style={styles.button} onPress={handleRegister}>
        <Text style={styles.buttonText}>Signup</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
    backgroundColor: 'rgba(154, 31, 255, 1)',
  },
  title: {
    fontSize: 30,
    fontWeight: 'bold',
    color: 'white',
    left: '15%',
    top: '10%',
    position: 'absolute',
    textAlign: 'center',
  },
  input: {
    height: 50,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    marginBottom: 15,
    backgroundColor: '#fff',
  },
  button: {
    backgroundColor: '#007BFF',
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default SignupScreen;
