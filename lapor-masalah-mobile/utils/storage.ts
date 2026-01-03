import * as SecureStore from "expo-secure-store";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Platform } from "react-native";

const TOKEN_KEY = "auth_token";
const USER_KEY = "user_data";

// Use SecureStore for native, AsyncStorage for web
const isWeb = Platform.OS === "web";

export interface User {
    id: string;
    email: string;
    name: string;
    role: string;
    avatar?: string;
    dinasId?: string;
    dinasType?: string;
}

export const storage = {
    async getToken(): Promise<string | null> {
        try {
            if (isWeb) {
                return await AsyncStorage.getItem(TOKEN_KEY);
            }
            return await SecureStore.getItemAsync(TOKEN_KEY);
        } catch (error) {
            console.error("Error getting token:", error);
            return null;
        }
    },

    async saveToken(token: string): Promise<void> {
        try {
            if (isWeb) {
                await AsyncStorage.setItem(TOKEN_KEY, token);
            } else {
                await SecureStore.setItemAsync(TOKEN_KEY, token);
            }
        } catch (error) {
            console.error("Error saving token:", error);
        }
    },

    async removeToken(): Promise<void> {
        try {
            if (isWeb) {
                await AsyncStorage.removeItem(TOKEN_KEY);
            } else {
                await SecureStore.deleteItemAsync(TOKEN_KEY);
            }
        } catch (error) {
            console.error("Error removing token:", error);
        }
    },

    async getUser(): Promise<User | null> {
        try {
            const data = isWeb
                ? await AsyncStorage.getItem(USER_KEY)
                : await SecureStore.getItemAsync(USER_KEY);
            return data ? JSON.parse(data) : null;
        } catch (error) {
            console.error("Error getting user:", error);
            return null;
        }
    },

    async saveUser(user: User): Promise<void> {
        try {
            const data = JSON.stringify(user);
            if (isWeb) {
                await AsyncStorage.setItem(USER_KEY, data);
            } else {
                await SecureStore.setItemAsync(USER_KEY, data);
            }
        } catch (error) {
            console.error("Error saving user:", error);
        }
    },

    async removeUser(): Promise<void> {
        try {
            if (isWeb) {
                await AsyncStorage.removeItem(USER_KEY);
            } else {
                await SecureStore.deleteItemAsync(USER_KEY);
            }
        } catch (error) {
            console.error("Error removing user:", error);
        }
    },

    async clearAll(): Promise<void> {
        await this.removeToken();
        await this.removeUser();
    },
};
