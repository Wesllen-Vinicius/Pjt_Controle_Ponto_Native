import React, { useEffect, useState } from "react";
import {
  View,
  TouchableOpacity,
  StyleSheet,
  Platform,
  StatusBar,
  Animated,
} from "react-native";
import { useDarkMode } from "../context/DarkModeContext";
import { useAnimation } from "../context/AnimationContext";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";

interface HeaderProps {
  appName: string;
}

const Header: React.FC<HeaderProps> = ({ appName }) => {
  const { isDarkMode, toggleDarkMode } = useDarkMode();
  const { themeAnimation, transitionDuration } = useAnimation();

  const [iconColor, setIconColor] = useState<string>("#000000");

  useEffect(() => {
    // Animação da cor do ícone
    Animated.timing(themeAnimation, {
      toValue: isDarkMode ? 1 : 0,
      duration: transitionDuration,
      useNativeDriver: false,
    }).start();
  }, [isDarkMode, transitionDuration, themeAnimation]);

  useEffect(() => {
    themeAnimation.addListener(({ value }) => {
      setIconColor(value === 1 ? "#ffffff" : "#000000");
    });

    return () => themeAnimation.removeAllListeners();
  }, [themeAnimation]);

  const backgroundInterpolation = themeAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: ["#F6F8FA", "#161B22"],
  });

  const textInterpolation = themeAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: ["#070707", "#ffffff"],
  });

  return (
    <Animated.View
      style={[
        styles.headerContainer,
        { backgroundColor: backgroundInterpolation },
      ]}
    >
      <View style={styles.header}>
        <Animated.Text style={[styles.appName, { color: textInterpolation }]}>
          {appName}
        </Animated.Text>
        <TouchableOpacity onPress={toggleDarkMode} style={styles.iconContainer}>
          <Icon
            name={isDarkMode ? "weather-sunny" : "moon-waning-crescent"}
            size={24}
            color={iconColor}
          />
        </TouchableOpacity>
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  appName: {
    fontSize: 20,
    fontWeight: "bold",
  },
  iconContainer: {
    padding: 10,
  },
  headerContainer: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
  },
  header: {
    height: 60,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
  },
});

export default Header;
