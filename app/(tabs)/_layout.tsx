import { Tabs } from "expo-router";
import React from "react";
import "react-native-gesture-handler";
import { TabBarIcon } from "@/components/navigation/TabBarIcon";
import { useColorScheme } from "@/hooks/useColorScheme";

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        tabBarStyle: {
          backgroundColor: "#ffffff",
        },
        tabBarActiveTintColor: "#24B7B8",
        tabBarInactiveTintColor: "#5c5b5b",
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
