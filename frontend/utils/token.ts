// utils/token.ts
import AsyncStorage from "@react-native-async-storage/async-storage";

let token: string | null = null;

export const setToken = (value: string) => {
  token = value;
};

export const getToken = () => token;
