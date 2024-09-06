import React, { useState, useEffect } from 'react';
import { View, Alert, StyleSheet, Image,TouchableOpacity } from 'react-native';
import { Input, Button, Text, ThemeProvider } from 'react-native-elements';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { GoogleSignin, statusCodes } from '@react-native-google-signin/google-signin';
import { apiUrl } from '../config';
import { Border, FontSize, FontFamily, Color } from "../GlobalStyles";


const HelloScreen = ({ navigation }) => {

return (
    <View style={styles.screen1}>
      <Image
        style={[styles.trademarkIcon, styles.iconLayout2]}
        resizeMode="cover"
        source={require("../assets/trademark.png")}
      />
      <View style={styles.photo}>
        <Image
          style={[styles.girl3Icon, styles.iconLayout1]}
          resizeMode="cover"
          source={require("../assets/girl3.png")}
        />
        <Image
          style={[styles.girl2Icon, styles.girl2IconPosition]}
          resizeMode="cover"
          source={require("../assets/girl2.png")}
        />
        <Image
          style={[styles.girl1Icon, styles.iconLayout1]}
          resizeMode="cover"
          source={require("../assets/girl1.png")}
        />
      </View>
      <View style={styles.content}>
        <View style={[styles.onboardingDots, styles.girl2IconPosition]}>
          <Image
            style={[styles.dot3Icon, styles.iconLayout]}
            resizeMode="cover"
            source={require("../assets/dot-3.png")}
          />
          <Image
            style={[styles.dot2Icon, styles.iconLayout]}
            resizeMode="cover"
            source={require("../assets/dot-3.png")}
          />
          <Image
            style={[styles.dot1Icon, styles.iconLayout]}
            resizeMode="cover"
            source={require("../assets/dot-1.png")}
          />
        </View>
        <Text style={[styles.byClickingLogContainer, styles.rectangleLayout]}>
          {`By clicking Log In, you agree with our `}
          <Text style={styles.terms}>Terms</Text>
          {`.
Learn how we process your data in our `}
          <Text style={styles.terms}>{`Privacy
Policy`}</Text>
          {` and `}
          <Text style={styles.terms}>Cookies Policy.</Text>
        </Text>
        <Text style={styles.meetup}>MeetUp</Text>
      </View>
      <TouchableOpacity onPress={() => navigation.navigate('Signup')} style={[styles.btnCreateAccount, styles.btnCreateAccountLayout]}>
        <View style={[styles.rectangle, styles.girl2IconPosition]} />
        <Text style={styles.createAnAccount}>Create an account</Text>
      </TouchableOpacity>
      <Text
        style={[
          styles.privacyAndAgreemenContainer,
          styles.btnCreateAccountLayout,
        ]}
      >
        <Text style={styles.alreadyHaveAnAccount}>
          <Text style={styles.alreadyHaveAn}>Already have an account?</Text>
          <Text style={styles.text}>
            <Text style={styles.text1}>{` `}</Text>
          </Text>
        </Text>
        <TouchableOpacity onPress={() => navigation.navigate('Login')} style={styles.text}>
          <Text style={styles.signIn1}>Sign In</Text>
        </TouchableOpacity>
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  iconLayout2: {
    maxHeight: "100%",
    maxWidth: "100%",
    overflow: "hidden",
  },
  iconLayout1: {
    borderRadius: Border.br_mini,
    bottom: "8.33%",
    top: "8.33%",
    width: "29.28%",
    height: "83.33%",
    maxHeight: "100%",
    maxWidth: "100%",
    position: "absolute",
    overflow: "hidden",
  },
  girl2IconPosition: {
    bottom: "0%",
    position: "absolute",
  },
  iconLayout: {
    width: "20%",
    bottom: "0%",
    top: "0%",
    height: "100%",
    maxHeight: "100%",
    maxWidth: "100%",
    position: "absolute",
    overflow: "hidden",
  },
  rectangleLayout: {
    width: "100%",
    left: "0%",
  },
  btnCreateAccountLayout: {
    width: "78.67%",
    position: "absolute",
    marginTop: "-50",
  },
  trademarkIcon: {
    height: "12.32%",
    width: "28.96%",
    top: "2.22%",
    right: "35.57%",
    bottom: "85.47%",
    left: "35.47%",
    position: "absolute",
  },
  girl3Icon: {
    left: "70.72%",
    right: "0%",
  },
  girl2Icon: {
    width: "34.41%",
    right: "32.8%",
    left: "32.8%",
    top: "0%",
    height: "100%",
    bottom: "0%",
    borderRadius: Border.br_mini,
    maxHeight: "100%",
    maxWidth: "100%",
    overflow: "hidden",
  },
  girl1Icon: {
    right: "70.72%",
    left: "0%",
  },
  photo: {
    height: "44.33%",
    width: "182.13%",
    top: "17.36%",
    right: "-41.07%",
    bottom: "38.3%",
    left: "-41.07%",
    position: "absolute",
  },
  dot3Icon: {
    left: "80%",
    right: "0%",
  },
  dot2Icon: {
    right: "40%",
    left: "40%",
  },
  dot1Icon: {
    right: "80%",
    left: "0%",
  },
  onboardingDots: {
    height: "6.35%",
    width: "12.62%",
    top: "93.65%",
    right: "41.64%",
    left: "45.74%",
  },
  terms: {
    textDecoration: "underline",
  },
  byClickingLogContainer: {
    top: "38.1%",
    fontSize: FontSize.size_smi,
    lineHeight: 19,
    color: "#e5e5e5",
    textAlign: "center",
    fontFamily: FontFamily.comfortaa,
    left: "0%",
    position: "absolute",
  },
  meetup: {
    width: "93.06%",
    left: "3.47%",
    fontSize: 24,
    lineHeight: 36,
    color: Color.redE94057,
    fontFamily: FontFamily.montserrat,
    textAlign: "center",
    top: "0%",
    position: "absolute",
  },
  content: {
    height: "15.52%",
    width: "84.53%",
    top: "64.53%",
    right: "8%",
    bottom: "19.95%",
    left: "7.47%",
    position: "absolute",
  },
  rectangle: {
    backgroundColor: "#bc7be4",
    left: "0%",
    top: "0%",
    height: "100%",
    bottom: "0%",
    borderRadius: Border.br_mini,
    right: "0%",
    width: "100%",
  },
  createAnAccount: {
    width: "78.31%",
    top: "28.57%",
    left: "10.85%",
    lineHeight: 24,
    color: Color.textWhiteFFFFFF,
    fontSize: FontSize.singleLineBodyBase_size,
    textAlign: "center",
    fontFamily: FontFamily.comfortaa,
    position: "absolute",
  },
  btnCreateAccount: {
    height: "6.9%",
    top: "82.88%",
    right: "10.93%",
    bottom: "10.22%",
    left: "10.4%",
  },
  alreadyHaveAn: {
    color: "rgba(0, 0, 0, 0.7)",
    fontSize: FontSize.size_sm,
  },
  text1: {
    fontSize: FontSize.singleLineBodyBase_size,
  },
  text: {
    color: Color.redE94057,
  },
  alreadyHaveAnAccount: {
    fontFamily: FontFamily.comfortaa,
  },
  signIn1: {
    fontWeight: "700",
    fontSize: FontSize.size_sm,
    fontFamily: FontFamily.montserrat,
  },
  privacyAndAgreemenContainer: {
    top: "92.61%",
    left: "10.67%",
    textAlign: "center",
  },
  screen1: {
    borderRadius: Border.br_xl,
    backgroundColor: Color.colorBlack,
    flex: 1,
    height: 812,
    overflow: "hidden",
    width: "100%",
  },
});

export default HelloScreen;