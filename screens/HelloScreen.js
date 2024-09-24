import React, { useState, useEffect } from 'react';
import { View, Alert, StyleSheet, Image,TouchableOpacity } from 'react-native';
import { Input, Button, Text, ThemeProvider } from 'react-native-elements';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { GoogleSignin, statusCodes } from '@react-native-google-signin/google-signin';
import { apiUrl } from '../config';
import { Border, FontSize, FontFamily, Color } from "../GlobalStyles";


const HelloScreen = ({ navigation }) => {

return (
    <View style={styles.helloScreen}>
      <TouchableOpacity onPress={() => navigation.navigate('Signup')} style={[styles.btnCreateAccount, styles.btnCreateAccountLayout]}>
        <View style={[styles.rectangle, styles.girl2IconPosition]} />
        <Text style={styles.createAnAccount}>Create an account</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'rgba(154, 31, 255, 1)',
    textAlign: 'center',
  },
});

export default HelloScreen;