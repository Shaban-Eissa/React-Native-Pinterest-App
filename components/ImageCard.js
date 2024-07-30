import React from "react";
import { Pressable, StyleSheet } from "react-native";

import { Image } from "expo-image";

import { theme } from "../constants/theme";

import { getImageSize, wp } from "../helpers/common";

const ImageCard = ({ item, index, columns, router }) => {
  const getImageHeight = () => {
    const { imageHeight: height, imageWidth: width } = item;
    return {
      height: getImageSize(width, height),
    };
  };

  const isLastItemOnRow = () => {
    return (index + 1) % columns === 0;
  };

  return (
    <Pressable
      onPress={() =>
        router.push({ pathname: "home/image", params: { ...item } })
      }
      style={[styles.imageWrapper, !isLastItemOnRow() && styles.spacing]}
    >
      <Image
        style={[styles.image, getImageHeight()]}
        source={{
          uri: item?.webformatURL,
        }}
      />
    </Pressable>
  );
};

const styles = StyleSheet.create({
  image: {
    width: "100%",
    height: 300,
  },
  imageWrapper: {
    marginBottom: wp(2),
    borderRadius: theme.radius.xl,
    overflow: "hidden",
  },
  spacing: {
    marginRight: wp(2),
  },
});
export default ImageCard;
