import * as React from "react";

const Trademark = () => {
  return (
    <Image
      style={styles.trademarkIcon}
      resizeMode="cover"
      source={require("../assets/trademark1.png")}
    />
  );
};

const styles = StyleSheet.create({
  trademarkIcon: {
    width: 109,
    height: 100,
  },
});

export default Trademark;
