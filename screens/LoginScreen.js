import React, { useState, useEffect } from 'react';
import { View, Alert, StyleSheet, Image, TouchableOpacity, TextInput } from 'react-native';
import { Input, Button, Text, ThemeProvider } from 'react-native-elements';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { GoogleSignin, statusCodes } from '@react-native-google-signin/google-signin';
import { apiUrl } from '../config';
import { Border, FontSize, FontFamily, Color } from "../GlobalStyles";


const LoginScreen = ({ navigation }) => {

  useEffect(() => {
    GoogleSignin.configure({
      iosClientId: '185723400285-hcm6nnmi4hefsg9mukg57iioh7msn8em.apps.googleusercontent.com',
      webClientId: '185723400285-e9eejp7m7a8jmgfpfctbea4bft39ma12.apps.googleusercontent.com',
      offlineAccess: true,
    });
  }, []);

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
    <View style={styles.screen2}>
    <Image
      style={[styles.trademarkIcon, styles.iconLayout]}
      resizeMode="cover"
      source={require("../assets/trademark.png")}
    />
    <View style={[styles.signUp, styles.signUpPosition]}>
    <TouchableOpacity onPress={() => navigation.navigate('LoginByEmail')} style={styles.btnContinueWithEmail}>
        <View style={styles.container} />
        <Text style={styles.continueWithEmail}>Continue with email</Text>
    </TouchableOpacity>
      <View style={styles.btnUsePhoneNumber}>
        <View style={[styles.container1, styles.containerPosition]} />
        <Text style={styles.usePhoneNumber}>Use phone number</Text>
      </View>
      <Text style={styles.signUpTo}>Sign up to continue</Text>
    </View>
    <View style={[styles.socials, styles.signUpPosition]}>
      <View style={styles.orLoginWith}>
        <View style={[styles.line2, styles.linePosition]} />
        <Text style={styles.orSignUp}>or sign up with</Text>
        <View style={[styles.line1, styles.linePosition]} />
      </View>
      <View style={[styles.fb, styles.fbPosition]}>
        <View style={[styles.container2, styles.containerPosition]} />
        <Image
          style={[styles.iconsLogoFacebook, styles.iconLayout]}
          resizeMode="cover"
          source={require("../assets/icons--logo--facebook.png")}
        />
      </View>
      <View style={[styles.google, styles.fbPosition]}>
        <View style={[styles.container2, styles.containerPosition]} />
        <Image
          style={[styles.iconsLogoFacebook, styles.iconLayout]}
          resizeMode="cover"
          source={require("../assets/icons--logo--google.png")}
        />
      </View>
      <Image
        style={[styles.appleIcon, styles.fbPosition]}
        resizeMode="cover"
        source={require("../assets/3-apple.png")}
      />
    </View>
    <View style={styles.footer}>
      <Text style={[styles.termsOfUse, styles.termsOfUseTypo]}>
        Terms of use
      </Text>
      <Text style={[styles.privacyPolicy, styles.termsOfUseTypo]}>
        Privacy Policy
      </Text>
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
  signUpPosition: {
    left: "10.67%",
    right: "10.67%",
    width: "78.67%",
    position: "absolute",
  },
  containerPosition: {
    borderWidth: 1,
    borderStyle: "solid",
    backgroundColor: Color.whiteFFFFFF,
    borderRadius: Border.br_mini,
    bottom: "0%",
    top: "0%",
    height: "100%",
    left: "0%",
    right: "0%",
    position: "absolute",
    width: "100%",
  },
  linePosition: {
    backgroundColor: Color.colorGainsboro_100,
    bottom: "47.5%",
    top: "50%",
    width: "31.86%",
    height: "2.5%",
    position: "absolute",
  },
  fbPosition: {
    top: "39.62%",
    width: "21.69%",
    height: "60.38%",
    bottom: "0%",
    position: "absolute",
  },
  termsOfUseTypo: {
    fontFamily: FontFamily.comfortaaRegular,
    lineHeight: 21,
    fontSize: FontSize.size_sm,
    color: Color.colorGainsboro_100,
    textAlign: "center",
    top: "0%",
    position: "absolute",
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
  continueWithEmail: {
    color: Color.whiteFFFFFF,
    textAlign: "center",
    fontFamily: FontFamily.comfortaaBold,
    fontWeight: "700",
    lineHeight: 24,
    fontSize: FontSize.size_base,
    left: "10.85%",
    top: "28.57%",
    width: "78.31%",
    position: "absolute",
  },
  btnContinueWithEmail: {
    top: "30.89%",
    bottom: "39.79%",
    left: "0%",
    right: "0%",
    height: "29.32%",
    position: "absolute",
    width: "100%",
  },
  container1: {
    borderColor: "#f3f3f3",
  },
  usePhoneNumber: {
    color: Color.redE94057,
    textAlign: "center",
    fontFamily: FontFamily.comfortaaBold,
    fontWeight: "700",
    lineHeight: 24,
    fontSize: FontSize.size_base,
    left: "10.85%",
    top: "28.57%",
    width: "78.31%",
    position: "absolute",
  },
  btnUsePhoneNumber: {
    top: "70.68%",
    bottom: "0%",
    left: "0%",
    right: "0%",
    height: "29.32%",
    position: "absolute",
    width: "100%",
  },
  signUpTo: {
    fontSize: 18,
    lineHeight: 27,
    color: Color.colorGainsboro_100,
    fontFamily: FontFamily.montserratRegular,
    textAlign: "center",
    top: "0%",
    left: "0%",
    position: "absolute",
    width: "100%",
  },
  signUp: {
    height: "23.52%",
    top: "34.36%",
    bottom: "42.12%",
  },
  line2: {
    left: "68.14%",
    right: "0%",
  },
  orSignUp: {
    width: "30.85%",
    left: "36.61%",
    fontSize: 12,
    lineHeight: 18,
    fontFamily: FontFamily.montserratRegular,
    color: Color.redE94057,
    textAlign: "center",
    top: "0%",
    height: "100%",
    position: "absolute",
  },
  line1: {
    right: "68.14%",
    left: "0%",
  },
  orLoginWith: {
    height: "18.87%",
    bottom: "81.13%",
    top: "0%",
    left: "0%",
    right: "0%",
    position: "absolute",
    width: "100%",
  },
  container2: {
    borderColor: Color.colorDarkviolet,
  },
  iconsLogoFacebook: {
    height: "50%",
    width: "50%",
    top: "25%",
    right: "25%",
    bottom: "25%",
    left: "25%",
    position: "absolute",
  },
  fb: {
    right: "67.8%",
    left: "10.51%",
  },
  google: {
    right: "39.32%",
    left: "38.98%",
  },
  appleIcon: {
    right: "10.85%",
    left: "67.46%",
    maxHeight: "100%",
    maxWidth: "100%",
    overflow: "hidden",
  },
  socials: {
    height: "13.05%",
    top: "66.87%",
    bottom: "20.07%",
  },
  termsOfUse: {
    left: "0%",
  },
  privacyPolicy: {
    left: "53.11%",
  },
  footer: {
    height: "2.59%",
    width: "55.73%",
    top: "93.47%",
    right: "22.13%",
    bottom: "3.94%",
    left: "22.13%",
    position: "absolute",
  },
  screen2: {
    borderRadius: Border.br_xl,
    backgroundColor: Color.colorBlack,
    flex: 1,
    height: 812,
    overflow: "hidden",
    width: "100%",
  },
});

export default LoginScreen;
