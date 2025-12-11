import { Tabs } from 'expo-router';
import React from 'react';
import { useColorScheme } from 'react-native'; // Standard React Native hook is often safer here

import { HapticTab } from '@/components/haptic-tab';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { lightTheme, darkTheme } from '@/constants/theme'; // ✅ Using your theme imports

export default function TabLayout() {
    const scheme = useColorScheme();

    // ✅ 1. Logic to pick the right colors based on your theme system
    const isDark = scheme === 'dark';
    const currentColors = isDark ? darkTheme.COLORS : lightTheme.COLORS;

    return (
        <Tabs
            screenOptions={{
                // ✅ 2. Use your theme's primary color instead of 'Colors[...].tint'
                tabBarActiveTintColor: currentColors.primary,
                headerShown: false,
                tabBarButton: HapticTab,
                tabBarStyle: {
                    backgroundColor: currentColors.surface, // Optional: Match bar to theme
                    borderTopColor: currentColors.border,   // Optional: Match border
                }
            }}>
            <Tabs.Screen
                name="index"
                options={{
                    title: 'Home',
                    tabBarIcon: ({ color }) => <IconSymbol size={28} name="house.fill" color={color} />,
                }}
            />
            <Tabs.Screen
                name="explore"
                options={{
                    title: 'Explore',
                    tabBarIcon: ({ color }) => <IconSymbol size={28} name="paperplane.fill" color={color} />,
                }}
            />
        </Tabs>
    );
}