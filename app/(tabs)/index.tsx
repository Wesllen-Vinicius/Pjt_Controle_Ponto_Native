import React, { useState, useEffect } from 'react';
import {
    StyleSheet,
    TouchableOpacity,
    View,
    SafeAreaView,
    StatusBar,
    FlatList,
    Animated,
    Easing,
    Alert,
} from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import Header from '@/components/Header';
import { useDarkMode } from '@/context/DarkModeContext';
import { ThemedView } from '@/components/ThemedView';
import { useRegistroTable, Registro } from '@/database/useRegistroTable';
import { useConfigTable, Config } from '@/database/useConfigTable';
import DateTimePicker from '@/components/DateTimePicker';
import Icon from 'react-native-vector-icons/FontAwesome';
import { useFocusEffect } from '@react-navigation/native';
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
    const [animations, setAnimations] = useState<{
        [key: number]: Animated.Value;
    }>({});
    const { create, show, clearDatabase } = useRegistroTable();
    const { show: showConfig } = useConfigTable();
    const { isDarkMode } = useDarkMode();

    useFocusEffect(
        React.useCallback(() => {
            fetchConfig();
            loadRecords();
        }, [])
    );

    useEffect(() => {
        if (config && records.length) {
            const { saldoHoras: saldo, saldoDiario } = calcularSaldoHoras(
                config,
                records,
                date
            );
            setSaldoHoras(parseFloat(saldo.toFixed(2)));
            console.log('Saldo Diário:', saldoDiario);
        }
    }, [config, records]);

    useEffect(() => {
        const newAnimations: { [key: number]: Animated.Value } = {};
        records.forEach((record) => {
            newAnimations[record.id] = new Animated.Value(0);
        });
        setAnimations(newAnimations);

        Object.values(newAnimations).forEach((animation) => {
            Animated.timing(animation, {
                toValue: 1,
                duration: 500,
                easing: Easing.inOut(Easing.ease),
                useNativeDriver: true,
            }).start();
        });
    }, [records]);

    const fetchConfig = async () => {
        try {
            const configData = await showConfig(1);
            console.log('Configuração carregada:', configData);
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
            await create({
                data: selectedDate,
                tipo: 'entrada',
            });
            await loadRecords();
        } catch (error) {
            console.error('Erro ao salvar data:', error);
        }
    };

    const handlePress = () => {
        if (!config) {
            Alert.alert(
                'Atenção',
                'Defina os padrões antes de criar um registro.'
            );
            return;
        }
        const currentDate = new Date();
        setDate(currentDate);
        setShowPicker('defaultTime');
    };

    const renderItem = ({ item, index }: { item: Registro; index: number }) => {
        const animation = animations[item.id] || new Animated.Value(0);

        return (
            <View>
                <View style={styles.recordContainer}>
                    <RecordItem item={item} isDarkMode={isDarkMode} />
                    <ThemedText style={styles.tipoText}>
                        {item.tipo === 'entrada' ? 'Entrada' : 'Saída'}
                    </ThemedText>
                </View>
                {index < records.length - 1 && (
                    <View style={styles.arrowContainer}>
                        <Animated.View
                            style={[
                                styles.line,
                                {
                                    opacity: animation,
                                    transform: [
                                        {
                                            translateY: animation.interpolate({
                                                inputRange: [0, 1],
                                                outputRange: [-20, 0],
                                            }),
                                        },
                                    ],
                                },
                            ]}
                        />
                        <Animated.View style={{ opacity: animation }}>
                            <Icon name="arrow-down" size={24} color="#000" />
                        </Animated.View>
                    </View>
                )}
            </View>
        );
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
            <DateTimePicker
                showPicker={showPicker}
                date={date}
                onChange={onChange}
            />
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1 },
    content: { flex: 1, padding: 16 },
    recordList: { marginTop: 16 },
    recordContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 16, // Aumenta o espaço entre os registros
    },
    line: {
        width: 2,
        height: 20,
        backgroundColor: '#000',
        marginHorizontal: 8,
    },
    arrowContainer: { flexDirection: 'column', alignItems: 'center' },
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
    darkStepContainer: { backgroundColor: '#161B22' },
    lightStepContainer: { backgroundColor: '#FFFFFF' },
    darkBackground: { backgroundColor: '#010409' },
    lightBackground: { backgroundColor: '#F6F8FA' },
    darkText: { color: '#FFFFFF' },
    lightText: { color: '#070707' },
    floatingButton: {
        width: 60,
        height: 60,
        borderRadius: 30,
        backgroundColor: '#1C8139',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'absolute',
        bottom: 20,
        right: 20,
    },
    buttonText: { color: '#fff', fontSize: 24 },
    tipoText: {
        fontSize: 16,
        color: '#666',
        marginHorizontal: 8,
    },
});

export default TabTwoScreen;
