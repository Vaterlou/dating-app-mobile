// App.js
import React, { useState, useEffect } from 'react';
import AppNavigator from './components/AppNavigator';
import SplashScreenComponent from './screens/SplashScreen';

const App = () => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Симуляция загрузки приложения
    setTimeout(() => {
      setIsLoading(false); // После загрузки переключаемся на основной экран
    }, 4000); 
  }, []);

  if (isLoading) {
    return <SplashScreenComponent />;
  }

  return <AppNavigator />;
};

export default App;
