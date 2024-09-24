import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert, Image } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { apiUrl } from '../config';
import { launchImageLibrary } from 'react-native-image-picker';

const EditProfileScreen = ({ navigation }) => {
  const [bio, setBio] = useState('');
  const [age, setAge] = useState('');
  const [loading, setLoading] = useState(false);
  const [avatar, setAvatar] = useState(null); // Добавлено состояние для аватара
  const [currentUserId, setCurrentUserId] = useState(null); 

  const getUserId = async () => {
    try {
      const storedUserId = await AsyncStorage.getItem('user_id');
      if (storedUserId) {
        setCurrentUserId(storedUserId);
      }
    } catch (e) {
      setError('Ошибка получения ID пользователя');
    }
  };

  useEffect(() => {
    getUserId();
  }, []);

  const handleSave = async () => {
    const token = await AsyncStorage.getItem('token');
    if (token) {
      setLoading(true);

      const formData = new FormData();
      formData.append('bio', bio);
      formData.append('age', age);

      if(avatar){
        formData.append('avatar', {
          uri: avatar.uri,
          type: avatar.type,
          name: avatar.filename == undefined ? "1.jpg" : avatar.filename,
        });
      }
      
      fetch(`${apiUrl}/profile`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formData,
      })
        .then(response => response.json())
        .then(data => {
          if (!data.error) {
            Alert.alert('Профиль обновлен', data.message);
            navigation.navigate('Profile', { userId: currentUserId });
          } else {
            Alert.alert('Ошибка', data.error);
          }
          setLoading(false);
        })
        .catch(error => {
          console.error(error);
          Alert.alert('Ошибка', 'Произошла ошибка при обновлении профиля');
          setLoading(false);
        });
    }
  };

  const chooseImage = () => {
    launchImageLibrary({}, (response) => {
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.errorCode) {
        console.log('ImagePicker Error: ', response.errorCode);
      } else {
        setAvatar(response.assets[0]);
      }
    });
  };

  return (
    <View style={styles.container}>
      {avatar && (
        <Image
          source={{ uri: avatar.uri }}
          style={styles.avatar}
        />
      )}
      <Button title="Выбрать аватар" onPress={chooseImage} />
      <Text style={styles.label}>Биография</Text>
      <TextInput
        style={styles.input}
        placeholder="Введите биографию"
        value={bio}
        onChangeText={setBio}
      />
      <Text style={styles.label}>Возраст</Text>
      <TextInput
        style={styles.input}
        placeholder="Введите возраст"
        value={age}
        onChangeText={setAge}
        keyboardType="numeric"
      />
      <Button title="Сохранить" onPress={handleSave} disabled={loading} />
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
  label: {
    fontSize: 18,
    color: '#333',
    marginBottom: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    fontSize: 18,
    borderRadius: 5,
    marginBottom: 20,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 20,
  },
});

export default EditProfileScreen;
