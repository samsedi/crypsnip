import React, { useState, useCallback } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    StatusBar,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    Image,
    useColorScheme,
    ActivityIndicator,
} from 'react-native';
import {SafeAreaView} from "react-native-safe-area-context";
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Eye, EyeOff, ArrowLeft } from 'lucide-react-native';
import { lightTheme, darkTheme, ColorTheme } from '@/constants/theme';
import * as ScreenCapture from 'expo-screen-capture';
import { useLanguage } from '@/hooks/useLanguage';
import LanguageSwitchButton from '@/components/LanguageSwitchButton';

type AuthStackParamList = {
    LoginScreen: undefined;
    RegisterScreen: undefined;
    ForgotPasswordScreen: undefined;
    MainTabs: undefined;
};

type LoginScreenNavigationProp = NativeStackNavigationProp<
    AuthStackParamList,
    'LoginScreen'
>;

export default function LoginScreen() {
    const { t, loading: languageLoading } = useLanguage();

    // useFocusEffect(
    //     useCallback(() => {
    //         ScreenCapture.preventScreenCaptureAsync();
    //         return () => {
    //             ScreenCapture.allowScreenCaptureAsync();
    //         };
    //     }, [])
    // );

    const navigation = useNavigation<LoginScreenNavigationProp>();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
    const [touched, setTouched] = useState<{ email?: boolean; password?: boolean }>({});
    const [isValid, setIsValid] = useState(false);

    const scheme = useColorScheme();
    const isDarkMode = scheme === 'dark';
    const currentTheme = isDarkMode ? darkTheme : lightTheme;
    const { COLORS } = currentTheme;
    // We use the adjusted styles creator
    const dynamicStyles = createStyles(COLORS);

    const validateEmail = (value: string): boolean => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(value);
    };

    const validatePassword = (value: string): boolean => {
        return value.length >= 6;
    };

    const validateField = (field: 'email' | 'password') => {
        const newErrors: { email?: string; password?: string } = { ...errors };

        if (field === 'email') {
            if (!email.trim()) {
                newErrors.email = t('emailRequired');
            } else if (!validateEmail(email.trim())) {
                newErrors.email = t('emailInvalid');
            } else {
                delete newErrors.email;
            }
        }

        if (field === 'password') {
            if (!password.trim()) {
                newErrors.password = t('passwordRequired');
            } else if (!validatePassword(password.trim())) {
                newErrors.password = t('passwordTooShort');
            } else {
                delete newErrors.password;
            }
        }

        setErrors(newErrors);
        const formValid = Object.keys(newErrors).length === 0;
        setIsValid(formValid);
    };

    const validateFormOnSubmit = () => {
        const fields: Array<'email' | 'password'> = ['email', 'password'];
        fields.forEach(f => validateField(f));
        return Object.keys(errors).length === 0;
    };

    const handleLogin = () => {
        const ok = validateFormOnSubmit();
        if (!ok) return;

        console.log('Logging in with:', email);
        // navigation.replace('MainTabs');
    };

    const handleGoogleLogin = () => {
        console.log('Google Login pressed');
    };

    if (languageLoading) {
        return (
            <SafeAreaView
                style={[dynamicStyles.safeArea, { backgroundColor: COLORS.background }]}
            >
                <View style={dynamicStyles.loadingContainer}>
                    <ActivityIndicator size="large" color={COLORS.primary} />
                </View>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView
            style={[dynamicStyles.safeArea, { backgroundColor: COLORS.background }]}
            edges={['top', 'bottom', 'left', 'right']}
        >
            <StatusBar
                barStyle={isDarkMode ? 'light-content' : 'dark-content'}
                backgroundColor={COLORS.background}
            />

            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={dynamicStyles.container}
            >
                <ScrollView
                    contentContainerStyle={dynamicStyles.scrollContent}
                    showsVerticalScrollIndicator={false}
                >
                    {/* Header Area: Now contains all three elements in a row */}
                    <View style={dynamicStyles.header}>
                        {/* 1. Back Button */}
                        <TouchableOpacity
                            onPress={() => navigation.goBack()}
                            style={dynamicStyles.backButton}
                        >
                            <ArrowLeft color={COLORS.textPrimary} size={24} />
                        </TouchableOpacity>

                        {/* 2. Login Title - Centered between the buttons */}
                        <View style={dynamicStyles.inlineTitleWrapper}>
                            <Text
                                style={[dynamicStyles.inlineTitleText, { color: COLORS.textPrimary }]}
                            >
                                {t('loginTitle')}
                            </Text>
                        </View>

                        {/* 3. LanguageSwitchButton Component */}
                        <LanguageSwitchButton colors={COLORS} />
                    </View>

                    {/* Logo & Title Area - Increased marginTop in styles to push this content down */}
                    <View style={dynamicStyles.titleContainer}>
                        <View style={dynamicStyles.brandRow}>
                            <Image
                                source={require('../../assets/images/cypsniplogo-removebg-preview.png')}
                                style={dynamicStyles.logoImage}
                            />
                            <Text
                                style={[dynamicStyles.logoText, { color: COLORS.textPrimary }]}
                            >
                                Crypsnip
                            </Text>
                        </View>

                        <Text
                            style={[dynamicStyles.subtitle, { color: COLORS.textSecondary }]}
                        >
                            {t('welcomeBack')}
                        </Text>
                    </View>

                    {/* Form Area */}
                    <View style={dynamicStyles.formContainer}>
                        {/* Email Input */}
                        <View style={dynamicStyles.inputGroup}>
                            <Text
                                style={[dynamicStyles.label, { color: COLORS.textPrimary }]}
                            >
                                {t('emailLabel')}
                            </Text>
                            <View
                                style={[
                                    dynamicStyles.inputContainer,
                                    {
                                        backgroundColor: COLORS.surface,
                                        borderColor:
                                            touched.email && errors.email
                                                ? COLORS.error
                                                : COLORS.border,
                                    },
                                ]}
                            >
                                <TextInput
                                    style={[dynamicStyles.input, { color: COLORS.textPrimary }]}
                                    placeholder={t('emailPlaceholder')}
                                    placeholderTextColor={COLORS.textTertiary}
                                    value={email}
                                    onChangeText={setEmail}
                                    onBlur={() => {
                                        setTouched(prev => ({ ...prev, email: true }));
                                        validateField('email');
                                    }}
                                    autoCapitalize="none"
                                    keyboardType="email-address"
                                />
                            </View>
                            {touched.email && errors.email && (
                                <Text
                                    style={[dynamicStyles.errorText, { color: COLORS.error }]}
                                >
                                    {errors.email}
                                </Text>
                            )}
                        </View>

                        {/* Password Input */}
                        <View style={dynamicStyles.inputGroup}>
                            <Text
                                style={[dynamicStyles.label, { color: COLORS.textPrimary }]}
                            >
                                {t('passwordLabel')}
                            </Text>
                            <View
                                style={[
                                    dynamicStyles.inputContainer,
                                    {
                                        backgroundColor: COLORS.surface,
                                        borderColor:
                                            touched.password && errors.password
                                                ? COLORS.error
                                                : COLORS.border,
                                    },
                                ]}
                            >
                                <TextInput
                                    style={[dynamicStyles.input, { color: COLORS.textPrimary }]}
                                    placeholder={t('passwordPlaceholder')}
                                    placeholderTextColor={COLORS.textTertiary}
                                    value={password}
                                    onChangeText={setPassword}
                                    onBlur={() => {
                                        setTouched(prev => ({ ...prev, password: true }));
                                        validateField('password');
                                    }}
                                    secureTextEntry={!showPassword}
                                />
                                <TouchableOpacity
                                    onPress={() => setShowPassword(!showPassword)}
                                    style={dynamicStyles.eyeIcon}
                                >
                                    {showPassword ? (
                                        <EyeOff color={COLORS.textSecondary} size={20} />
                                    ) : (
                                        <Eye color={COLORS.textSecondary} size={20} />
                                    )}
                                </TouchableOpacity>
                            </View>
                            {touched.password && errors.password && (
                                <Text
                                    style={[dynamicStyles.errorText, { color: COLORS.error }]}
                                >
                                    {errors.password}
                                </Text>
                            )}
                        </View>

                        {/* Forgot Password Link */}
                        <TouchableOpacity
                            style={dynamicStyles.forgotPassword}
                            onPress={() => navigation.navigate('ForgotPasswordScreen')}
                        >
                            <Text
                                style={[
                                    dynamicStyles.forgotPasswordText,
                                    { color: COLORS.primary },
                                ]}
                            >
                                {t('forgotPassword')}
                            </Text>
                        </TouchableOpacity>

                        {/* Primary Login Button */}
                        <TouchableOpacity
                            style={[
                                dynamicStyles.loginButton,
                                {
                                    backgroundColor: isValid ? COLORS.primary : COLORS.surface,
                                    borderWidth: isValid ? 0 : 1,
                                    borderColor: COLORS.border,
                                },
                            ]}
                            onPress={handleLogin}
                            disabled={!isValid}
                        >
                            <Text
                                style={[
                                    dynamicStyles.loginButtonText,
                                    {
                                        color: isValid ? '#FFFFFF' : COLORS.textSecondary,
                                    },
                                ]}
                            >
                                {isValid ? t('loginButton') : t('enterDetails')}
                            </Text>
                        </TouchableOpacity>

                        {/* OR Divider */}
                        <View style={dynamicStyles.dividerContainer}>
                            <View
                                style={[
                                    dynamicStyles.divider,
                                    { backgroundColor: COLORS.border },
                                ]}
                            />
                            <Text
                                style={[
                                    dynamicStyles.dividerText,
                                    { color: COLORS.textSecondary },
                                ]}
                            >
                                {t('orDivider')}
                            </Text>
                            <View
                                style={[
                                    dynamicStyles.divider,
                                    { backgroundColor: COLORS.border },
                                ]}
                            />
                        </View>

                        {/* Google Sign In Button */}
                        <TouchableOpacity
                            style={[
                                dynamicStyles.googleButton,
                                {
                                    backgroundColor: COLORS.surface,
                                    borderWidth: 1,
                                    borderColor: COLORS.border,
                                },
                            ]}
                            onPress={handleGoogleLogin}
                        >
                            <Image
                                source={require('../../assets/images/googlelo-removebg-preview.png')}
                                style={dynamicStyles.googleIcon}
                                resizeMode="contain"
                            />
                            <Text
                                style={[
                                    dynamicStyles.googleButtonText,
                                    { color: COLORS.textPrimary },
                                ]}
                            >
                                {t('googleSignIn')}
                            </Text>
                        </TouchableOpacity>

                        {/* Footer / Sign Up Link */}
                        <View style={dynamicStyles.footer}>
                            <Text
                                style={[
                                    dynamicStyles.footerText,
                                    { color: COLORS.textSecondary },
                                ]}
                            >
                                {t('noAccount')}
                            </Text>
                            <TouchableOpacity
                                onPress={() => navigation.navigate('RegisterScreen')}
                            >
                                <Text
                                    style={[
                                        dynamicStyles.footerLink,
                                        { color: COLORS.primary },
                                    ]}
                                >
                                    {t('signUpLink')}
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}

const createStyles = (colors: ColorTheme) =>
    StyleSheet.create({
        safeArea: {
            flex: 1,
        },
        container: {
            flex: 1,
        },
        loadingContainer: {
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
        },
        inlineTitleWrapper: {
            flex: 1,
            alignItems: 'center',
        },
        inlineTitleText: {
            fontSize: 18,
            fontWeight: '700',
            letterSpacing: 0.5,
        },
        titleText: {
            fontSize: 32,
            fontWeight: '800',
            letterSpacing: 0.5,
        },
        scrollContent: {
            flexGrow: 1,
            paddingHorizontal: 24,
            paddingBottom: 40,
            justifyContent: 'flex-start',
        },
        header: {
            marginTop: 20,
            marginBottom: 20,
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            paddingHorizontal: 0,
        },
        backButton: {
            padding: 8,
            marginLeft: -8,
            width: 40,
        },
        titleContainer: {
            // 🚀 ADJUSTMENT: Increased marginTop from 10 to 50 to push the logo/content down
            marginTop: 50,
            marginBottom: 40,
            alignItems: 'center',
        },
        brandRow: {
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: 8,
        },
        logoImage: {
            height: 50,
            width: 50,
            resizeMode: 'contain',
            marginRight: 9,
        },
        logoText: {
            fontSize: 32,
            fontWeight: '800',
            letterSpacing: 0.5,
        },
        subtitle: {
            fontSize: 16,
            fontWeight: '400',
        },
        formContainer: {
            flex: 1,
        },
        inputGroup: {
            marginBottom: 20,
        },
        label: {
            fontSize: 14,
            fontWeight: '600',
            marginBottom: 8,
            marginLeft: 4,
        },
        inputContainer: {
            flexDirection: 'row',
            alignItems: 'center',
            borderRadius: 12,
            height: 56,
            paddingHorizontal: 16,
            borderWidth: 1,
        },
        input: {
            flex: 1,
            fontSize: 16,
            height: '100%',
        },
        eyeIcon: {
            padding: 8,
        },
        forgotPassword: {
            alignSelf: 'flex-end',
            marginBottom: 32,
        },
        forgotPasswordText: {
            fontSize: 14,
            fontWeight: '500',
        },
        loginButton: {
            height: 56,
            borderRadius: 28,
            justifyContent: 'center',
            alignItems: 'center',
            marginBottom: 24,
            shadowColor: colors.primary,
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.3,
            shadowRadius: 8,
            elevation: 6,
        },
        loginButtonText: {
            fontSize: 16,
            fontWeight: '700',
        },
        dividerContainer: {
            flexDirection: 'row',
            alignItems: 'center',
            marginBottom: 24,
            paddingHorizontal: 10,
        },
        divider: {
            flex: 1,
            height: 1,
        },
        dividerText: {
            paddingHorizontal: 16,
            fontSize: 14,
        },
        googleButton: {
            height: 56,
            borderRadius: 28,
            justifyContent: 'center',
            alignItems: 'center',
            flexDirection: 'row',
            marginBottom: 20,
        },
        googleIcon: {
            width: 24,
            height: 24,
            marginRight: 12,
        },
        googleButtonText: {
            fontSize: 16,
            fontWeight: '600',
        },
        footer: {
            flexDirection: 'row',
            justifyContent: 'center',
            marginTop: 20,
        },
        footerText: {
            fontSize: 14,
        },
        footerLink: {
            fontSize: 14,
            fontWeight: '700',
            marginLeft: 4,
        },
        errorText: {
            fontSize: 13,
            marginTop: 4,
            marginLeft: 4,
        },
    });