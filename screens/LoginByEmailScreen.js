import React, { useState, useEffect } from 'react';
import { View, Alert, StyleSheet, Image, TouchableOpacity, TextInput } from 'react-native';
import { Input, Button, Text, ThemeProvider } from 'react-native-elements';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { GoogleSignin, statusCodes } from '@react-native-google-signin/google-signin';
import { apiUrl } from '../config';
import { Border, FontSize, FontFamily, Color } from "../GlobalStyles";

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
    <View style={styles.screen2}>
    <View style={styles.loginByEmailContainer}>
      <Image
        style={[styles.trademarkIcon, styles.iconLayout]}
        resizeMode="cover"
        source={require("../assets/trademark.png")}
      />
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />
      <TouchableOpacity onPress={handleLogin} style={styles.btnLoginByEmail}>
        <Text style={styles.loginText}>Login</Text>
      </TouchableOpacity>
    </View>
    </View>
  );
};

const styles = StyleSheet.create({
  iconLayout: {
    maxHeight: "100%",
    maxWidth: "100%",
    overflow: "hidden",
  },
  trademarkIcon: {
    height: "12.32%",
    width: "28.96%",
    top: "8.13%",
    right: "35.57%",
    bottom: "79.56%",
    left: "35.47%",
    position: "absolute",
  },
  container: {
    backgroundColor: Color.colorMediumpurple,
    borderRadius: Border.br_mini,
    height: "100%",
    bottom: "0%",
    top: "0%",
    left: "0%",
    right: "0%",
    position: "absolute",
    width: "100%",
  },
  btnLoginByEmail: {
    backgroundColor: '#6200ee',
    padding: 15,
    borderRadius: 10,
    marginTop: 20,
  },
  btnBack: {
    backgroundColor: '#6200ee',
    padding: 10,
    borderRadius: 10,
    marginTop: 20,
    marginLeft: -150
  },
  screen2: {
    borderRadius: Border.br_xl,
    backgroundColor: Color.colorBlack,
    flex: 1,
    height: 812,
    overflow: "hidden",
    width: "100%",
  },
  input: {
    width: '100%',
    borderColor: '#bbb',
    borderWidth: 1,
    padding: 10,
    marginVertical: 10,
    borderRadius: 5,
  },
  loginByEmailContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
});

export default LoginByEmailScreen;
