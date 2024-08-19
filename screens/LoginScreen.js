import React, { useState } from 'react';
import { View, Alert, StyleSheet } from 'react-native';
import { Input, Button, Text, ThemeProvider } from 'react-native-elements';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { apiUrl } from '../config';

const theme = {
  Button: {
    buttonStyle: {
      backgroundColor: '#6200ee',
    },
    titleStyle: {
      color: '#ffffff',
    },
  },
  Input: {
    containerStyle: {
      marginBottom: 10,
    },
    inputStyle: {
      backgroundColor: '#ffffff',
      borderRadius: 5,
      paddingHorizontal: 10,
    },
  },
};

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

const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleRegister = () => {
    navigation.navigate('Signup');
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
          navigation.navigate('MainTabs', {
            screen: 'ProfileStack',
            params: {
              screen: 'Profile',
              params: { 
                userId: data.user_id
              },
            },
          });
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
    <ThemeProvider theme={theme}>
      <View style={styles.container}>
        <Text h3 style={styles.title}>Login</Text>
        <Input
          placeholder="Email"
          value={email}
          onChangeText={text => setEmail(text)}
        />
        <Input
          placeholder="Password"
          value={password}
          onChangeText={text => setPassword(text)}
          secureTextEntry
        />
        <Button title="Login" onPress={handleLogin} />
        <Button
          title="Singup"
          type="outline"
          onPress={handleRegister}
          containerStyle={styles.registerButton}
        />
      </View>
    </ThemeProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  title: {
    marginBottom: 20,
    textAlign: 'center',
  },
  registerButton: {
    marginTop: 10,
  },
});

export default LoginScreen;
