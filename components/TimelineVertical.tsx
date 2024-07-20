import React from "react";
import { View, Text, StyleSheet } from "react-native";

interface TimelineVerticalProps {
  items: { title: string; description: string; date: string }[];
  currentIndex: number;
  isDarkMode: boolean;
}

const TimelineVertical: React.FC<TimelineVerticalProps> = ({
  items,
  currentIndex,
  isDarkMode,
}) => {
  return (
    <View
      style={[
        styles.container,
        isDarkMode ? styles.darkContainer : styles.lightContainer,
      ]}
    >
      {items.map((item, index) => (
        <View key={index} style={styles.itemContainer}>
          <View
            style={[
              styles.dot,
              {
                backgroundColor: index <= currentIndex ? "#1C8139" : "#e0e0e0",
                borderColor: isDarkMode ? "#444" : "#fff",
              },
            ]}
          />
          <View style={styles.textContainer}>
            <Text
              style={[
                styles.title,
                isDarkMode ? styles.darkText : styles.lightText,
              ]}
            >
              {item.title}
            </Text>
            <Text
              style={[
                styles.description,
                isDarkMode ? styles.darkText : styles.lightText,
              ]}
            >
              {item.description}
            </Text>
            <Text
              style={[
                styles.date,
                isDarkMode ? styles.darkText : styles.lightText,
              ]}
            >
              {item.date}
            </Text>
          </View>
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: 16,
  },
  darkContainer: {
    borderLeftColor: "#444",
  },
  lightContainer: {
    borderLeftColor: "#e0e0e0",
  },
  itemContainer: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 24,
  },
  dot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 16,
    borderWidth: 2,
  },
  textContainer: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 4,
  },
  description: {
    fontSize: 14,
    marginBottom: 4,
  },
  date: {
    fontSize: 12,
    color: "#888",
  },
  darkText: {
    color: "#fff",
  },
  lightText: {
    color: "#000",
  },
});

export default TimelineVertical;
