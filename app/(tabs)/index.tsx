import {
  StyleSheet,
  TouchableOpacity,
  View,
  Platform,
  SafeAreaView,
  StatusBar,
} from "react-native";
import { ThemedText } from "@/components/ThemedText";
import { useState } from "react";
import RNDateTimePicker from "@react-native-community/datetimepicker";
import Header from "@/components/Header";
import { useDarkMode } from "@/context/DarkModeContext";
import { ThemedView } from "@/components/ThemedView";
import TimelineVertical from "@/components/TimelineVertical";

export default function TabTwoScreen() {
  const [showPicker, setShowPicker] = useState(false);
  const [date, setDate] = useState(new Date());

  const onChange = (event: any, selectedDate?: Date) => {
    if (event.type === "dismissed") {
      setShowPicker(false);
      return;
    }
    const currentDate = selectedDate || date;
    setDate(currentDate);
    if (Platform.OS === "ios") setShowPicker(false);
  };

  const { isDarkMode } = useDarkMode();

  const timelineItems = [
    { title: "Entrada", description: "Início do expediente", date: "08:00" },
    {
      title: "Saída para Almoço",
      description: "Pausa para o almoço",
      date: "12:00",
    },
    {
      title: "Retorno do Almoço",
      description: "Volta do almoço",
      date: "13:00",
    },
    { title: "Saída", description: "Fim do expediente", date: "17:00" },
  ];

  return (
    <SafeAreaView
      style={[
        styles.container,
        isDarkMode ? styles.darkBackground : styles.lightBackground,
      ]}
    >
      <StatusBar barStyle={isDarkMode ? "light-content" : "dark-content"} />
      <Header appName="Registro de Ponto" />
      <View style={styles.content}>
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
            Banco de horas:
          </ThemedText>
        </ThemedView>

        <TimelineVertical
          items={timelineItems}
          currentIndex={2}
          isDarkMode={isDarkMode}
        />
      </View>

      <TouchableOpacity
        style={styles.floatingButton}
        onPress={() => setShowPicker(true)}
      >
        <ThemedText style={styles.buttonText}>+</ThemedText>
        {showPicker && (
          <RNDateTimePicker
            display="spinner"
            mode="time"
            value={date}
            onChange={onChange}
            locale="pt-BR"
          />
        )}
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  floatingButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#161B22",
    position: "absolute",
    bottom: 20,
    right: 20,
    alignItems: "center",
    justifyContent: "center",
    elevation: 3,
    shadowColor: "#000",
    shadowOpacity: 0.3,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
  buttonText: {
    fontSize: 24,
    color: "white",
  },
  container: { flex: 1 },
  content: {
    flex: 1,
    padding: 16,
    justifyContent: "center",
  },
  darkBackground: { backgroundColor: "#010409" },
  lightBackground: { backgroundColor: "#F6F8FA" },
  stepContainer: {
    padding: 16,
    marginBottom: 16,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  lightText: { color: "#070707" },
  darkText: { color: "#FFFFFF" },
  lightStepContainer: { backgroundColor: "#FFFFFF" },
  darkStepContainer: { backgroundColor: "#161B22" },
});
