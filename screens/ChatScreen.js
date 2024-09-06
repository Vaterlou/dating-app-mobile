import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, FlatList, StyleSheet, Image, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import Video from 'react-native-video';
import { apiUrl } from '../config';

const ChatScreen = ({ route }) => {
  const { recipientId, recipientName } = route.params; // Получаем ID и имя получателя из параметров
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [error, setError] = useState(null);
  const [token, setToken] = useState(null);
  const [media, setMedia] = useState(null);
  const [currentUserId, setCurrentUserId] = useState(null); 

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

    getUserId();
    getToken();
  }, []);

  useEffect(() => {
    if (token) {
      fetchMessages();
    }
  }, [token]);

  useEffect(() => {
    Alert.alert('Медиа загружено!', '');
  }, [media]);

  const getMediaType = (filename) => {
    const extension = filename.split('.').pop().toLowerCase();
  
    const imageExtensions = ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp'];
    const videoExtensions = ['mp4', 'mov', 'avi', 'mkv', 'webm'];
  
    if (imageExtensions.includes(extension)) {
      return 'image';
    } else if (videoExtensions.includes(extension)) {
      return 'video';
    } else {
      return null;
    }
  };
  

  const selectMedia = () => {
    const options = {
      mediaType: 'mixed', // 'photo' or 'video' or 'mixed'
      quality: 1,
    };
  
    launchImageLibrary(options, (response) => {
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.errorCode) {
        console.log('ImagePicker Error: ', response.errorCode);
      } else {
        const media = response.assets[0];
        setMedia(media);
      }
    });
  };
  
  const captureMedia = () => {
    const options = {
      mediaType: 'mixed', // 'photo' or 'video'
      quality: 1,
    };
  
    launchCamera(options, (response) => {
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.errorCode) {
        console.log('ImagePicker Error: ', response.errorCode);
      } else {
        const media = response.assets[0];
        setMedia(media);
      }
    });
  };
  

  const fetchMessages = async () => {
    try {
      const response = await fetch(`${apiUrl}/messages?recipient_id=${recipientId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      const data = await response.json();
      console.log(data);
      if(data.messages)
        setMessages(data.messages);
    } catch (error) {
      console.error('Ошибка при загрузке сообщений:', error);
    }
  };

  const sendMessage = async () => {
    if (!newMessage && !media) return;

    const formData = new FormData();
    formData.append('recipient_id', recipientId);
    formData.append('body', newMessage);

    if(media) {
      console.log('Media file:', media);
      formData.append('media', {
        uri: media.uri,
        name: media.fileName,
        type: media.type,
      });
    }

    try {
      const response = await fetch(`${apiUrl}/send_message`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formData,
      });
      const data = await response.json();
      console.log('Server response:', data);
      if (data.message) {
        setMessages([...messages, data.message]);
        setNewMessage('');
      }
      else
        console.error('Ошибка при отправке:', data.error);
    } catch (error) {
        console.error('Ошибка при отправке сообщения:', error);
    }
  };

  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    return `${date.getHours()}:${date.getMinutes().toString().padStart(2, '0')}`;
  };

  if (error) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Чат с {recipientName}</Text>
      <FlatList
        data={messages}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.message}>
            <View style={styles.messageHeader}>
              <Text style={styles.sender}>{item.sender_id === recipientId ? recipientName : 'Вы'}:</Text>
              <Text style={styles.timestamp}>{formatTime(item.timestamp)}</Text>
            </View>
            {item.body ? <Text>{item.body}</Text> : null}
            {item.media_url ? (
              getMediaType(item.media_url) == 'image' ? (
                <Image
                  source={{ uri: `${apiUrl}/static/uploads/${item.sender_id}/${item.media_url}` }}
                  style={styles.media}
                  resizeMode="contain"
                />
              ) : getMediaType(item.media_url) == 'video' ? (
                <Video
                  source={{ uri: `${apiUrl}/static/uploads/${item.sender_id}/${item.media_url}` }}
                  style={styles.videoMedia}
                  resizeMode="contain"
                />
              ) : null
            ) : null}
          </View>
        )}
      />
      <TextInput
        style={styles.input}
        value={newMessage}
        onChangeText={setNewMessage}
        placeholder="Напишите сообщение..."
      />
      <Button title="Отправить" onPress={sendMessage} />
      <View style={styles.buttonContainer}>
        <Button title="Выбрать изображение или видео" onPress={selectMedia} />
        <Button title="Снять фото или видео" onPress={captureMedia} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  header: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  message: {
    marginVertical: 5,
    padding: 10,
    backgroundColor: '#f1f1f1',
    borderRadius: 5,
  },
  messageHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  sender: {
    fontWeight: 'bold',
  },
  timestamp: {
    fontSize: 12,
    color: '#888',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
  },
  media: {
    width: '100%',
    height: '100%',
    marginTop: 10,
    borderRadius: 50,
  },
  videoMedia: {
    width: '50%',
    height: '50%',
    marginTop: 10,
    borderRadius: 100,
  },
});

export default ChatScreen;