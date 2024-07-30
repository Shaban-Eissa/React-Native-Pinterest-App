import { Dimensions } from "react-native";

export const { width: deviceWidth, height: deviceHeight } =
  Dimensions.get("window");

export const wp = (widthPercent) => {
  const width = deviceWidth;
  return (width * widthPercent) / 100;
};

export const hp = (heightPercent) => {
  const height = deviceHeight;
  return (height * heightPercent) / 100;
};

export const getColumnCount = () => {
  if (deviceWidth >= 1024) {
    return 4;
  } else if (deviceWidth >= 768) {
    return 3;
  } else {
    return 2;
  }
};

export const getImageSize = (width, height) => {
  if (width > height) {
    return 250;
  } else if (width < height) {
    return 300;
  } else {
    return 200;
  }
};

export const captalize = (str) => {
  return str.charAt(0).toUpperCase() + str.slice(1);
};
