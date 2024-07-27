import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import 'react-native-reanimated';
import { SQLiteProvider } from 'expo-sqlite';
import { initializeDatabase } from '@/database/initializeDatabase';
import { DarkModeProvider } from '@/context/DarkModeContext';
import { AnimationProvider } from '@/context/AnimationContext';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
    const [loaded] = useFonts({
        SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
    });

    useEffect(() => {
        if (loaded) {
            SplashScreen.hideAsync();
        }
    }, [loaded]);

    if (!loaded) {
        return null;
    }

    return (
        <DarkModeProvider>
            <AnimationProvider>
                <SQLiteProvider
                    databaseName="teste.db"
                    onInit={initializeDatabase}
                >
                    <Stack>
                        <Stack.Screen
                            name="(tabs)"
                            options={{ headerShown: false }}
                        />
                        <Stack.Screen name="+not-found" />
                    </Stack>
                </SQLiteProvider>
            </AnimationProvider>
        </DarkModeProvider>
    );
}
