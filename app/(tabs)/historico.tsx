import React, { useState, useEffect } from 'react';
import {
    SafeAreaView,
    StatusBar,
    TouchableOpacity,
    FlatList,
    View,
    Text,
    StyleSheet,
    ViewStyle,
} from 'react-native';
import Header from '@/components/Header';
import { useDarkMode } from '@/context/DarkModeContext';
import DatePicker from '@/components/DatePicker';
import RecordItemHistorico from '@/components/RecordItemHistorico';
import { useHistoryTable, Registro } from '@/database/useHistoryTable';

const HistoryScreen: React.FC = () => {
    const [expandedDay, setExpandedDay] = useState<string | null>(null);
    const [startDate, setStartDate] = useState<Date | undefined>(undefined);
    const [endDate, setEndDate] = useState<Date | undefined>(undefined);
    const [showStartDatePicker, setShowStartDatePicker] = useState(false);
    const [showEndDatePicker, setShowEndDatePicker] = useState(false);
    const [records, setRecords] = useState<Registro[]>([]);
    const { isDarkMode } = useDarkMode();
    const { show } = useHistoryTable();

    useEffect(() => {
        fetchRecords();
    }, [startDate, endDate]);

    const fetchRecords = async () => {
        try {
            const fetchedRecords = await show(startDate, endDate);
            setRecords(fetchedRecords);
        } catch (error) {
            console.error('Erro ao buscar registros:', error);
        }
    };

    const handleToggleExpand = (date: string) => {
        setExpandedDay(expandedDay === date ? null : date);
    };

    const filteredRecords = records.filter((record) => {
        const recordDate = record.data.toLocaleDateString();
        const start = startDate ? startDate.toLocaleDateString() : '';
        const end = endDate ? endDate.toLocaleDateString() : '';
        return (
            (!startDate || recordDate >= start) &&
            (!endDate || recordDate <= end)
        );
    });

    const groupRecordsByDate = (records: Registro[]) => {
        return records.reduce(
            (groups: { [key: string]: Registro[] }, record) => {
                const date = record.data.toLocaleDateString();
                if (!groups[date]) {
                    groups[date] = [];
                }
                groups[date].push(record);
                return groups;
            },
            {}
        );
    };

    const groupedRecords = groupRecordsByDate(filteredRecords);

    const renderDayItem = ({
        item,
    }: {
        item: { date: string; records: Registro[] };
    }) => {
        return (
            <View
                style={[
                    styles.dayContainer,
                    {
                        backgroundColor: isDarkMode ? '#161B22' : '#FFFFFF',
                        borderColor: isDarkMode ? '#1F1B1B' : '#DDDDDD',
                    },
                    expandedDay === item.date ? styles.selectedDay : {},
                ]}
            >
                <TouchableOpacity
                    style={styles.dayHeader}
                    onPress={() => handleToggleExpand(item.date)}
                >
                    <Text
                        style={{
                            color: isDarkMode ? '#FFFFFF' : '#070707',
                            fontSize: 16,
                        }}
                    >
                        {item.date}
                    </Text>
                </TouchableOpacity>
                {expandedDay === item.date && (
                    <FlatList
                        data={item.records}
                        renderItem={({ item }) => (
                            <RecordItemHistorico
                                time={item.data.toLocaleTimeString([], {
                                    hour: '2-digit',
                                    minute: '2-digit',
                                })}
                                isDarkMode={isDarkMode}
                                type={'Entrada/Saída'} // Ajuste isso conforme necessário
                            />
                        )}
                        keyExtractor={(record) => record.id.toString()}
                        style={styles.recordList}
                    />
                )}
            </View>
        );
    };

    const dayItems = Object.keys(groupedRecords).map((date) => ({
        date,
        records: groupedRecords[date],
    }));

    return (
        <SafeAreaView
            style={[
                styles.container,
                { backgroundColor: isDarkMode ? '#010409' : '#F6F8FA' },
            ]}
        >
            <StatusBar
                barStyle={isDarkMode ? 'light-content' : 'dark-content'}
            />
            <Header appName="Histórico" />
            <View style={styles.content}>
                <View style={styles.dateRangeContainer}>
                    <TouchableOpacity
                        onPress={() => setShowStartDatePicker(true)}
                        style={[
                            styles.dateInput,
                            {
                                backgroundColor: isDarkMode
                                    ? '#161B22'
                                    : '#FFFFFF',
                            },
                        ]}
                    >
                        <Text
                            style={{
                                color: isDarkMode ? '#FFFFFF' : '#070707',
                            }}
                        >
                            {startDate
                                ? startDate.toLocaleDateString()
                                : 'Início'}
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={() => setShowEndDatePicker(true)}
                        style={[
                            styles.dateInput,
                            {
                                backgroundColor: isDarkMode
                                    ? '#161B22'
                                    : '#FFFFFF',
                            },
                        ]}
                    >
                        <Text
                            style={{
                                color: isDarkMode ? '#FFFFFF' : '#070707',
                            }}
                        >
                            {endDate ? endDate.toLocaleDateString() : 'Fim'}
                        </Text>
                    </TouchableOpacity>
                </View>
                <DatePicker
                    showPicker={showStartDatePicker}
                    date={startDate}
                    onChange={(event, selectedDate) => {
                        setShowStartDatePicker(false);
                        if (selectedDate) {
                            setStartDate(selectedDate);
                        }
                    }}
                />
                <DatePicker
                    showPicker={showEndDatePicker}
                    date={endDate}
                    onChange={(event, selectedDate) => {
                        setShowEndDatePicker(false);
                        if (selectedDate) {
                            setEndDate(selectedDate);
                        }
                    }}
                />
                <TouchableOpacity
                    style={[
                        styles.searchButton,
                        { backgroundColor: isDarkMode ? '#1F1B1B' : '#1C8139' },
                    ]}
                    onPress={fetchRecords}
                >
                    <Text
                        style={{
                            color: isDarkMode ? '#FFFFFF' : '#FFFFFF',
                            fontSize: 16,
                        }}
                    >
                        Buscar
                    </Text>
                </TouchableOpacity>
                <FlatList
                    data={dayItems}
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
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 16,
    } as ViewStyle,
    dateInput: {
        flex: 1,
        paddingVertical: 12,
        paddingHorizontal: 16,
        borderRadius: 8,
        alignItems: 'center',
        marginHorizontal: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 5 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 5,
    } as ViewStyle,
    searchButton: {
        elevation: 5,
        backgroundColor: '#1C8139',
        paddingVertical: 12,
        paddingHorizontal: 16,
        borderRadius: 8,
        alignItems: 'center',
        marginBottom: 16,
        width: '100%',
    } as ViewStyle,
    dayContainer: {
        marginBottom: 8,
        borderRadius: 12,
        overflow: 'hidden',
        width: '100%',
        borderWidth: 1,
    } as ViewStyle,
    dayHeader: {
        padding: 16,
        width: '100%',
        justifyContent: 'center',
        borderBottomColor: '#000000',
    } as ViewStyle,
    recordList: {
        paddingVertical: 8,
        paddingHorizontal: 16,
        borderTopWidth: 1,
        borderTopColor: '#DDDDDD',
    },
    selectedDay: {
        color: '#ffffff',
        borderWidth: 2,
    },
});

export default HistoryScreen;
