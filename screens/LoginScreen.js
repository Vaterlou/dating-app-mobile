import React, { useState, useEffect } from 'react';
import { View, Alert, StyleSheet } from 'react-native';
import { Input, Button, Text, ThemeProvider } from 'react-native-elements';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { GoogleSignin, statusCodes } from '@react-native-google-signin/google-signin';
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

  useEffect(() => {
    GoogleSignin.configure({
      iosClientId: '185723400285-hcm6nnmi4hefsg9mukg57iioh7msn8em.apps.googleusercontent.com',
      webClientId: '185723400285-e9eejp7m7a8jmgfpfctbea4bft39ma12.apps.googleusercontent.com',
      offlineAccess: true,
    });
  }, []);

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

  const handleGoogleLogin = async () => {
    try {
      await GoogleSignin.hasPlayServices();
      const userInfo = await GoogleSignin.signIn();
      console.log('User Info:', userInfo);
      const token = userInfo.idToken;
      
      // Отправка данных на ваш сервер
      const response = await fetch(`${apiUrl}/google-login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token }),
      });
      console.log(response);
      const data = await response.json();

      if (!data.error) {
        saveToken(data.token);
        saveUserId(data.user_id);
        navigation.navigate('MainTabs');
      } else {
        Alert.alert('Ошибка', data.error);
      }
    } catch (error) {
      if (error.code === statusCodes.SIGN_IN_CANCELLED) {
        Alert.alert('Отмена', 'Вход через Google был отменен');
      } else {
        console.error(error);
        Alert.alert('Ошибка', 'Не удалось выполнить вход через Google');
      }
    }
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
        <Button title="Login with Google" onPress={handleGoogleLogin} containerStyle={styles.googleLoginButton} />
        <Button title="Singup" type="outline" onPress={handleRegister} containerStyle={styles.registerButton} />
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
  googleLoginButton: {
    marginTop: 3,
  },
  registerButton: {
    marginTop: 10,
  },
});

export default LoginScreen;
