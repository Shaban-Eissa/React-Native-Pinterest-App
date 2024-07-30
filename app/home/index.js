import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

import { ScrollView } from "react-native-gesture-handler";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { useRouter } from "expo-router";
import { Feather, FontAwesome6, Ionicons } from "@expo/vector-icons";

import { debounce } from "lodash";

import { apiCall } from "../../api";

import { theme } from "../../constants/theme";
import { hp, wp } from "../../helpers/common";

import ImageGrid from "../../components/ImageGrid";
import Categories from "../../components/Categories";
import FiltersModal from "../../components/FiltersModal";
import { Image } from "expo-image";

const HomeScreen = () => {
  const { top } = useSafeAreaInsets();
  const paddingTop = top > 0 ? top + 10 : top + 30;

  const [search, setSearch] = useState("");
  const [images, setImages] = useState([]);
  const [filters, setFilters] = useState(null);
  const [activeCategory, setActiveCategory] = useState(null);
  const [isEndReached, setIsEndReached] = useState(false);

  const searchInputRef = useRef(null);
  const modalRef = useRef(null);
  const scrollRef = useRef(null);

  const router = useRouter();

  const handleChangeCategory = (category) => {
    setActiveCategory(category);
    clearSearch();

    setImages([]);

    let params = {
      page: 1,
      ...filters,
    };

    if (category) params.category = category;

    fetchImages(params, false);
  };

  const fetchImages = async (params = { page: 1 }, append = true) => {
    const response = await apiCall(params);

    if (response && response?.data?.hits) {
      if (append) {
        setImages([...images, ...response.data.hits]);
      } else {
        setImages(response.data.hits);
      }
    }
  };

  useEffect(() => {
    fetchImages();
  }, []);

  const handleSearch = (text) => {
    setSearch(text);

    if (text.length > 2) {
      setImages([]);
      setActiveCategory(null);

      fetchImages({ page: 1, q: text, ...filters }, false);
    }
    if (text == "") {
      searchInputRef?.current?.clear();
      setImages([]);
      setActiveCategory(null);

      fetchImages({ page: 1, ...filters }, false);
    }
  };

  const handleDebounceOfText = useCallback(debounce(handleSearch, 400), []);

  const clearSearch = () => {
    setSearch("");
    searchInputRef?.current?.clear();
  };

  const handleOpenModal = () => {
    modalRef?.current?.present();
  };

  const handleCloseModal = () => {
    modalRef?.current?.close();
  };

  const handleApplyFilters = () => {
    if (filters) {
      setImages([]);

      let params = {
        page: 1,
        ...filters,
      };

      if (activeCategory) params.category = activeCategory;
      if (search) params.q = search;

      fetchImages(params, false);
    }
    handleCloseModal();
  };

  const handleResetFilters = () => {
    if (filters) {
      setFilters(null);
      setImages([]);

      let params = {
        page: 1,
      };

      if (activeCategory) params.category = activeCategory;
      if (search) params.q = search;

      fetchImages(params, false);
    }
    handleCloseModal();
  };

  const clearThisFilter = (key) => {
    let newFilters = { ...filters };
    delete newFilters[key];
    setFilters({ ...newFilters });
    setImages([]);

    let params = {
      page: 1,
      ...newFilters,
    };

    if (activeCategory) params.category = activeCategory;
    if (search) params.q = search;

    fetchImages(params, false);
  };

  const handleScrollUp = () => {
    scrollRef?.current?.scrollTo({ y: 0, animated: true });
  };

  const handleScroll = (event) => {
    const contentHeight = event.nativeEvent.contentSize.height;
    const scrollViewHeight = event.nativeEvent.layoutMeasurement.height;
    const scrollOffset = event.nativeEvent.contentOffset.y;
    const bottomPosition = contentHeight - scrollViewHeight;

    if (scrollOffset >= bottomPosition - 1) {
      if (!isEndReached) {
        setIsEndReached(true);

        let params = {
          page: Math.floor(images.length / 20) + 1,
          ...filters,
        };

        if (activeCategory) params.category = activeCategory;
        if (search) params.q = search;

        fetchImages(params, true);
      }
    } else if (isEndReached) {
      setIsEndReached(false);
    }
  };

  return (
    <View style={[styles.container, { paddingTop }]}>
      <View style={styles.header}>
        <Pressable onPress={handleScrollUp}>
          <Text style={styles.title}>Pinterest</Text>
        </Pressable>

        <Pressable onPress={handleOpenModal}>
          <FontAwesome6
            name="bars-staggered"
            size={22}
            color={theme.colors.neutral(0.7)}
          />
        </Pressable>
      </View>

      <ScrollView
        onScroll={handleScroll}
        scrollEventThrottle={5}
        ref={scrollRef}
        contentContainerStyle={{ gap: 15 }}
      >
        <View style={styles.searchBar}>
          <View style={styles.searchIcon}>
            <Feather
              name="search"
              size={24}
              color={theme.colors.neutral(0.4)}
            />
          </View>
          <TextInput
            // value={search}
            onChangeText={handleDebounceOfText}
            ref={searchInputRef}
            style={styles.searchInput}
            placeholder="Search for photos"
          />
          {search && (
            <Pressable
              onPress={() => handleSearch("")}
              style={styles.closeIcon}
            >
              <Ionicons
                name="close"
                size={24}
                color={theme.colors.neutral(0.6)}
              />
            </Pressable>
          )}
        </View>

        <View>
          <Categories
            activeCategory={activeCategory}
            handleChangeCategory={handleChangeCategory}
          />
        </View>

        {filters && (
          <View>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.filters}
            >
              {Object.keys(filters).map((key, index) => {
                return (
                  <View key={key} style={styles.filterItem}>
                    {key == "colors" ? (
                      <View
                        style={{
                          backgroundColor: filters[key],
                          width: 30,
                          height: 20,
                          borderRadius: 7,
                        }}
                      />
                    ) : (
                      <Text style={styles.filterItemText}>{filters[key]}</Text>
                    )}
                    <Pressable
                      onPress={() => clearThisFilter(key)}
                      style={styles.filterCloseIcon}
                    >
                      <Ionicons
                        name="close"
                        size={14}
                        color={theme.colors.neutral(0.9)}
                      />
                    </Pressable>
                  </View>
                );
              })}
            </ScrollView>
          </View>
        )}

        <View>
          {images.length > 0 && <ImageGrid router={router} images={images} />}
        </View>

        <View
          style={{ marginBottom: 5, marginTop: images.length > 0 ? 10 : 70 }}
        >
          <ActivityIndicator size="large" />
        </View>
      </ScrollView>

      <FiltersModal
        modalRef={modalRef}
        onReset={handleResetFilters}
        onApply={handleApplyFilters}
        onClose={handleCloseModal}
        filters={filters}
        setFilters={setFilters}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    gap: 15,
  },
  header: {
    marginHorizontal: wp(4),
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  title: {
    fontSize: hp(4),
    fontWeight: theme.fontWeights.bold,
    color: "#e7001e",
  },
  searchBar: {
    marginHorizontal: wp(4),
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderWidth: 1,
    borderColor: theme.colors.gray,
    backgroundColor: theme.colors.white,
    borderRadius: theme.radius.lg,
    padding: 6,
    paddingLeft: 10,
  },
  searchIcon: {
    padding: 8,
  },
  searchInput: {
    flex: 1,
    borderRadius: theme.radius.sm,
    paddingVertical: 10,
    fontSize: hp(1.8),
  },
  closeIcon: {
    backgroundColor: theme.colors.neutral(0.1),
    borderRadius: theme.radius.sm,
    padding: 8,
  },

  filters: {
    paddingHorizontal: wp(4),
    gap: 10,
  },

  filterItem: {
    backgroundColor: theme.colors.gray,
    borderRadius: theme.radius.sm,
    padding: 8,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingHorizontal: 10,
  },

  filterItemText: {
    fontSize: hp(1.9),
  },
  filterCloseIcon: {
    backgroundColor: theme.colors.neutral(0.2),
    padding: 4,
    borderRadius: 7,
  },
});

export default HomeScreen;
