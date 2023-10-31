import Constants from "expo-constants";
import axios from "axios";

export const _endpoint = "https://api.openai.com/v1/chat/completions";
export const _model = "gpt-3.5-turbo";

export const _client = axios.create({
  headers: {
    Authorization: `Bearer ${Constants.expoConfig?.extra?.OPENAI_API_KEY}`,
    "Content-Type": "application/json",
  },
});

