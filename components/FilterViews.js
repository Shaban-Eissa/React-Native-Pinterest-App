import { Pressable, View, StyleSheet, Text } from "react-native";

import { theme } from "../constants/theme";

import { captalize, hp } from "../helpers/common";

const SectionView = ({ title, content }) => {
  return (
    <View style={styles.sectionContainer}>
      <Text style={styles.sectionTitle}>{title}</Text>
      <View>{content}</View>
    </View>
  );
};

export const CommonFilterRow = ({ data, filterName, filters, setFilters }) => {
  const onSelect = (item) => {
    setFilters({
      ...filters,
      [filterName]: item,
    });
  };
  return (
    <View style={styles.flexRowWrap}>
      {data &&
        data.map((item, index) => {
          let isActive = filters && filters[filterName] === item;
          let backgroundColor = isActive ? theme.colors.neutral(0.7) : "white";
          let color = isActive ? "white" : theme.colors.neutral(0.7);
          return (
            <Pressable
              onPress={() => onSelect(item)}
              key={item}
              style={[styles.outlinedButton, { backgroundColor }]}
            >
              <Text style={[styles.outlinedButtonText, { color }]}>
                {captalize(item)}
              </Text>
            </Pressable>
          );
        })}
    </View>
  );
};

export const ColorFilterRow = ({ data, filterName, filters, setFilters }) => {
  const onSelect = (item) => {
    setFilters({
      ...filters,
      [filterName]: item,
    });
  };
  return (
    <View style={styles.flexRowWrap}>
      {data &&
        data.map((item, index) => {
          let isActive = filters && filters[filterName] === item;
          let borderColor = isActive ? theme.colors.neutral(0.4) : "white";
          return (
            <Pressable onPress={() => onSelect(item)} key={item}>
              <View style={[styles.colorWrapper, { borderColor }]}>
                <View
                  style={[
                    styles.color,
                    {
                      backgroundColor: item,
                    },
                  ]}
                />
              </View>
            </Pressable>
          );
        })}
    </View>
  );
};

const styles = StyleSheet.create({
  sectionContainer: {
    gap: 8,
  },
  sectionTitle: {
    fontSize: hp(2.4),
    fontWeight: theme.fontWeights.meduim,
    color: theme.colors.neutral(0.8),
  },
  flexRowWrap: {
    gap: 10,
    flexDirection: "row",
    flexWrap: "wrap",
  },
  outlinedButton: {
    padding: 8,
    paddingHorizontal: 14,
    borderRadius: theme.radius.xs,
    borderWidth: 1,
    borderColor: theme.colors.gray,
  },
  color: {
    width: 40,
    height: 30,
    borderRadius: theme.radius.sm - 3,
  },

  colorWrapper: {
    padding: 2,
    borderRadius: theme.radius.sm,
    borderWidth: 0.5,
  },
});

export default SectionView;
