import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Platform,
  StatusBar,
} from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";

interface HeaderProps {
  appName: string;
  onToggleDarkMode: () => void;
  isDarkMode: boolean;
}

const Header: React.FC<HeaderProps> = ({
  appName,
  onToggleDarkMode,
  isDarkMode,
}) => {
  return (
    <View style={styles.headerContainer}>
      <View style={styles.header}>
        <Text style={styles.appName}>{appName}</Text>
        <TouchableOpacity
          onPress={onToggleDarkMode}
          style={styles.iconContainer}
        >
          <Icon
            name={isDarkMode ? "brightness-3" : "brightness-7"}
            size={24}
            color="#070707"
          />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    backgroundColor: "#24B7B8",
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
  },
  header: {
    height: 60,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
  },
  appName: {
    color: "#000000",
    fontSize: 20,
    fontWeight: "bold",
  },
  iconContainer: {
    padding: 10,
  },
});

export default Header;
