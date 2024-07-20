import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";

const CalendarDayOfWeek: React.FC<{
  onDayChange: (day: string) => void;
  selectedDays: string[];
}> = ({ onDayChange, selectedDays }) => {
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
    onDayChange(day);
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
          accessibilityLabel={`Selecionar ${day}`}
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
    flexDirection: "row",
    justifyContent: "space-around",
    padding: 10,
  },
  dayButton: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
    backgroundColor: "#F6F8FA",
    padding: 6,
    margin: 5,
    borderRadius: 5,
  },
  selectedDayButton: {
    backgroundColor: "#161B22",
  },
  dayButtonText: {
    fontSize: 16,
    color: "#000000",
  },
  selectedDayButtonText: {
    color: "#ffffff",
  },
});

export default CalendarDayOfWeek;
