import AsyncStorage from '@react-native-async-storage/async-storage';

export const saveJWToken = async (token) => {
  try {
    await AsyncStorage.setItem('token', token);
  } catch (e) {
    console.log('Ошибка при сохранении токена', e);
  }
};

export const saveUserId = async (user_id) => {
  try {
    await AsyncStorage.setItem('user_id', String(user_id));
  } catch (e) {
    console.log('Ошибка при сохранении юзер id', e);
  }
};

export const getJWToken = async () => {
    const storedToken = await AsyncStorage.getItem('token');
    return storedToken;
};

export const getUserId = async () => {
  const storedUser = await AsyncStorage.getItem('user_id');
  return storedUser;
};