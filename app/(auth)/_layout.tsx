import { DarkTheme, DefaultTheme, ThemeProvider, Theme } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';

import { useColorScheme } from '@/hooks/use-color-scheme';

export const unstable_settings = {
    initialRouteName: 'OnboardingScreen',
};



export default function AuthLayout() {
    const colorScheme = useColorScheme();

    return (
        <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
            <Stack screenOptions={{ headerShown: false }}>
                <Stack.Screen name="OnboardingScreen" />
                <Stack.Screen name="LoginScreen" />
                <Stack.Screen name="RegisterScreen" />
                <Stack.Screen name="ForgotPasswordScreen" />
                <Stack.Screen name="VerifyOTPScreen" />
            </Stack>
            <StatusBar style="auto" />
        </ThemeProvider>
    );
}