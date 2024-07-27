import React, { useState, useEffect, useCallback } from 'react';
import {
    SafeAreaView,
    StatusBar,
    StyleSheet,
    TouchableOpacity,
    View,
} from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import CalendarDayOfWeek from '@/components/DayOfWeek';
import Header from '@/components/Header';
import { useDarkMode } from '@/context/DarkModeContext';
import { useConfigTable } from '@/database/useConfigTable';
import ShowConfigPadroes from '@/components/ShowConfigPadroes';
import DateTimePicker from '@/components/DateTimePicker';
import { DateTimePickerEvent } from '@react-native-community/datetimepicker';
import TimePickerButton from '@/components/TimePickerButton';
import { useFocusEffect } from '@react-navigation/native';

const RegistroScreen = () => {
    const [showPicker, setShowPicker] = useState<
        'defaultTime' | 'intervalTime' | null
    >(null);
    const [defaultTime, setDefaultTime] = useState<Date | null>(null);
    const [intervalTime, setIntervalTime] = useState<Date | null>(null);
    const [selectedDays, setSelectedDays] = useState<string[]>([]);
    const [isConfirmButtonDisabled, setIsConfirmButtonDisabled] =
        useState(true);
    const [confirmedDefaultTime, setConfirmedDefaultTime] =
        useState<Date | null>(null);
    const [confirmedIntervalTime, setConfirmedIntervalTime] =
        useState<Date | null>(null);
    const [confirmedDays, setConfirmedDays] = useState<string[]>([]);
    const [existingRecordId, setExistingRecordId] = useState<number | null>(
        null
    );

    const { isDarkMode } = useDarkMode();
    const { create, show, update } = useConfigTable();

    useFocusEffect(
        useCallback(() => {
            fetchExistingRecord();
        }, [])
    );

    useEffect(() => {
        setIsConfirmButtonDisabled(!hasChanges());
    }, [
        defaultTime,
        intervalTime,
        selectedDays,
        confirmedDefaultTime,
        confirmedIntervalTime,
        confirmedDays,
    ]);

    const fetchExistingRecord = async () => {
        try {
            const id = 1;
            const record = await show(id);
            if (record) {
                setExistingRecordData(record);
            }
        } catch (error) {
            console.error('Erro ao buscar registro existente:', error);
        }
    };

    const setExistingRecordData = (record: any) => {
        setExistingRecordId(record.id);
        setDefaultTime(record.horapadrao);
        setIntervalTime(record.intervalopadrao);
        setSelectedDays(record.diasdasemana || []);
        setConfirmedDefaultTime(record.horapadrao);
        setConfirmedIntervalTime(record.intervalopadrao);
        setConfirmedDays(record.diasdasemana || []);
    };

    const onChange = (event: DateTimePickerEvent, selectedDate?: Date) => {
        if (event.type === 'dismissed') {
            setShowPicker(null);
            return;
        }

        const currentDate = selectedDate || new Date();
        if (showPicker === 'defaultTime') {
            setDefaultTime(currentDate);
        } else if (showPicker === 'intervalTime') {
            setIntervalTime(currentDate);
        }

        setShowPicker(null);
    };

    const hasChanges = () => {
        const isDefaultTimeChanged = defaultTime !== confirmedDefaultTime;
        const isIntervalTimeChanged = intervalTime !== confirmedIntervalTime;

        const sortedSelectedDays = selectedDays.sort();
        const sortedConfirmedDays = confirmedDays.sort();

        const areDaysChanged =
            sortedSelectedDays.toString() !== sortedConfirmedDays.toString();

        return isDefaultTimeChanged || isIntervalTimeChanged || areDaysChanged;
    };

    const handleDaySelection = (day: string) => {
        setSelectedDays((prevSelectedDays) =>
            prevSelectedDays.includes(day)
                ? prevSelectedDays.filter((d) => d !== day)
                : [...prevSelectedDays, day]
        );
    };

    const handleConfirm = async () => {
        try {
            if (existingRecordId !== null) {
                await updateRecord(existingRecordId);
            } else {
                await createRecord();
            }
            setConfirmedState();
            setIsConfirmButtonDisabled(true);
        } catch (error) {
            console.error('Erro ao criar ou atualizar registro:', error);
        }
    };

    const updateRecord = async (id: number) => {
        await update({
            id: id,
            horapadrao: defaultTime || new Date(),
            intervalopadrao: intervalTime || new Date(),
            diasdasemana: selectedDays,
        });
        console.log('Registro atualizado com sucesso!');
    };

    const createRecord = async () => {
        const { insertedRowId } = await create({
            horapadrao: defaultTime || new Date(),
            intervalopadrao: intervalTime || new Date(),
            diasdasemana: selectedDays,
        });
        setExistingRecordId(insertedRowId);
        console.log('Registro criado com sucesso!');
    };

    const setConfirmedState = () => {
        setConfirmedDefaultTime(defaultTime || new Date());
        setConfirmedIntervalTime(intervalTime || new Date());
        setConfirmedDays(selectedDays);
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
            <Header appName="Padrões de Ponto" />
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
                        Hora Padrão
                    </ThemedText>
                    <TimePickerButton
                        label="Hora Padrão"
                        time={defaultTime}
                        isDarkMode={isDarkMode}
                        onPress={() => setShowPicker('defaultTime')}
                    />
                </ThemedView>

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
                        isDarkMode
                            ? styles.darkStepContainer
                            : styles.lightStepContainer,
                    ]}
                >
                    <ThemedText
                        type="subtitle"
                        style={isDarkMode ? styles.darkText : styles.lightText}
                    >
                        Intervalo Padrão
                    </ThemedText>
                    <TimePickerButton
                        label="Intervalo Padrão"
                        time={intervalTime}
                        isDarkMode={isDarkMode}
                        onPress={() => setShowPicker('intervalTime')}
                    />
                </ThemedView>

                <TouchableOpacity
                    style={[
                        styles.confirmButton,
                        isConfirmButtonDisabled && styles.disabledButton,
                    ]}
                    onPress={handleConfirm}
                    disabled={isConfirmButtonDisabled}
                >
                    <ThemedText
                        type="subtitle"
                        style={styles.confirmButtonText}
                    >
                        Confirmar
                    </ThemedText>
                </TouchableOpacity>
                <ShowConfigPadroes />
            </View>
            <DateTimePicker
                showPicker={showPicker}
                date={defaultTime || new Date()}
                onChange={onChange}
            />
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1 },
    content: { flex: 1, padding: 16 },
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
    confirmButton: {
        backgroundColor: '#1C8139',
        paddingVertical: 16,
        paddingHorizontal: 16,
        borderRadius: 8,
        alignItems: 'center',
        width: '100%',
    },
    confirmButtonText: {
        color: '#FFFFFF',
        fontSize: 16,
    },
    disabledButton: {
        backgroundColor: '#95D8A6',
    },
    lightText: { color: '#070707' },
    darkText: { color: '#FFFFFF' },
    lightStepContainer: { backgroundColor: '#FFFFFF' },
    darkStepContainer: { backgroundColor: '#161B22' },
});

export default RegistroScreen;
