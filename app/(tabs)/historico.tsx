import React, { useState } from "react";
import {
  SafeAreaView,
  StatusBar,
  TouchableOpacity,
  FlatList,
  View,
  Text,
  StyleSheet,
  ViewStyle,
  TextStyle,
} from "react-native";
import Header from "@/components/Header";
import { useDarkMode } from "@/context/DarkModeContext";
import RNDateTimePicker from "@react-native-community/datetimepicker";

const exampleRecords = [
  {
    date: "15/07/2024",
    records: [
      { time: "08:00", type: "Entrada" },
      { time: "12:00", type: "Saída para almoço" },
      { time: "13:00", type: "Retorno do almoço" },
      { time: "17:00", type: "Saída" },
    ],
  },
  {
    date: "14/07/2024",
    records: [
      { time: "08:05", type: "Entrada" },
      { time: "17:05", type: "Saída" },
    ],
  },
];

const HistoryScreen = () => {
  const [expandedDay, setExpandedDay] = useState<string | null>(null);
  const [startDate, setStartDate] = useState<Date | undefined>(undefined);
  const [endDate, setEndDate] = useState<Date | undefined>(undefined);
  const [showStartDatePicker, setShowStartDatePicker] = useState(false);
  const [showEndDatePicker, setShowEndDatePicker] = useState(false);
  const { isDarkMode } = useDarkMode();

  const handleToggleExpand = (date: string) => {
    setExpandedDay(expandedDay === date ? null : date);
  };

  const renderRecordItem = ({
    item,
  }: {
    item: { time: string; type: string };
  }) => (
    <View
      style={[
        styles.recordItem,
        { backgroundColor: isDarkMode ? "#161B22" : "#FFFFFF" },
      ]}
    >
      <Text
        style={[
          styles.recordText,
          { color: isDarkMode ? "#FFFFFF" : "#070707" },
        ]}
      >
        {item.time} - {item.type}
      </Text>
    </View>
  );

  const renderDayItem = ({ item }: { item: (typeof exampleRecords)[0] }) => (
    <View
      style={[
        styles.dayContainer,
        {
          backgroundColor: isDarkMode ? "#161B22" : "#FFFFFF",
          borderColor: isDarkMode ? "#1F1B1B" : "#DDDDDD",
        },
        expandedDay === item.date ? styles.selectedDay : {},
      ]}
    >
      <TouchableOpacity
        style={styles.dayHeader}
        onPress={() => handleToggleExpand(item.date)}
      >
        <Text
          style={{ color: isDarkMode ? "#FFFFFF" : "#070707", fontSize: 16 }}
        >
          {item.date}
        </Text>
      </TouchableOpacity>
      {expandedDay === item.date && (
        <FlatList
          data={item.records}
          renderItem={renderRecordItem}
          keyExtractor={(record) => record.time}
          style={styles.recordList}
        />
      )}
    </View>
  );

  return (
    <SafeAreaView
      style={[
        styles.container,
        { backgroundColor: isDarkMode ? "#010409" : "#F6F8FA" },
      ]}
    >
      <StatusBar barStyle={isDarkMode ? "light-content" : "dark-content"} />
      <Header appName="Histórico" />
      <View style={styles.content}>
        <View style={styles.dateRangeContainer}>
          <TouchableOpacity
            onPress={() => setShowStartDatePicker(true)}
            style={[
              styles.dateInput,
              { backgroundColor: isDarkMode ? "#161B22" : "#FFFFFF" },
            ]}
          >
            <Text style={{ color: isDarkMode ? "#FFFFFF" : "#070707" }}>
              {startDate ? startDate.toLocaleDateString() : "Início"}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setShowEndDatePicker(true)}
            style={[
              styles.dateInput,
              { backgroundColor: isDarkMode ? "#161B22" : "#FFFFFF" },
            ]}
          >
            <Text style={{ color: isDarkMode ? "#FFFFFF" : "#070707" }}>
              {endDate ? endDate.toLocaleDateString() : "Fim"}
            </Text>
          </TouchableOpacity>
        </View>
        {showStartDatePicker && (
          <RNDateTimePicker
            value={startDate || new Date()}
            mode="date"
            display="default"
            onChange={(event, selectedDate) => {
              setShowStartDatePicker(false);
              if (selectedDate) {
                setStartDate(selectedDate);
              }
            }}
          />
        )}
        {showEndDatePicker && (
          <RNDateTimePicker
            value={endDate || new Date()}
            mode="date"
            display="default"
            onChange={(event, selectedDate) => {
              setShowEndDatePicker(false);
              if (selectedDate) {
                setEndDate(selectedDate);
              }
            }}
          />
        )}
        <TouchableOpacity
          style={[
            styles.searchButton,
            { backgroundColor: isDarkMode ? "#1F1B1B" : "#1C8139" },
          ]}
        >
          <Text
            style={{ color: isDarkMode ? "#FFFFFF" : "#FFFFFF", fontSize: 16 }}
          >
            Buscar
          </Text>
        </TouchableOpacity>
        <FlatList
          data={exampleRecords}
          renderItem={renderDayItem}
          keyExtractor={(item) => item.date}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: {
    flex: 1,
    marginTop: 16,
    paddingHorizontal: 16,
  } as ViewStyle,
  dateRangeContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 16,
  } as ViewStyle,
  dateInput: {
    borderWidth: 0.2,
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 4,
    alignItems: "center",
    marginHorizontal: 8,
  } as ViewStyle,
  searchButton: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 16,
    width: "100%",
  } as ViewStyle,
  dayContainer: {
    marginBottom: 8,
    borderRadius: 8,
    overflow: "hidden",
    width: "100%",
    borderWidth: 1,
  } as ViewStyle,
  dayHeader: {
    padding: 16,
    borderRadius: 8,
    width: "100%",
    justifyContent: "center",
    borderBottomWidth: 1,
    borderBottomColor: "#000000",
  } as ViewStyle,
  recordList: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderTopWidth: 1,
    borderTopColor: "#DDDDDD",
  } as ViewStyle,
  recordItem: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#DDDDDD",
    width: "100%",
  } as ViewStyle,
  selectedDay: {
    color: "#ffffff",
    borderColor: "#A8C1FF",
    borderWidth: 2,
  },
  recordText: {
    fontSize: 16,
    lineHeight: 24,
  } as TextStyle,
});

export default HistoryScreen;
