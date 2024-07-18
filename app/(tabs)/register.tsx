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
  const [showPicker, setShowPicker] = useState(false);
  const [date, setDate] = useState(new Date());
  const [isDarkMode, setIsDarkMode] = useState(false);

  const onChange = (event: DateTimePickerEvent, selectedDate?: Date) => {
    if (event.type === "dismissed") {
      setShowPicker(false);
      return;
    }
    const currentDate = selectedDate || date;
    setDate(currentDate);
    setShowPicker(Platform.OS === "ios");
  };

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
  };

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
            style={styles.confirmButtonHour}
            onPress={() => setShowPicker(true)}
          >
            <ThemedText type="subtitle">{`${date.getHours()}:${date.getMinutes()}`}</ThemedText>
          </TouchableOpacity>
          {showPicker && (
            <RNDateTimePicker
              display="spinner"
              mode="time"
              value={date}
              onChange={onChange}
              locale="pt-BR"
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
            style={styles.confirmButtonHour}
            onPress={() => setShowPicker(true)}
          >
            <ThemedText type="subtitle">{`${date.getHours()}:${date.getMinutes()}`}</ThemedText>
          </TouchableOpacity>
          {showPicker && (
            <RNDateTimePicker
              display="spinner"
              mode="time"
              value={date}
              onChange={onChange}
              locale="pt-BR"
            />
          )}
        </ThemedView>
        <TouchableOpacity style={styles.confirmButton}>
          <ThemedText type="subtitle" style={styles.confirmButtonText}>
            Definir
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
    backgroundColor: "#f3efef", // Fundo principal
  },
  lightBackground: {
    backgroundColor: "#f3efef", // Fundo principal
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
    backgroundColor: "#24B7B8", // Componentes
  },
  confirmButtonHour: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    backgroundColor: "#ffffff", // Acento
    alignItems: "center",
    marginTop: 8,
    width: "100%",
  },
  confirmButton: {
    backgroundColor: "#000707", // Acento
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: "center",
    width: "100%",
  },
  confirmButtonText: {
    color: "#ffffff", // Fundo principal
    fontSize: 16,
  },
});
