import React from "react";
import { Image, Pressable, StyleSheet, Text, View } from "react-native";

import Animated, { FadeInDown } from "react-native-reanimated";

import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { LinearGradient } from "expo-linear-gradient";

import { hp, wp } from "../helpers/common";

import { theme } from "../constants/theme";

const WelcomeScreen = () => {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      <Image
        style={styles.image}
        source={require("../assets/images/Pinterest.png")}
        resizeMode="cover"
      />
      <Image
        style={styles.logo}
        source={require("../assets/images/Pinterest-Logo-1-1.webp")}
        resizeMode="cover"
      />
      <Animated.View entering={FadeInDown.duration(600)} style={{ flex: 1 }}>
        <LinearGradient
          style={styles.gradient}
          colors={[
            "rgba(255,255,255,0)",
            "rgba(255,255,255,.5)",
            "white",
            "white",
          ]}
          start={{ x: 0.5, y: 0 }}
          end={{ x: 0.5, y: 0.7 }}
        />
        <View style={styles.contentContainer}>
          <Text style={styles.title}>
            Get Ready to Discover Your Next Favorite Thing
          </Text>
          <Text style={styles.subtitle}>
            Welcome to Pinterest, the world's catalog of ideas. Find new ideas
            to try and save them to your device.
          </Text>
          <Animated.View entering={FadeInDown.delay(600).springify()}>
            <Pressable
              onPress={() => router.push("home")}
              style={styles.button}
            >
              <Text style={styles.buttonText}>Start Explore</Text>
            </Pressable>
          </Animated.View>
        </View>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  image: {
    width: wp(140),
    height: hp(90),
    position: "absolute",
    top: -90,
    left: 0,
    right: 0,
    bottom: 0,
  },
  logo: {
    width: wp(50),
    height: hp(10),
    display: "flex",
    alignSelf: "center",
    top: 50,
    position: "absolute",
  },
  gradient: {
    width: wp(100),
    height: hp(60),
    bottom: 0,
    position: "absolute",
  },

  contentContainer: {
    flex: 1,
    justifyContent: "flex-end",
    alignItems: "center",
    gap: 11,
    marginHorizontal: 25,
  },

  title: {
    fontSize: hp(3),
    color: theme.colors.neutral(0.8),
    fontWeight: theme.fontWeights.bold,
    textAlign: "center",
  },
  subtitle: {
    fontSize: hp(1.6),
    width: wp(75),
    marginBottom: 35,
    color: theme.colors.neutral(0.8),
    textAlign: "center",
  },

  button: {
    marginBottom: 30,
    backgroundColor: "#e7001e",
    borderRadius: theme.radius.lg,
    padding: 15,
    paddingHorizontal: 120,
  },
  buttonText: {
    color: theme.colors.white,
    fontSize: hp(2),
    fontWeight: theme.fontWeights.meduim,
  },
});

export default WelcomeScreen;
