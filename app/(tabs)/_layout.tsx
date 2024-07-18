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
          backgroundColor: "#ffffff", // Componentes
        },
        tabBarActiveTintColor: "#24B7B8", // Acento
        tabBarInactiveTintColor: "#5c5b5b", // Cor para ícones inativos
        headerShown: false,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "History",
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon
              name={focused ? "time" : "time-outline"} // Ícone de histórico
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
              name={focused ? "home" : "home-outline"} // Ícone de casa
              color={color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="register"
        options={{
          title: "Config",
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon
              name={focused ? "settings" : "settings-outline"} // Ícone de engrenagem
              color={color}
            />
          ),
        }}
      />
    </Tabs>
  );
}
