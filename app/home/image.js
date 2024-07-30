import React, { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";

import Toast from "react-native-toast-message";
import Animated, { FadeInDown } from "react-native-reanimated";

import { BlurView } from "expo-blur";
import * as Sharing from "expo-sharing";
import * as FileSystem from "expo-file-system";
import * as MediaLibrary from "expo-media-library";
import { Entypo, Octicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";

import { hp, wp } from "../../helpers/common";

import { theme } from "../../constants/theme";

const ImageScreen = () => {
  const router = useRouter();

  const item = useLocalSearchParams();

  const [status, setStatus] = useState("loading");

  const onLoad = () => {
    setStatus("");
  };

  let url = item?.webformatURL;
  const fileName = item?.previewURL?.split("/").pop();
  const imageURL = url;
  const filePath = `${FileSystem.documentDirectory}${fileName}`;

  const getSize = () => {
    const aspectRatio = item?.imageWidth / item?.imageHeight;
    const maxWidth = Platform.OS === "web" ? wp(50) : wp(92);

    let calculatedHeight = maxWidth / aspectRatio;
    let calculatedWidth = maxWidth;

    if (aspectRatio < 1) {
      calculatedWidth = calculatedHeight * aspectRatio;
    }
    return {
      width: calculatedWidth,
      height: calculatedHeight,
    };
  };

  const downloadFile = async () => {
    try {
      const { uri } = await FileSystem.downloadAsync(imageURL, filePath);
      setStatus("");
      return uri;
    } catch (e) {
      setStatus("");
      Alert.alert("Error", "Failed to download the file.");
      return null;
    }
  };

  const handleDownloadImage = async () => {
    setStatus("downloading");
    let url = await downloadFile();
    saveFileToDevice();
  };

  const handleShareImage = async () => {
    setStatus("sharing");
    const url = await downloadFile();

    if (url) {
      await Sharing.shareAsync(url);
    }
  };

  const saveFileToDevice = async () => {
    try {
      const { status } = await MediaLibrary.requestPermissionsAsync();
      if (status !== "granted") {
        throw new Error("Missing MEDIA_LIBRARY write permission.");
      }

      const asset = await MediaLibrary.createAssetAsync(filePath);
      await MediaLibrary.createAlbumAsync(
        "Pinterest Application",
        asset,
        false
      );

      setStatus("");
      showToast("Image downloaded successfully");
      return true;
    } catch (e) {
      setStatus("");
      Alert.alert("Error", "Failed to save the file to device.");
      return false;
    }
  };

  const showToast = (message) => {
    Toast.show({
      type: "success",
      text1: message,
      position: "bottom",
    });
  };

  const toastConfig = {
    success: ({ text1, props, ...rest }) => (
      <View style={styles.toastContainer}>
        <Text style={styles.toastText}>{text1}</Text>
      </View>
    ),
  };

  return (
    <BlurView tint="dark" intensity={60} style={styles.container}>
      <View style={getSize()}>
        <View style={styles.loading}>
          {status === "loading" && (
            <ActivityIndicator size="large" color="white" />
          )}
        </View>
        <Image
          transition={100}
          onLoad={onLoad}
          source={{ uri: url }}
          style={[styles.image, getSize()]}
        />
      </View>
      <View style={styles.buttons}>
        <Animated.View entering={FadeInDown.springify()}>
          <Pressable
            style={styles.button}
            onPress={() => {
              router.back();
            }}
          >
            <Octicons name="x" size={24} color="white" />
          </Pressable>
        </Animated.View>
        <Animated.View entering={FadeInDown.springify().delay(100)}>
          {status === "downloading" ? (
            <View style={styles.button}>
              <ActivityIndicator size="small" color="white" />
            </View>
          ) : (
            <Pressable style={styles.button} onPress={handleDownloadImage}>
              <Octicons name="download" size={24} color="white" />
            </Pressable>
          )}
        </Animated.View>
        <Animated.View entering={FadeInDown.springify().delay(200)}>
          {status === "sharing" ? (
            <View style={styles.button}>
              <ActivityIndicator size="small" color="white" />
            </View>
          ) : (
            <Pressable style={styles.button} onPress={handleShareImage}>
              <Entypo name="share" size={24} color="white" />
            </Pressable>
          )}
        </Animated.View>
      </View>
      <Toast config={toastConfig} visibilityTime={2500} />
    </BlurView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: wp(4),
    backgroundColor: "rgba(0,0,0,0.5)",
  },

  image: {
    borderRadius: theme.radius.lg,
    borderWidth: 2,
    backgroundColor: "rgba(255,255,255,0.1)",
    borderColor: "rgba(255,255,255,0.1)",
  },
  loading: {
    position: "absolute",
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
  },

  buttons: {
    marginTop: 40,
    flexDirection: "row",
    alignItems: "center",
    gap: 50,
  },

  button: {
    height: hp(6),
    width: hp(6),
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,.2)",
    borderRadius: theme.radius.lg,
  },
  toastContainer: {
    padding: 15,
    paddingHorizontal: 30,
    borderRadius: theme.radius.xl,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.15)",
  },
  toastText: {
    fontSize: hp(1.8),
    fontWeight: theme.fontWeights.semibold,
    color: theme.colors.white,
  },
});

export default ImageScreen;
