import React, { useState, useEffect } from 'react';
import {
    StyleSheet,
    TouchableOpacity,
    View,
    SafeAreaView,
    StatusBar,
    FlatList,
    Text,
} from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import RNDateTimePicker, {
    DateTimePickerEvent,
} from '@react-native-community/datetimepicker';
import Header from '@/components/Header';
import { useDarkMode } from '@/context/DarkModeContext';
import { ThemedView } from '@/components/ThemedView';
import { useRegistroTable } from '@/database/useRegistroTable';

export default function TabTwoScreen() {
    const [showPicker, setShowPicker] = useState<
        'defaultTime' | 'intervalTime' | null
    >(null);
    const [date, setDate] = useState(new Date());
    const [records, setRecords] = useState<{ id: number; data: Date }[]>([]);
    const { create, show } = useRegistroTable();

    const onChange = (event: DateTimePickerEvent, selectedDate?: Date) => {
        if (event.type === 'dismissed') {
            setShowPicker(null);
            return;
        }
        const currentDate = selectedDate || new Date();
        setDate(currentDate);
        saveDate(currentDate);
        setShowPicker(null);
    };

    const saveDate = async (selectedDate: Date) => {
        try {
            await create({ data: selectedDate });
            console.log('Registro criado com sucesso!');
            loadRecords();
        } catch (error) {
            console.error('Erro ao salvar data:', error);
        }
    };

    const loadRecords = async () => {
        try {
            const records = await show();
            if (Array.isArray(records)) {
                setRecords(records);
                console.log('Registros carregados:', records);
            }
        } catch (error) {
            console.error('Erro ao carregar registros:', error);
        }
    };

    useEffect(() => {
        loadRecords();
    }, []);

    const handlePress = () => {
        const currentDate = new Date();
        setDate(currentDate);
        setShowPicker('defaultTime');
    };

    const { isDarkMode } = useDarkMode();

    const renderItem = ({ item }: { item: { id: number; data: Date } }) => (
        <View
            style={[
                styles.recordItem,
                { backgroundColor: isDarkMode ? '#161B22' : '#FFFFFF' },
            ]}
        >
            <Text
                style={[
                    styles.recordText,
                    { color: isDarkMode ? '#FFFFFF' : '#070707' },
                ]}
            >
                {item.data.toLocaleString()}
            </Text>
        </View>
    );

    return (
        <SafeAreaView
            style={[
                styles.container,
                isDarkMode ? styles.darkBackground : styles.lightBackground,
            ]}
        >
            <StatusBar
                barStyle={isDarkMode ? 'light-content' : 'dark-content'}
            />
            <Header appName="Registro de Ponto" />
            <View style={styles.content}>
                <ThemedView
                    style={[
                        styles.stepContainer,
                        isDarkMode
                            ? styles.darkStepContainer
                            : styles.lightStepContainer,
                    ]}
                >
                    <ThemedText
                        type="subtitle"
                        style={isDarkMode ? styles.darkText : styles.lightText}
                    >
                        Banco de horas:
                    </ThemedText>
                </ThemedView>

                <FlatList
                    data={records}
                    renderItem={renderItem}
                    keyExtractor={(item) => item.id.toString()}
                    style={styles.recordList}
                />
            </View>

            <TouchableOpacity
                style={styles.floatingButton}
                onPress={handlePress}
            >
                <ThemedText style={styles.buttonText}>+</ThemedText>
            </TouchableOpacity>
            {showPicker && (
                <RNDateTimePicker
                    display="default"
                    mode="time"
                    value={date}
                    onChange={onChange}
                    locale="pt-BR"
                    is24Hour={true}
                />
            )}
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    floatingButton: {
        width: 60,
        height: 60,
        borderRadius: 30,
        backgroundColor: '#161B22',
        position: 'absolute',
        bottom: 20,
        right: 20,
        alignItems: 'center',
        justifyContent: 'center',
        elevation: 3,
        shadowColor: '#000',
        shadowOpacity: 0.3,
        shadowRadius: 4,
        shadowOffset: { width: 0, height: 2 },
    },
    buttonText: {
        fontSize: 24,
        color: 'white',
    },
    container: { flex: 1 },
    content: {
        flex: 1,
        padding: 16,
        justifyContent: 'center',
    },
    darkBackground: { backgroundColor: '#010409' },
    lightBackground: { backgroundColor: '#F6F8FA' },
    stepContainer: {
        padding: 16,
        marginBottom: 16,
        borderRadius: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 5,
    },
    lightText: { color: '#070707' },
    darkText: { color: '#FFFFFF' },
    lightStepContainer: { backgroundColor: '#FFFFFF' },
    darkStepContainer: { backgroundColor: '#161B22' },
    recordList: {
        marginTop: 16,
    },
    recordItem: {
        padding: 16,
        marginVertical: 4,
        borderRadius: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
    },
    recordText: {
        fontSize: 16,
    },
});
