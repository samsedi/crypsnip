import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { useLanguage } from '@/hooks/useLanguage';
import { SupportedLocale } from '@/i18n/translations';
import { ColorTheme } from '@/constants/theme'; // Assuming ColorTheme is globally available

interface LanguageSwitchButtonProps {
    colors: ColorTheme; // Pass the colors object for dynamic styling
}

const LanguageSwitchButton: React.FC<LanguageSwitchButtonProps> = ({ colors }) => {
    const { locale, setLocale } = useLanguage();

    // Toggle logic: If current is 'en', switch to 'es', otherwise switch to 'en'.
    // This provides a simple, common use case for a single button toggle.
    const toggleLanguage = () => {
        const newLang = locale === 'en' ? 'es' : 'en';
        setLocale(newLang as SupportedLocale);
    };

    const dynamicStyles = createStyles(colors);

    return (
        <TouchableOpacity
            onPress={toggleLanguage}
            style={dynamicStyles.langButton}
        >
            <Text style={[dynamicStyles.langButtonText, { color: colors.primary }]}>
                🌍  {locale.toUpperCase()}
            </Text>
        </TouchableOpacity>
    );
};

const createStyles = (colors: ColorTheme) =>
    StyleSheet.create({
        langButton: {
            paddingHorizontal: 10,
            paddingVertical: 4,
            borderRadius: 23,
            borderWidth: 1,
            borderColor: colors.border,
            marginRight: -8, // Adjusts for the padding/margin of the outer container
        },
        langButtonText: {
            fontSize: 14,
            fontWeight: '600',
        },
    });

export default LanguageSwitchButton;