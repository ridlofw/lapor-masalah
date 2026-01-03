import { Tabs } from "expo-router";
import { Text, View, StyleSheet } from "react-native";
import { COLORS } from "@/constants/config";

function TabBarIcon({ name, focused }: { name: string; focused: boolean }) {
    const icons: Record<string, string> = {
        "Buat Laporan": "📝",
        "Laporan Saya": "📋",
    };

    return (
        <View style={styles.iconContainer}>
            <Text style={styles.icon}>{icons[name]}</Text>
        </View>
    );
}

export default function TabsLayout() {
    return (
        <Tabs
            screenOptions={{
                tabBarActiveTintColor: COLORS.primary,
                tabBarInactiveTintColor: COLORS.gray[400],
                tabBarStyle: {
                    backgroundColor: COLORS.white,
                    borderTopWidth: 1,
                    borderTopColor: COLORS.gray[100],
                    paddingTop: 8,
                    paddingBottom: 8,
                    height: 70,
                },
                tabBarLabelStyle: {
                    fontSize: 12,
                    fontWeight: "600",
                    marginTop: 4,
                },
                headerStyle: {
                    backgroundColor: COLORS.white,
                    elevation: 0,
                    shadowOpacity: 0,
                    borderBottomWidth: 1,
                    borderBottomColor: COLORS.gray[100],
                },
                headerTitleStyle: {
                    fontWeight: "bold",
                    fontSize: 18,
                    color: COLORS.gray[900],
                },
            }}
        >
            <Tabs.Screen
                name="index"
                options={{
                    title: "Buat Laporan",
                    headerShown: false,
                    tabBarIcon: ({ focused }) => (
                        <TabBarIcon name="Buat Laporan" focused={focused} />
                    ),
                }}
            />
            <Tabs.Screen
                name="laporan-saya"
                options={{
                    title: "Laporan Saya",
                    headerShown: false,
                    tabBarIcon: ({ focused }) => (
                        <TabBarIcon name="Laporan Saya" focused={focused} />
                    ),
                }}
            />
            <Tabs.Screen
                name="report-detail"
                options={{
                    href: null, // Hide from tab bar
                    headerShown: false,
                }}
            />
        </Tabs>
    );
}

const styles = StyleSheet.create({
    iconContainer: {
        alignItems: "center",
        justifyContent: "center",
    },
    icon: {
        fontSize: 24,
    },
});
