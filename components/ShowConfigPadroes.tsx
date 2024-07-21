import React, { useState, useEffect } from "react";
import { SafeAreaView, StatusBar, StyleSheet, Text, View } from "react-native";
import { useDarkMode } from "@/context/DarkModeContext";
import { useConfigTable } from "@/database/useConfigTable";
import { Config } from "@/database/useConfigTable";

const ShowConfigPadroes = () => {
  const [record, setRecord] = useState<Config | null>(null);
  const [loading, setLoading] = useState(true);
  const [isShowingLoading, setIsShowingLoading] = useState(true);
  const { isDarkMode } = useDarkMode();
  const { show } = useConfigTable();

  const fetchRecord = async () => {
    setLoading(true);
    setIsShowingLoading(true);
    try {
      const id = 1;
      const result = await show(id);
      setRecord(result);
    } catch (error) {
      console.error("Erro ao buscar registro:", error);
    } finally {
      setLoading(false);
      setTimeout(() => {
        setIsShowingLoading(false);
      }, 2000);
    }
  };

  useEffect(() => {
    fetchRecord();
    const intervalId = setInterval(() => {
      fetchRecord();
    }, 20000);
    return () => clearInterval(intervalId);
  }, []);

  const formatDate = (date: Date | undefined) => {
    if (!date) return "Não disponível";
    const hours = date.getHours().toString().padStart(2, "0");
    const minutes = date.getMinutes().toString().padStart(2, "0");
    return `${hours}:${minutes}`;
  };

  const formatDays = (days: string[] | undefined) => {
    if (!days || !Array.isArray(days)) return "Não disponível";
    const daysOfWeek: { [key: string]: string } = {
      Dom: "Domingo",
      Seg: "Segunda-feira",
      Ter: "Terça-feira",
      Qua: "Quarta-feira",
      Qui: "Quinta-feira",
      Sex: "Sexta-feira",
      Sab: "Sábado",
    };

    return days.map((day) => daysOfWeek[day] || day).join(", ");
  };

  return (
    <SafeAreaView
      style={[
        styles.container,
        isDarkMode ? styles.darkBackground : styles.lightBackground,
      ]}
    >
      <StatusBar barStyle={isDarkMode ? "light-content" : "dark-content"} />
      <View style={styles.content}>
        <Text style={styles.text}>Log: </Text>
        {isShowingLoading || loading ? (
          <Text style={styles.text}>Carregando...</Text>
        ) : record ? (
          <View style={styles.recordContainer}>
            <Text style={styles.text}>
              Hora Padrão:{" "}
              <Text style={styles.value}>{formatDate(record.horapadrao)}</Text>
            </Text>
            <Text style={styles.text}>
              Intervalo Padrão:{" "}
              <Text style={styles.value}>
                {formatDate(record.intervalopadrao)}
              </Text>
            </Text>
            <Text style={styles.text}>
              Dias da Semana:{" "}
              <Text style={styles.value}>
                {formatDays(record.diasdasemana)}
              </Text>
            </Text>
          </View>
        ) : (
          <Text style={styles.text}>Nenhum registro encontrado.</Text>
        )}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    padding: 16,
    backgroundColor: "#6200EE",
    borderBottomWidth: 1,
    borderBottomColor: "#E0E0E0",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#FFFFFF",
  },
  darkTitle: { color: "#000000" },
  content: { flex: 1, padding: 16 },
  recordContainer: { marginTop: 16 },
  darkBackground: { backgroundColor: "#010409" },
  lightBackground: { backgroundColor: "#F6F8FA" },
  text: { color: "#070707", fontSize: 16 },
  value: { fontWeight: "bold" },
});

export default ShowConfigPadroes;
