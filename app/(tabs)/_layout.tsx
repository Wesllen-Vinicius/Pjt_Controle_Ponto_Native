import React from "react";
import { Tabs } from "expo-router";
import "react-native-gesture-handler";
import { TabBarIcon } from "@/components/navigation/TabBarIcon";
import { useDarkMode } from "@/context/DarkModeContext";

export default function TabLayout() {
  const { isDarkMode } = useDarkMode();

  return (
    <Tabs
      screenOptions={{
        tabBarStyle: {
          backgroundColor: isDarkMode ? "#161B22" : "#ffffff",
        },
        tabBarActiveTintColor: isDarkMode ? "#ffffff" : "#24B7B8",
        tabBarInactiveTintColor: isDarkMode ? "#ffffff" : "#5c5b5b",
        headerShown: false,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "History",
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon
              name={focused ? "time" : "time-outline"}
              color={color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="explore"
        options={{
          title: "Home",
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon
              name={focused ? "home" : "home-outline"}
              color={color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="padroes"
        options={{
          title: "Config",
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon
              name={focused ? "settings" : "settings-outline"}
              color={color}
            />
          ),
        }}
      />
    </Tabs>
  );
}
