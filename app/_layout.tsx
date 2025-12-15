import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';
import { LanguageProvider } from '@/contexts/LanguageContext';
import { useColorScheme } from '@/hooks/use-color-scheme';

export const unstable_settings = {
    // ✅ FIX: Use 'initialRouteName', not 'anchor'
    initialRouteName: '(auth)',
};

export default function RootLayout() {
    const colorScheme = useColorScheme();

    return (
        <LanguageProvider>
            <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
                <Stack screenOptions={{ headerShown: false }}>
                    {/* ✅ Define the groups explicitly */}
                    <Stack.Screen name="(auth)" options={{ headerShown: false }} />
                    <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
                </Stack>
                <StatusBar style="auto" />
            </ThemeProvider>
        </LanguageProvider>
    );
}