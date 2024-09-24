import React, { useState, useEffect } from 'react'; // Импорт useEffect
import { View, StyleSheet, TextInput, TouchableOpacity, Text, PermissionsAndroid, Platform, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage'; // Импорт AsyncStorage
import Geolocation from '@react-native-community/geolocation';
import { apiUrl } from '../config';

const AboutMyselfScreen = ({ navigation, route }) => {
  const [token, setToken] = useState(null);
  const [error, setError] = useState(null);
  const { userId } = route.params;
  const questions = [
    'Как вас зовут?',
    'Укажите свой пол',
    'Укажите свою дату рождения',
    'Who am I?',
    'Looking for...?',
    'Question 1',
    'Question 2',
    'Question 3'
  ];

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState(Array(questions.length).fill(''));
  const [name, setName] = useState('');
  const [gender, setGender] = useState('');
  const [birthDate, setBirthDate] = useState(new Date());
  const [latitude, setLatitude] = useState(null);
  const [longitude, setLongitude] = useState(null);

  useEffect(() => {
    const fetchAuthData = async () => {
      try {
        const storedToken = await AsyncStorage.getItem('token');
        
        if (storedToken) {
          setToken(storedToken);
        } else {
          setError('Ошибка при загрузке данных аутентификации');
        }
      } catch (e) {
        setError('Ошибка получения данных аутентификации');
      }
    };

    const requestLocationPermission = async () => {
      if (Platform.OS === 'android') {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
        );
  
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          console.log('Location permission granted');
        } else {
          console.log('Location permission denied');
          return;
        }
      }
    };

    fetchAuthData();
    requestLocationPermission();

    Geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setLatitude(latitude);
        setLongitude(longitude);
      },
      (error) => {
        console.error('Ошибка получения геопозиции', error);
      },
      { enableHighAccuracy: true, timeout: 20000, maximumAge: 1000 }
    );
  }, []);

  const calculateAge = (birthDate) => {
    const today = new Date();
    const birthYear = birthDate.getFullYear();
    const birthMonth = birthDate.getMonth();
    const birthDay = birthDate.getDate();

    let age = today.getFullYear() - birthYear;

    if (today.getMonth() < birthMonth || (today.getMonth() === birthMonth && today.getDate() < birthDay)) {
      age--;
    }

    return age;
  };

  const combineQuestionsAndAnswers = () => {
    const remainingQuestions = questions.slice(3); // Берём вопросы, начиная с 4-го элемента

    const qaObject = remainingQuestions.reduce((obj, question, index) => {
      obj[question] = answers[index + 3]; // Индекс нужно увеличить на 3, чтобы получить правильные ответы
      return obj;
    }, {});
    
    return qaObject;
  };

  const handleNext = async () => { // Добавляем async
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      try {
        const formData = {
          name,
          gender,
          birthDate: birthDate.toISOString().split('T')[0], // Преобразуем дату в формат YYYY-MM-DD
          age: calculateAge(birthDate),
          questions_answers: combineQuestionsAndAnswers(),
          latitude,
          longitude,
        };

        const response = await fetch(`${apiUrl}/create_profile`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formData),
        });
  
        const data = await response.json();
  
        if (response.ok) {
          Alert.alert('Успех', data.message);

          navigation.navigate('MainTabs', {
            screen: 'ProfileStack',
            params: {
              screen: 'Profile',
              params: { 
                userId: userId
              },
            },
          });

        } else {
          Alert.alert('Ошибка', data.error);
        }
      } catch (error) {
        Alert.alert('Ошибка', 'Ошибка при отправке данных');
      }
    }
  };

  const handleInputChange = (text) => {
    const newAnswers = [...answers];
    newAnswers[currentQuestionIndex] = text;
    setAnswers(newAnswers);
  };

  const renderQuestionInput = () => {
    switch (currentQuestionIndex) {
      case 0:
        return (
          <TextInput
            style={styles.input}
            placeholder="Введите свое имя"
            value={name}
            onChangeText={setName}
            autoCapitalize="none"
          />
        );
      case 1:
        return (
          <View style={styles.genderContainer}>
            <TouchableOpacity
              style={[
                styles.genderButton,
                gender === 'Мужчина' ? styles.genderButtonSelected : null
              ]}
              onPress={() => setGender('Мужчина')}
            >
              <Text style={styles.genderButtonText}>Мужчина</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.genderButton,
                gender === 'Женщина' ? styles.genderButtonSelected : null
              ]}
              onPress={() => setGender('Женщина')}
            >
              <Text style={styles.genderButtonText}>Женщина</Text>
            </TouchableOpacity>
          </View>
        );
      case 2:
        return (
          <TextInput
            style={styles.input}
            placeholder="YYYY-MM-DD"
            value={birthDate.toISOString().split('T')[0]}
            onChangeText={(value) => setBirthDate(new Date(value))}
          />
        );
      default:
        return (
          <TextInput
            style={styles.input}
            placeholder={questions[currentQuestionIndex]}
            value={answers[currentQuestionIndex]}
            onChangeText={handleInputChange}
            autoCapitalize="none"
          />
        );
    }
  };

  return (
    <View style={styles.AboutMyselfScreen}>
      <Text style={styles.question}>{questions[currentQuestionIndex]}</Text>
      {renderQuestionInput()}
      <TouchableOpacity onPress={handleNext} style={styles.btnNext}>
        <Text style={styles.btnNextText}>
          {currentQuestionIndex < questions.length - 1 ? 'Next' : 'Finish'}
        </Text>
      </TouchableOpacity>
    </View>
  );
};


const styles = StyleSheet.create({
  AboutMyselfScreen: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(154, 31, 255, 1)',
    paddingHorizontal: 20,
  },
  question: {
    color: '#fff',
    fontSize: 20,
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    width: '100%',
    height: 50,
    backgroundColor: '#fff',
    borderRadius: 10,
    paddingHorizontal: 15,
    marginVertical: 10,
    fontSize: 16,
  },
  btnNext: {
    width: '100%',
    height: 50,
    backgroundColor: '#4CAF50',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
  },
  btnNextText: {
    color: '#fff',
    fontSize: 18,
  },
  genderContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  genderButton: {
    width: '48%',
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#e0e0e0',
    borderRadius: 10,
  },
  genderButtonSelected: {
    backgroundColor: '#4CAF50',
  },
  genderButtonText: {
    fontSize: 16,
    color: '#fff',
  },
});

export default AboutMyselfScreen;
