import React, { useState, useEffect } from "react";
import {
  SafeAreaView,
  StatusBar,
  StyleSheet,
  TouchableOpacity,
  Platform,
  View,
  TextStyle,
  ViewStyle,
} from "react-native";
import RNDateTimePicker, {
  DateTimePickerEvent,
} from "@react-native-community/datetimepicker";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import CalendarDayOfWeek from "@/components/DayOfWeek";
import Header from "@/components/Header";
import { useDarkMode } from "@/context/DarkModeContext";

export default function RegistroScreen() {
  const [showPicker, setShowPicker] = useState<
    "defaultTime" | "intervalTime" | null
  >(null);
  const [defaultTime, setDefaultTime] = useState<Date | null>(null);
  const [intervalTime, setIntervalTime] = useState<Date | null>(null);
  const [selectedDays, setSelectedDays] = useState<string[]>([]);
  const [isConfirmButtonDisabled, setIsConfirmButtonDisabled] = useState(true);
  const [confirmedDefaultTime, setConfirmedDefaultTime] = useState<Date | null>(
    null
  );
  const [confirmedIntervalTime, setConfirmedIntervalTime] =
    useState<Date | null>(null);
  const [confirmedDays, setConfirmedDays] = useState<string[]>([]);

  const { isDarkMode } = useDarkMode();

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
    if (Platform.OS === "ios") setShowPicker(null);
  };

  const formatTime = (date: Date | null) => {
    if (!date) return "00:00";
    const hours = date.getHours().toString().padStart(2, "0");
    const minutes = date.getMinutes().toString().padStart(2, "0");
    return `${hours}:${minutes}`;
  };

  const handleDaySelection = (day: string) => {
    setSelectedDays((prevSelectedDays) =>
      prevSelectedDays.includes(day)
        ? prevSelectedDays.filter((d) => d !== day)
        : [...prevSelectedDays, day]
    );
  };

  useEffect(() => {
    const hasChanges = () => {
      const isDefaultTimeChanged = defaultTime !== confirmedDefaultTime;
      const isIntervalTimeChanged = intervalTime !== confirmedIntervalTime;
      const areDaysChanged =
        selectedDays.sort().toString() !== confirmedDays.sort().toString();
      return isDefaultTimeChanged || isIntervalTimeChanged || areDaysChanged;
    };

    setIsConfirmButtonDisabled(!hasChanges());
  }, [
    defaultTime,
    intervalTime,
    selectedDays,
    confirmedDefaultTime,
    confirmedIntervalTime,
    confirmedDays,
  ]);

  const handleConfirm = () => {
    setConfirmedDefaultTime(defaultTime);
    setConfirmedIntervalTime(intervalTime);
    setConfirmedDays(selectedDays);
    setIsConfirmButtonDisabled(true);
    // Lógica para salvar os dados no banco de dados...
  };

  const buttonStyle = (isSelected: boolean): ViewStyle => ({
    backgroundColor: isSelected
      ? isDarkMode
        ? "#FFFFFF"
        : "#161B22"
      : isDarkMode
      ? "#010409"
      : "#bdb9b9",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 8,
    width: "100%",
  });

  const buttonTextStyle = (isSelected: boolean): TextStyle => ({
    color: isSelected
      ? isDarkMode
        ? "#000000"
        : "#FFFFFF"
      : isDarkMode
      ? "#FFFFFF"
      : "#161B22",
    fontSize: 16,
  });

  return (
    <SafeAreaView
      style={[
        styles.container,
        isDarkMode ? styles.darkBackground : styles.lightBackground,
      ]}
    >
      <StatusBar barStyle={isDarkMode ? "light-content" : "dark-content"} />
      <Header appName="Controle de Ponto" />
      <View style={styles.content}>
        <ThemedView style={styles.titleContainer}>
          <ThemedText
            type="title"
            style={isDarkMode ? styles.darkText : styles.lightText}
          >
            Padrões
          </ThemedText>
        </ThemedView>

        <ThemedView
          style={[
            styles.stepContainer,
            isDarkMode ? styles.darkStepContainer : styles.lightStepContainer,
          ]}
        >
          <ThemedText
            type="subtitle"
            style={isDarkMode ? styles.darkText : styles.lightText}
          >
            Hora Padrão
          </ThemedText>
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

        <ThemedView
          style={[
            styles.stepContainer,
            isDarkMode ? styles.darkStepContainer : styles.lightStepContainer,
          ]}
        >
          <ThemedText
            type="subtitle"
            style={isDarkMode ? styles.darkText : styles.lightText}
          >
            Dias da Semana
          </ThemedText>
          <CalendarDayOfWeek
            onDayChange={handleDaySelection}
            selectedDays={selectedDays}
          />
        </ThemedView>

        <ThemedView
          style={[
            styles.stepContainer,
            isDarkMode ? styles.darkStepContainer : styles.lightStepContainer,
          ]}
        >
          <ThemedText
            type="subtitle"
            style={isDarkMode ? styles.darkText : styles.lightText}
          >
            Intervalo Padrão
          </ThemedText>
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

        <TouchableOpacity
          style={[
            styles.confirmButton,
            isConfirmButtonDisabled && styles.disabledButton,
          ]}
          onPress={handleConfirm}
          disabled={isConfirmButtonDisabled}
        >
          <ThemedText type="subtitle" style={styles.confirmButtonText}>
            Confirmar
          </ThemedText>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { flex: 1, padding: 16 },
  darkBackground: { backgroundColor: "#010409" },
  lightBackground: { backgroundColor: "#F6F8FA" },
  titleContainer: {
    backgroundColor: "transparent",
    alignItems: "center",
    marginVertical: 16,
  },
  stepContainer: {
    height: "24%",
    padding: 16,
    marginBottom: 16,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  } as ViewStyle,
  confirmButton: {
    backgroundColor: "#1C8139",
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: "center",
    width: "100%",
  } as ViewStyle,
  confirmButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
  } as TextStyle,
  disabledButton: {
    backgroundColor: "#95D8A6",
  } as ViewStyle,
  lightText: { color: "#070707" },
  darkText: { color: "#FFFFFF" },
  lightStepContainer: { backgroundColor: "#FFFFFF" },
  darkStepContainer: { backgroundColor: "#161B22" },
});
