import React, { useMemo } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

import Animated, {
  Extrapolation,
  FadeInDown,
  interpolate,
  useAnimatedStyle,
} from "react-native-reanimated";

import { BlurView } from "expo-blur";

import { BottomSheetModal, BottomSheetView } from "@gorhom/bottom-sheet";

import SectionView, {
  ColorFilterRow,
  CommonFilterRow,
} from "../components/FilterViews";

import { data } from "../constants/data";
import { theme } from "../constants/theme";

import { captalize, hp } from "../helpers/common";

const FiltersModal = ({
  modalRef,
  onReset,
  onApply,
  onClose,
  filters,
  setFilters,
}) => {
  const snapPoints = useMemo(() => ["75%"], []);
  return (
    <BottomSheetModal
      ref={modalRef}
      index={0}
      snapPoints={snapPoints}
      enablePanDownToClose={true}
      backdropComponent={CustomBackdrop}
      //   onChange={handleSheetChanges}
    >
      <BottomSheetView style={styles.contentContainer}>
        <View style={styles.content}>
          <Text style={styles.filterText}>Filters</Text>
          {
            // render sections
            Object.keys(sections).map((sectionName, index) => {
              let sectionView = sections[sectionName];
              let sectionData = data.filters[sectionName];
              let title = captalize(sectionName);
              return (
                <Animated.View
                  entering={FadeInDown.delay(index * 100 + 100)
                    .springify()
                    .damping(11)}
                  key={sectionName}
                >
                  <SectionView
                    title={title}
                    content={sectionView({
                      data: sectionData,
                      filters,
                      setFilters,
                      filterName: sectionName,
                    })}
                  />
                </Animated.View>
              );
            })
          }

          <Animated.View
            entering={FadeInDown.delay(500).springify().damping(11)}
            style={styles.buttons}
          >
            <Pressable onPress={onReset} style={styles.resetButton}>
              <Text
                style={[
                  styles.buttonText,
                  { color: theme.colors.neutral(0.9) },
                ]}
              >
                Reset
              </Text>
            </Pressable>

            <Pressable onPress={onApply} style={styles.applyButton}>
              <Text
                style={[
                  styles.buttonText,
                  {
                    color: theme.colors.white,
                  },
                ]}
              >
                Apply
              </Text>
            </Pressable>
          </Animated.View>
        </View>
      </BottomSheetView>
    </BottomSheetModal>
  );
};

const sections = {
  order: (props) => <CommonFilterRow {...props} />,
  orientation: (props) => <CommonFilterRow {...props} />,
  type: (props) => <CommonFilterRow {...props} />,
  colors: (props) => <ColorFilterRow {...props} />,
};

const CustomBackdrop = ({ animatedIndex, style }) => {
  const containerAnimatedStyle = useAnimatedStyle(() => {
    let opacity = interpolate(
      animatedIndex.value,
      [-1, 0],
      [0, 1],
      Extrapolation.CLAMP
    );
    return { opacity };
  });
  const containerStyle = [
    StyleSheet.absoluteFill,
    style,
    styles.overlay,
    containerAnimatedStyle,
  ];
  return (
    <Animated.View style={containerStyle}>
      <BlurView
        style={StyleSheet.absoluteFill}
        blurType="dark"
        blurAmount={25}
      />
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    justifyContent: "center",
    backgroundColor: "grey",
  },
  contentContainer: {
    flex: 1,
    alignItems: "center",
  },
  overlay: {
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  content: {
    // width: "100%",
    gap: 15,
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  filterText: {
    fontSize: hp(4),
    fontWeight: theme.fontWeights.semibold,
    color: theme.colors.neutral(0.8),
    marginBottom: 5,
  },

  buttons: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  applyButton: {
    flex: 1,
    backgroundColor: "#e7001e",
    padding: 12,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: theme.radius.md,
  },
  resetButton: {
    flex: 1,
    backgroundColor: theme.colors.neutral(0.05),
    padding: 12,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: theme.radius.md,
    borderColor: theme.colors.gray,
  },

  buttonText: {
    fontSize: hp(2),
  },
});

export default FiltersModal;
