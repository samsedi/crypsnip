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
import { SafeAreaView } from "react-native-safe-area-context";
// ✅ 1. CHANGED: Import router from expo-router
import { router, useFocusEffect } from 'expo-router';
import { Eye, EyeOff, ArrowLeft } from 'lucide-react-native';
import { lightTheme, darkTheme, ColorTheme } from '@/constants/theme';
import * as ScreenCapture from 'expo-screen-capture';
import { useLanguage } from '@/hooks/useLanguage';
import LanguageSwitchButton from '@/components/LanguageSwitchButton';

import AsyncStorage from '@react-native-async-storage/async-storage';
import authService from "@/Services/authService";
import CustomAlert from '../../components/CustomAlert';

// (We removed the old Navigation types because router doesn't need them!)

export default function LoginScreen() {
    const { t, loading: languageLoading } = useLanguage();

    useFocusEffect(
        useCallback(() => {
            ScreenCapture.preventScreenCaptureAsync();
            return () => {
                ScreenCapture.allowScreenCaptureAsync();
            };
        }, [])
    );

    // FORM STATE
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);

    // VALIDATION STATE
    const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
    const [touched, setTouched] = useState<{ email?: boolean; password?: boolean }>({});
    const [isValid, setIsValid] = useState(false);

    const [isSubmitting, setIsSubmitting] = useState(false);

    // ALERT STATE
    const [alertVisible, setAlertVisible] = useState(false);
    const [alertConfig, setAlertConfig] = useState({
        title: "",
        message: "",
        type: "success" as "success" | "error",
        onClose: () => {}
    });

    const scheme = useColorScheme();
    const isDarkMode = scheme === 'dark';
    const currentTheme = isDarkMode ? darkTheme : lightTheme;
    const { COLORS } = currentTheme;
    const dynamicStyles = createStyles(COLORS);

    // --- HELPER FUNCTIONS ---
    const showAlert = (title: string, message: string, type: "success" | "error", onClose: () => void = () => {}) => {
        setAlertConfig({ title, message, type, onClose });
        setAlertVisible(true);
    };

    const handleAlertClose = () => {
        setAlertVisible(false);
        if (alertConfig.onClose) {
            alertConfig.onClose();
        }
    };

    // --- VALIDATION LOGIC ---
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

    // ✅ THE LOGIN LOGIC (Using router)
    const handleLogin = async () => {
        const ok = validateFormOnSubmit();
        if (!ok) return;

        setIsSubmitting(true);

        try {
            const response = await authService.login({
                email,
                password
            });

            if (response.token) {
                await AsyncStorage.setItem('userToken', response.token);
            }

            showAlert("Success", "Welcome back!", "success", () => {
                // ✅ 2. CHANGED: Use router.replace to go to the tabs folder
                // This clears the history so the user can't "back" into the login screen
                router.replace('/(tabs)');
            });

        } catch (error: any) {
            showAlert("Login Failed", error.message, "error");
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleGoogleLogin = () => {
        console.log('Google Login pressed');
    };

    if (languageLoading) {
        return (
            <SafeAreaView style={[dynamicStyles.safeArea, { backgroundColor: COLORS.background }]}>
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
                    <View style={dynamicStyles.header}>
                        {/* ✅ 3. CHANGED: router.back() */}
                        <TouchableOpacity onPress={() => router.back()} style={dynamicStyles.backButton}>
                            <ArrowLeft color={COLORS.textPrimary} size={24} />
                        </TouchableOpacity>
                        <View style={dynamicStyles.inlineTitleWrapper}>
                            <Text style={[dynamicStyles.inlineTitleText, { color: COLORS.textPrimary }]}>
                                {t('loginTitle')}
                            </Text>
                        </View>
                        <LanguageSwitchButton colors={COLORS} />
                    </View>

                    <View style={dynamicStyles.titleContainer}>
                        <View style={dynamicStyles.brandRow}>
                            <Image
                                source={require('../../assets/images/cypsniplogo-removebg-preview.png')}
                                style={dynamicStyles.logoImage}
                            />
                            <Text style={[dynamicStyles.logoText, { color: COLORS.textPrimary }]}>
                                Crypsnip
                            </Text>
                        </View>
                        <Text style={[dynamicStyles.subtitle, { color: COLORS.textSecondary }]}>
                            {t('welcomeBack')}
                        </Text>
                    </View>

                    <View style={dynamicStyles.formContainer}>
                        {/* Email Input */}
                        <View style={dynamicStyles.inputGroup}>
                            <Text style={[dynamicStyles.label, { color: COLORS.textPrimary }]}>{t('emailLabel')}</Text>
                            <View style={[dynamicStyles.inputContainer, { backgroundColor: COLORS.surface, borderColor: touched.email && errors.email ? COLORS.error : COLORS.border }]}>
                                <TextInput
                                    style={[dynamicStyles.input, { color: COLORS.textPrimary }]}
                                    placeholder={t('emailPlaceholder')}
                                    placeholderTextColor={COLORS.textTertiary}
                                    value={email}
                                    onChangeText={setEmail}
                                    onBlur={() => { setTouched(prev => ({ ...prev, email: true })); validateField('email'); }}
                                    autoCapitalize="none"
                                    keyboardType="email-address"
                                    editable={!isSubmitting}
                                />
                            </View>
                            {touched.email && errors.email && <Text style={[dynamicStyles.errorText, { color: COLORS.error }]}>{errors.email}</Text>}
                        </View>

                        {/* Password Input */}
                        <View style={dynamicStyles.inputGroup}>
                            <Text style={[dynamicStyles.label, { color: COLORS.textPrimary }]}>{t('passwordLabel')}</Text>
                            <View style={[dynamicStyles.inputContainer, { backgroundColor: COLORS.surface, borderColor: touched.password && errors.password ? COLORS.error : COLORS.border }]}>
                                <TextInput
                                    style={[dynamicStyles.input, { color: COLORS.textPrimary }]}
                                    placeholder={t('passwordPlaceholder')}
                                    placeholderTextColor={COLORS.textTertiary}
                                    value={password}
                                    onChangeText={setPassword}
                                    onBlur={() => { setTouched(prev => ({ ...prev, password: true })); validateField('password'); }}
                                    secureTextEntry={!showPassword}
                                    editable={!isSubmitting}
                                />
                                <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={dynamicStyles.eyeIcon}>
                                    {showPassword ? <EyeOff color={COLORS.textSecondary} size={20} /> : <Eye color={COLORS.textSecondary} size={20} />}
                                </TouchableOpacity>
                            </View>
                            {touched.password && errors.password && <Text style={[dynamicStyles.errorText, { color: COLORS.error }]}>{errors.password}</Text>}
                        </View>

                        {/* ✅ 4. CHANGED: router.push */}
                        <TouchableOpacity style={dynamicStyles.forgotPassword} onPress={() => router.push('/ForgotPasswordScreen')}>
                            <Text style={[dynamicStyles.forgotPasswordText, { color: COLORS.primary }]}>{t('forgotPassword')}</Text>
                        </TouchableOpacity>

                        {/* Login Button with Spinner */}
                        <TouchableOpacity
                            style={[
                                dynamicStyles.loginButton,
                                {
                                    backgroundColor: isValid && !isSubmitting ? COLORS.primary : COLORS.surface,
                                    borderWidth: isValid && !isSubmitting ? 0 : 1,
                                    borderColor: COLORS.border,
                                },
                            ]}
                            onPress={handleLogin}
                            disabled={!isValid || isSubmitting}
                        >
                            {isSubmitting ? (
                                <ActivityIndicator color={isValid ? "#FFFFFF" : COLORS.textSecondary} />
                            ) : (
                                <Text style={[dynamicStyles.loginButtonText, { color: isValid ? '#FFFFFF' : COLORS.textSecondary }]}>
                                    {isValid ? t('loginButton') : t('enterDetails')}
                                </Text>
                            )}
                        </TouchableOpacity>

                        <View style={dynamicStyles.dividerContainer}>
                            <View style={[dynamicStyles.divider, { backgroundColor: COLORS.border }]} />
                            <Text style={[dynamicStyles.dividerText, { color: COLORS.textSecondary }]}>{t('orDivider')}</Text>
                            <View style={[dynamicStyles.divider, { backgroundColor: COLORS.border }]} />
                        </View>

                        <TouchableOpacity
                            style={[dynamicStyles.googleButton, { backgroundColor: COLORS.surface, borderWidth: 1, borderColor: COLORS.border }]}
                            onPress={handleGoogleLogin}
                            disabled={isSubmitting}
                        >
                            <Image source={require('../../assets/images/googlelo-removebg-preview.png')} style={dynamicStyles.googleIcon} resizeMode="contain" />
                            <Text style={[dynamicStyles.googleButtonText, { color: COLORS.textPrimary }]}>{t('googleSignIn')}</Text>
                        </TouchableOpacity>

                        <View style={dynamicStyles.footer}>
                            <Text style={[dynamicStyles.footerText, { color: COLORS.textSecondary }]}>{t('noAccount')}</Text>
                            {/* ✅ 5. CHANGED: router.push */}
                            <TouchableOpacity onPress={() => router.push('/RegisterScreen')}>
                                <Text style={[dynamicStyles.footerLink, { color: COLORS.primary }]}>{t('signUpLink')}</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>

            <CustomAlert
                visible={alertVisible}
                title={alertConfig.title}
                message={alertConfig.message}
                type={alertConfig.type}
                onClose={handleAlertClose}
                colors={COLORS}
            />
        </SafeAreaView>
    );
}

// ... (Styles remain exactly the same as before)
const createStyles = (colors: ColorTheme) =>
    StyleSheet.create({
        safeArea: { flex: 1 },
        container: { flex: 1 },
        loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
        inlineTitleWrapper: { flex: 1, alignItems: 'center' },
        inlineTitleText: { fontSize: 18, fontWeight: '700', letterSpacing: 0.5 },
        titleText: { fontSize: 32, fontWeight: '800', letterSpacing: 0.5 },
        scrollContent: { flexGrow: 1, paddingHorizontal: 24, paddingBottom: 40, justifyContent: 'flex-start' },
        header: { marginTop: 20, marginBottom: 20, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 0 },
        backButton: { padding: 8, marginLeft: -8, width: 40 },
        titleContainer: { marginTop: 50, marginBottom: 40, alignItems: 'center' },
        brandRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginBottom: 8 },
        logoImage: { height: 50, width: 50, resizeMode: 'contain', marginRight: 9 },
        logoText: { fontSize: 32, fontWeight: '800', letterSpacing: 0.5 },
        subtitle: { fontSize: 16, fontWeight: '400' },
        formContainer: { flex: 1 },
        inputGroup: { marginBottom: 20 },
        label: { fontSize: 14, fontWeight: '600', marginBottom: 8, marginLeft: 4 },
        inputContainer: { flexDirection: 'row', alignItems: 'center', borderRadius: 12, height: 56, paddingHorizontal: 16, borderWidth: 1 },
        input: { flex: 1, fontSize: 16, height: '100%' },
        eyeIcon: { padding: 8 },
        forgotPassword: { alignSelf: 'flex-end', marginBottom: 32 },
        forgotPasswordText: { fontSize: 14, fontWeight: '500' },
        loginButton: { height: 56, borderRadius: 28, justifyContent: 'center', alignItems: 'center', marginBottom: 24, shadowColor: colors.primary, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 8, elevation: 6 },
        loginButtonText: { fontSize: 16, fontWeight: '700' },
        dividerContainer: { flexDirection: 'row', alignItems: 'center', marginBottom: 24, paddingHorizontal: 10 },
        divider: { flex: 1, height: 1 },
        dividerText: { paddingHorizontal: 16, fontSize: 14 },
        googleButton: { height: 56, borderRadius: 28, justifyContent: 'center', alignItems: 'center', flexDirection: 'row', marginBottom: 20 },
        googleIcon: { width: 24, height: 24, marginRight: 12 },
        googleButtonText: { fontSize: 16, fontWeight: '600' },
        footer: { flexDirection: 'row', justifyContent: 'center', marginTop: 20 },
        footerText: { fontSize: 14 },
        footerLink: { fontSize: 14, fontWeight: '700', marginLeft: 4 },
        errorText: { fontSize: 13, marginTop: 4, marginLeft: 4 },
    });