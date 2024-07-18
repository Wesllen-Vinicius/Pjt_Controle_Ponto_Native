import { Image, Platform, StyleSheet, TouchableOpacity } from "react-native";
import ParallaxScrollView from "@/components/ParallaxScrollView";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import RNDateTimePicker, {
  DateTimePickerEvent,
} from "@react-native-community/datetimepicker";
import { useState } from "react";
import CalendarDayOfWeek from "@/components/DayOfWeek";

export default function RegistroScreen() {
  const [showPicker, setShowPicker] = useState(false);
  const [date, setDate] = useState(new Date());

  const onChange = (
    event: DateTimePickerEvent,
    selectedDate?: Date | undefined
  ) => {
    if (event.type === "dismissed") {
      setShowPicker(false);
      return;
    }
    const currentDate = selectedDate || date;
    setDate(currentDate);
    setShowPicker(Platform.OS === "ios");
  };

  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: "#A1CEDC", dark: "#1D3D47" }}
      headerImage={
        <Image
          source={require("@/assets/images/partial-react-logo.png")}
          style={styles.reactLogo}
        />
      }
    >
      <ThemedView style={styles.titleContainer}>
        <ThemedText type="title">Padrões</ThemedText>
      </ThemedView>
      <ThemedView style={styles.stepContainer}>
        <ThemedText type="subtitle">Hora Padrão</ThemedText>

        <TouchableOpacity
          style={styles.confirmButtonHour}
          onPress={() => setShowPicker(true)}
        >
          <ThemedText type="subtitle">08:09</ThemedText>
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
        <ThemedText type="subtitle">
          <CalendarDayOfWeek />
        </ThemedText>
      </ThemedView>

      <ThemedView style={styles.stepContainer}>
        <ThemedText type="subtitle">Intervalo Padrão</ThemedText>
        <TouchableOpacity
          style={styles.confirmButtonHour}
          onPress={() => setShowPicker(true)}
        >
          <ThemedText type="subtitle">08:09</ThemedText>
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
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    padding: 16,
  },
  stepContainer: {
    padding: 16,
    gap: 8,
    marginBottom: 8,
    backgroundColor: "white",
    borderRadius: 8,
    elevation: 1,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
  reactLogo: {
    height: 178,
    width: 290,
    bottom: 0,
    left: 0,
    position: "absolute",
  },
  dateTimePicker: {
    width: "100%",
    marginVertical: 8,
  },
  confirmButton: {
    backgroundColor: "#1D3D47",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: "center",
  },
  confirmButtonHour: {
    backgroundColor: "#777a7a76",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: "center",
  },
  confirmButtonText: {
    color: "white",
    fontSize: 16,
  },
});
