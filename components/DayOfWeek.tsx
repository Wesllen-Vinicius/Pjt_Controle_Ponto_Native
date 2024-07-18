import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";

const CalendarDayOfWeek: React.FC = () => {
  const [selectedDays, setSelectedDays] = useState<string[]>([]);

  const daysOfWeek: string[] = [
    "Dom",
    "Seg",
    "Ter",
    "Qua",
    "Qui",
    "Sex",
    "Sab",
  ];

  const toggleDay = (day: string) => {
    setSelectedDays((prevSelectedDays) =>
      prevSelectedDays.includes(day)
        ? prevSelectedDays.filter((d) => d !== day)
        : [...prevSelectedDays, day]
    );
  };

  return (
    <View style={styles.container}>
      {daysOfWeek.map((day) => (
        <TouchableOpacity
          key={day}
          style={[
            styles.dayButton,
            selectedDays.includes(day) && styles.selectedDayButton,
          ]}
          onPress={() => toggleDay(day)}
        >
          <Text
            style={[
              styles.dayButtonText,
              selectedDays.includes(day) && styles.selectedDayButtonText,
            ]}
          >
            {day}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
    padding: 2,
  },
  dayButton: {
    backgroundColor: "#DDDDDD",
    padding: 5,
    margin: 5,
    borderRadius: 5,
  },
  selectedDayButton: {
    backgroundColor: "#007BFF",
  },
  dayButtonText: {
    fontSize: 16,
    color: "#000000",
  },
  selectedDayButtonText: {
    color: "#FFFFFF",
  },
});

export default CalendarDayOfWeek;
