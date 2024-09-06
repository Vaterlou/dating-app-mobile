import * as React from "react";

const OnboardingDots = () => {
  return (
    <View style={styles.onboardingDots}>
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
  );
};

const styles = StyleSheet.create({
  iconLayout: {
    maxHeight: "100%",
    overflow: "hidden",
    maxWidth: "100%",
    bottom: "0%",
    top: "0%",
    width: "20%",
    height: "100%",
    position: "absolute",
  },
  dot3Icon: {
    right: "0%",
    left: "80%",
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
    width: 40,
    height: 8,
  },
});

export default OnboardingDots;
