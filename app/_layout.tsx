import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import * as Updates from 'expo-updates';
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
        const checkForUpdates = async () => {
            try {
                const update = await Updates.checkForUpdateAsync();
                if (update.isAvailable) {
                    await Updates.fetchUpdateAsync();
                    await Updates.reloadAsync();
                }
            } catch (e) {
                console.error(e);
            }
        };

        if (loaded) {
            SplashScreen.hideAsync();
            checkForUpdates();
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
