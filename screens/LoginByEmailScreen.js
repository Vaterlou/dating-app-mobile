import React, { useState, useEffect } from 'react';
import { View, Alert, StyleSheet, Image, TouchableOpacity, TextInput } from 'react-native';
import { Input, Button, Text, ThemeProvider } from 'react-native-elements';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { GoogleSignin, statusCodes } from '@react-native-google-signin/google-signin';
import { apiUrl } from '../config';
import { Border, FontSize, FontFamily, Color } from "../GlobalStyles";
import AboutMyselfScreen from './AboutMyselfScreen';

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

const LoginByEmailScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  backToLoginScreen = () => {
    navigation.navigate('Login');
  };

  const handleLogin = () => {
    fetch(`${apiUrl}/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    })
    .then(response => {
      console.log('Ответ от сервера:', response); // Выводим объект ответа
      return response.json();
    })
      .then(data => {
        if (!data.error) {
          Alert.alert('Вход успешен!');
          saveToken(data.token);
          saveUserId(data.user_id);

          if(data.go_to_profile) {
            navigation.navigate('MainTabs', {
              screen: 'ProfileStack',
              params: {
                screen: 'Profile',
                params: { 
                  userId: data.user_id
                },
              },
            });
          }
          else
            navigation.navigate('About', { userId: data.user_id });
          
        } else {
          Alert.alert('Ошибка входа', data.error);
        }
      })
      .catch(error => {
        console.error('Ошибка:', error); 
        Alert.alert('Ошибка', 'Что-то пошло не так');
      });
  };

  return (
    <View style={styles.loginByEmailScreen}>
      <Text style={styles.welcomeText}>Welcome to the island</Text>
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <TextInput
        style={styles.input}
        placeholder="Пароль"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        autoCapitalize="none"
      />
      <TouchableOpacity onPress={handleLogin} style={styles.btnLogin}>
        <Text style={styles.btnLoginText}>Login</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate('Signup')} style={styles.btnSignup}>
        <Text style={styles.btnSignupText}>SignUp</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  loginByEmailScreen: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(154, 31, 255, 1)',
  },
  welcomeText: {
    color: '#fff',
    fontSize: 25,
  },
  input: {
    width: '80%',
    height: 50,
    backgroundColor: '#fff',
    borderRadius: 10,
    paddingHorizontal: 15,
    marginVertical: 10,
    fontSize: 16,
  },
  btnLogin: {
    width: '80%',
    height: 50,
    backgroundColor: '#4CAF50',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
  },
  btnLoginText: {
    color: '#fff',
    fontSize: 18,
  },
  btnSignup: {
    marginTop: 20,
  },
  btnSignupText: {
    color: '#fff',
    fontSize: 16,
    textDecorationLine: 'underline',
  },
});

export default LoginByEmailScreen;
