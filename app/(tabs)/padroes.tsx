import React, { useState } from "react";
import {
  SafeAreaView,
  StatusBar,
  StyleSheet,
  TouchableOpacity,
  Platform,
  View,
} from "react-native";
import RNDateTimePicker, {
  DateTimePickerEvent,
} from "@react-native-community/datetimepicker";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import CalendarDayOfWeek from "@/components/DayOfWeek";
import Header from "@/components/Header";

export default function RegistroScreen() {
  const [showPicker, setShowPicker] = useState<
    "defaultTime" | "intervalTime" | null
  >(null);
  const [defaultTime, setDefaultTime] = useState<Date | null>(null);
  const [intervalTime, setIntervalTime] = useState<Date | null>(null);
  const [isDarkMode, setIsDarkMode] = useState(false);

  const onChange = (event: DateTimePickerEvent, selectedDate?: Date) => {
    if (event.type === "dismissed") {
      setShowPicker(null);
      return;
    }

    const currentDate = selectedDate || new Date();
    if (showPicker === "defaultTime") {
      setDefaultTime(currentDate);
    } else if (showPicker === "intervalTime") {
      setIntervalTime(currentDate);
    }
    setShowPicker(Platform.OS === "ios" ? showPicker : null);
  };

  const formatTime = (date: Date | null) => {
    if (!date) return "00:00";
    const hours = date.getHours().toString().padStart(2, "0");
    const minutes = date.getMinutes().toString().padStart(2, "0");
    return `${hours}:${minutes}`;
  };

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
  };

  const buttonStyle = (isSelected: boolean) => ({
    ...styles.confirmButtonHour,
    backgroundColor: isSelected ? "black" : "#ddd",
  });

  const buttonTextStyle = (isSelected: boolean) => ({
    ...styles.confirmButtonText,
    color: isSelected ? "white" : "black",
  });

  return (
    <SafeAreaView
      style={[
        styles.container,
        isDarkMode ? styles.darkBackground : styles.lightBackground,
      ]}
    >
      <StatusBar barStyle={isDarkMode ? "light-content" : "dark-content"} />
      <Header
        appName="Controle de Ponto"
        onToggleDarkMode={toggleDarkMode}
        isDarkMode={isDarkMode}
      />
      <View style={styles.content}>
        <ThemedView style={styles.titleContainer}>
          <ThemedText type="title">Padrões</ThemedText>
        </ThemedView>
        <ThemedView style={styles.stepContainer}>
          <ThemedText type="subtitle">Hora Padrão</ThemedText>
          <TouchableOpacity
            style={buttonStyle(!!defaultTime)}
            onPress={() => setShowPicker("defaultTime")}
          >
            <ThemedText type="subtitle" style={buttonTextStyle(!!defaultTime)}>
              {formatTime(defaultTime)}
            </ThemedText>
          </TouchableOpacity>
          {showPicker === "defaultTime" && (
            <RNDateTimePicker
              display="inline"
              mode="time"
              value={defaultTime || new Date()}
              onChange={onChange}
            />
          )}
        </ThemedView>
        <ThemedView style={styles.stepContainer}>
          <ThemedText type="subtitle">Dias da Semana</ThemedText>
          <CalendarDayOfWeek />
        </ThemedView>
        <ThemedView style={styles.stepContainer}>
          <ThemedText type="subtitle">Intervalo Padrão</ThemedText>
          <TouchableOpacity
            style={buttonStyle(!!intervalTime)}
            onPress={() => setShowPicker("intervalTime")}
          >
            <ThemedText type="subtitle" style={buttonTextStyle(!!intervalTime)}>
              {formatTime(intervalTime)}
            </ThemedText>
          </TouchableOpacity>
          {showPicker === "intervalTime" && (
            <RNDateTimePicker
              display="inline"
              mode="time"
              value={intervalTime || new Date()}
              onChange={onChange}
              locale="pt-BR"
            />
          )}
        </ThemedView>
        <TouchableOpacity style={styles.confirmButton}>
          <ThemedText type="subtitle" style={styles.confirmButtonText}>
            Confirmar
          </ThemedText>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    padding: 16,
  },
  darkBackground: {
    backgroundColor: "#f3efef",
  },
  lightBackground: {
    backgroundColor: "#f3efef",
  },
  titleContainer: {
    backgroundColor: "#f3efef",
    alignItems: "center",
    marginVertical: 16,
  },
  stepContainer: {
    height: "18%",
    padding: 16,
    marginBottom: 16,
    borderRadius: 12,
    backgroundColor: "#24B7B8",
  },
  confirmButtonHour: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    backgroundColor: "#ffffff",
    alignItems: "center",
    marginTop: 8,
    width: "100%",
  },
  confirmButton: {
    backgroundColor: "#000707",
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: "center",
    width: "100%",
  },
  confirmButtonText: {
    color: "#ffffff",
    fontSize: 16,
  },
});
