import React from 'react';
import { SafeAreaView, StyleSheet, View, Text } from 'react-native';
import { useDarkMode } from '@/context/DarkModeContext';
import * as Application from 'expo-application';

const AboutScreen = () => {
    const { isDarkMode } = useDarkMode();
    const appVersion = Application.nativeApplicationVersion;
    const appBuild = Application.nativeBuildVersion;

    return (
        <SafeAreaView
            style={[
                styles.container,
                isDarkMode ? styles.darkBackground : styles.lightBackground,
            ]}
        >
            <View style={styles.content}>
                <Text
                    style={[
                        styles.title,
                        isDarkMode ? styles.darkText : styles.lightText,
                    ]}
                >
                    About the App
                </Text>
                <Text
                    style={[
                        styles.info,
                        isDarkMode ? styles.darkText : styles.lightText,
                    ]}
                >
                    Version: {appVersion}
                </Text>
                <Text
                    style={[
                        styles.info,
                        isDarkMode ? styles.darkText : styles.lightText,
                    ]}
                >
                    Build: {appBuild}
                </Text>
                <Text
                    style={[
                        styles.info,
                        isDarkMode ? styles.darkText : styles.lightText,
                    ]}
                >
                    Developed by [Wesllen Lima - Francisco Marcello]
                </Text>
                <Text
                    style={[
                        styles.info,
                        isDarkMode ? styles.darkText : styles.lightText,
                    ]}
                >
                    Versão de Desenvolvimento: 1.0.0
                </Text>
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    darkBackground: {
        backgroundColor: '#121212',
    },
    lightBackground: {
        backgroundColor: '#F5F5F5',
    },
    content: {
        alignItems: 'center',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 16,
    },
    info: {
        fontSize: 18,
        marginBottom: 8,
    },
    darkText: {
        color: '#FFFFFF',
    },
    lightText: {
        color: '#000000',
    },
});

export default AboutScreen;
