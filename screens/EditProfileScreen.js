import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const EditProfileScreen = ({ navigation }) => {
  const [bio, setBio] = useState('');
  const [age, setAge] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    const token = await AsyncStorage.getItem('token');
    if (token) {
      setLoading(true);
      fetch('http://127.0.0.1:8000/profile', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ bio, age }),
      })
        .then(response => response.json())
        .then(data => {
          if (data) {
            Alert.alert('Профиль обновлен');
            navigation.navigate('Profile');
          } else {
            Alert.alert('Ошибка', data.message);
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

  return (
    <View style={styles.container}>
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
});

export default EditProfileScreen;
