import axios from "axios";

const API_KEY = process.env.EXPO_PUBLIC_API_KEY;
const API_URL = `${process.env.EXPO_PUBLIC_API_URL}/?key=${API_KEY}`;

const formatUrl = (params) => {
  let url = API_URL + "&per_page=25&safesearch=true&editors_choice=true";

  if (!params) return url;

  let paramKeys = Object.keys(params);

  paramKeys.map((key) => {
    let value = key == "q" ? encodeURIComponent(params[key]) : params[key];
    url += `&${key}=${value}`;
  });

  return url;
};

export const apiCall = async (params) => {
  try {
    const response = await axios.get(formatUrl(params));

    const { data } = response;

    return {
      success: true,
      data,
    };
  } catch (error) {
    return {
      success: false,
      message: error.message,
    };
  }
};
