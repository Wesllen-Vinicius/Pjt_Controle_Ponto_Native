import React, { useState, useEffect } from 'react';
import {
    StyleSheet,
    TouchableOpacity,
    View,
    SafeAreaView,
    StatusBar,
    FlatList,
} from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import Header from '@/components/Header';
import { useDarkMode } from '@/context/DarkModeContext';
import { ThemedView } from '@/components/ThemedView';
import { useRegistroTable, Registro } from '@/database/useRegistroTable';
import { useConfigTable, Config } from '@/database/useConfigTable';
import DateTimePicker from '@/components/DateTimePicker';
import RecordItem from '@/components/RecordItem';
import {
    calcularHorasMensaisEsperadas,
    calcularSaldoHoras,
} from '@/utils/calculaHoraTrabalhada';

const TabTwoScreen: React.FC = () => {
    const [showPicker, setShowPicker] = useState<
        'defaultTime' | 'intervalTime' | null
    >(null);
    const [date, setDate] = useState(new Date());
    const [records, setRecords] = useState<Registro[]>([]);
    const [config, setConfig] = useState<Config | null>(null);
    const [saldoHoras, setSaldoHoras] = useState<number>(0);
    const { create, show } = useRegistroTable();
    const { show: showConfig } = useConfigTable();
    const { isDarkMode } = useDarkMode();

    useEffect(() => {
        loadRecords();
        fetchConfig();
    }, []);

    useEffect(() => {
        if (config && records.length) {
            const { saldoHoras, saldoDiario } = calcularSaldoHoras(
                config,
                records,
                date
            );
            setSaldoHoras(saldoHoras);
            console.log('Saldo Diário:', saldoDiario);
        }
    }, [config, records]);

    const fetchConfig = async () => {
        try {
            const configData = await showConfig(1);
            setConfig(configData);
        } catch (error) {
            console.error('Erro ao buscar configuração:', error);
        }
    };

    const loadRecords = async () => {
        try {
            const recordsData = await show();
            if (Array.isArray(recordsData)) {
                setRecords(recordsData);
            }
        } catch (error) {
            console.error('Erro ao carregar registros:', error);
        }
    };

    const onChange = (event: any, selectedDate?: Date) => {
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
            loadRecords();
        } catch (error) {
            console.error('Erro ao salvar data:', error);
        }
    };

    const handlePress = () => {
        const currentDate = new Date();
        setDate(currentDate);
        setShowPicker('defaultTime');
    };

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
                        Banco de horas: {saldoHoras.toFixed(2)} horas
                    </ThemedText>
                    <ThemedText
                        type="subtitle"
                        style={isDarkMode ? styles.darkText : styles.lightText}
                    >
                        Horas esperadas no mês:{' '}
                        {config
                            ? calcularHorasMensaisEsperadas(
                                  config.diasdasemana,
                                  config.horapadrao,
                                  config.intervalopadrao,
                                  date
                              ).toFixed(2)
                            : 'N/A'}{' '}
                        horas
                    </ThemedText>
                </ThemedView>

                <FlatList
                    data={records}
                    renderItem={({ item }) => (
                        <RecordItem item={item} isDarkMode={isDarkMode} />
                    )}
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
            <DateTimePicker
                showPicker={showPicker}
                date={date}
                onChange={onChange}
            />
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    floatingButton: {
        width: 60,
        height: 60,
        borderRadius: 30,
        backgroundColor: '#007bff',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'absolute',
        bottom: 20,
        right: 20,
    },
    buttonText: {
        color: '#fff',
        fontSize: 24,
    },
    container: {
        flex: 1,
    },
    content: {
        flex: 1,
        padding: 16,
    },
    recordList: {
        marginTop: 16,
    },
    stepContainer: {
        padding: 16,
        borderRadius: 8,
    },
    darkStepContainer: {
        backgroundColor: '#333',
    },
    lightStepContainer: {
        backgroundColor: '#fff',
    },
    darkBackground: {
        backgroundColor: '#000',
    },
    lightBackground: {
        backgroundColor: '#fff',
    },
    darkText: {
        color: '#fff',
    },
    lightText: {
        color: '#000',
    },
});

export default TabTwoScreen;
