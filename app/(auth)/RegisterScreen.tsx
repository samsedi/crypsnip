import React, { useState, useCallback } from "react";
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
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { Eye, EyeOff, ArrowLeft } from "lucide-react-native";
import { lightTheme, darkTheme, ColorTheme } from "@/constants/theme";
import * as ScreenCapture from "expo-screen-capture";
import { useLanguage } from '@/hooks/useLanguage';
import LanguageSwitchButton from '@/components/LanguageSwitchButton';

// --- TYPE DEFINITIONS FOR STATE ---
type AuthStackParamList = {
    LoginScreen: undefined;
    RegisterScreen: undefined;
    ForgotPasswordScreen: undefined;
    MainTabs: undefined;
    VerifyOTPScreen: undefined;
};

type RegisterNavigationProp = NativeStackNavigationProp<
    AuthStackParamList,
    "RegisterScreen"
>;

// ✅ FIXED: Use string only (no undefined) for cleaner validation
type FormValidationState = {
    fullName: string;
    email: string;
    password: string;
    confirmPassword: string;
};

type FormTouchedState = {
    fullName: boolean;
    email: boolean;
    password: boolean;
    confirmPassword: boolean;
};

// ---------------------------------------------------------------------------------

export default function RegisterScreen() {
    const { t, loading: languageLoading } = useLanguage();

    useFocusEffect(
        useCallback(() => {
            ScreenCapture.preventScreenCaptureAsync();
            return () => {
                ScreenCapture.allowScreenCaptureAsync();
            };
        }, [])
    );

    const navigation = useNavigation<RegisterNavigationProp>();

    const [fullName, setFullName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    // ✅ FIXED: Initialize with empty strings (no undefined)
    const [errors, setErrors] = useState<FormValidationState>({
        fullName: "",
        email: "",
        password: "",
        confirmPassword: "",
    });

    const [touched, setTouched] = useState<FormTouchedState>({
        fullName: false,
        email: false,
        password: false,
        confirmPassword: false,
    });

    const [isValid, setIsValid] = useState(false);

    const scheme = useColorScheme();
    const isDarkMode = scheme === "dark";
    const currentScheme = isDarkMode ? darkTheme : lightTheme;
    const { COLORS } = currentScheme;
    const dynamicStyles = createStyles(COLORS);

    // Email regex
    const validateEmail = (value: string): boolean => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(value);
    };

    const validatePassword = (value: string): boolean => {
        return value.length >= 6;
    };

    const validateField = (field: keyof FormValidationState) => {
        const newErrors: FormValidationState = {
            ...errors,
            fullName: errors.fullName,
            email: errors.email,
            password: errors.password,
            confirmPassword: errors.confirmPassword
        };

        if (field === "fullName") {
            newErrors.fullName = !fullName.trim() ? t('fullNameRequired') : "";
        }

        if (field === "email") {
            if (!email.trim()) {
                newErrors.email = t('emailRequired');
            } else if (!validateEmail(email.trim())) {
                newErrors.email = t('emailInvalid');
            } else {
                newErrors.email = "";
            }
        }

        if (field === "password") {
            if (!password.trim()) {
                newErrors.password = t('passwordRequired');
            } else if (!validatePassword(password.trim())) {
                newErrors.password = t('passwordTooShort');
            } else if (confirmPassword.trim() && password.trim() !== confirmPassword.trim()) {
                newErrors.password = t('passwordMismatch');
            } else {
                newErrors.password = "";
            }
        }

        if (field === "confirmPassword") {
            if (!confirmPassword.trim()) {
                newErrors.confirmPassword = t('confirmPasswordRequired');
            } else if (password.trim() !== confirmPassword.trim()) {
                newErrors.confirmPassword = t('passwordMismatch');
            } else {
                newErrors.confirmPassword = "";
            }
        }

        setErrors(newErrors);

        // ✅ FIXED: Now Object.values returns string[], some() returns boolean
        const hasErrors = Object.values(newErrors).some(error => error !== "");
        const allFieldsFilled = fullName.trim() && email.trim() && password.trim() && confirmPassword.trim();

        setIsValid(allFieldsFilled && !hasErrors);
    };

    const validateFormOnSubmit = () => {
        const fields: Array<keyof FormValidationState> = ["fullName", "email", "password", "confirmPassword"];
        const tempErrors: FormValidationState = {
            fullName: "",
            email: "",
            password: "",
            confirmPassword: ""
        };
        let formOk = true;

        if (!fullName.trim()) {
            tempErrors.fullName = t('fullNameRequired');
            formOk = false;
        }

        if (!email.trim()) {
            tempErrors.email = t('emailRequired');
            formOk = false;
        } else if (!validateEmail(email.trim())) {
            tempErrors.email = t('emailInvalid');
            formOk = false;
        }

        if (!password.trim()) {
            tempErrors.password = t('passwordRequired');
            formOk = false;
        } else if (!validatePassword(password.trim())) {
            tempErrors.password = t('passwordTooShort');
            formOk = false;
        }

        if (!confirmPassword.trim()) {
            tempErrors.confirmPassword = t('confirmPasswordRequired');
            formOk = false;
        } else if (password.trim() !== confirmPassword.trim()) {
            tempErrors.confirmPassword = t('passwordMismatch');
            tempErrors.password = t('passwordMismatch');
            formOk = false;
        }

        // Set touched state for all fields
        const newTouched: FormTouchedState = {
            fullName: true,
            email: true,
            password: true,
            confirmPassword: true
        };
        setTouched(newTouched);

        setErrors(tempErrors);
        setIsValid(formOk);

        return formOk;
    };

    const handleSignup = () => {
        const ok = validateFormOnSubmit();
        if (!ok) return;

        navigation.replace("VerifyOTPScreen");
    };

    const handleGoogleSignup = () => {
        console.log("Google Signup pressed");
    };

    if (languageLoading) {
        return (
            <SafeAreaView
                style={[dynamicStyles.safeArea, { backgroundColor: COLORS.background }]}
                edges={['top', 'bottom', 'left', 'right']}
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
                barStyle={isDarkMode ? "light-content" : "dark-content"}
                backgroundColor={COLORS.background}
            />

            <KeyboardAvoidingView
                behavior={Platform.OS === "ios" ? "padding" : "height"}
                style={dynamicStyles.container}
            >
                <ScrollView
                    contentContainerStyle={dynamicStyles.scrollContent}
                    showsVerticalScrollIndicator={false}
                >
                    {/* Header Area: INLINE Aesthetic (Matches LoginScreen) */}
                    <View style={dynamicStyles.header}>
                        {/* 1. Back Button */}
                        <TouchableOpacity
                            onPress={() => navigation.goBack()}
                            style={dynamicStyles.backButton}
                        >
                            <ArrowLeft color={COLORS.textPrimary} size={24} />
                        </TouchableOpacity>

                        {/* 2. Register Title - Centered between the buttons */}
                        <View style={dynamicStyles.inlineTitleWrapper}>
                            <Text
                                style={[dynamicStyles.inlineTitleText, { color: COLORS.textPrimary }]}
                            >
                                {t('registerTitle')}
                            </Text>
                        </View>

                        {/* 3. Language Switch Button */}
                        <LanguageSwitchButton colors={COLORS} />
                    </View>

                    {/* Logo & Title Area - Pushed Down (Matches LoginScreen) */}
                    <View style={dynamicStyles.titleContainer}>
                        <View style={dynamicStyles.brandRow}>
                            <Image
                                source={require("../../assets/images/cypsniplogo-removebg-preview.png")}
                                style={dynamicStyles.logoImage}
                                resizeMode="contain"
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
                            {t('thanksForJoining')}
                        </Text>
                    </View>

                    {/* Form Area */}
                    <View style={dynamicStyles.formContainer}>
                        {/* Full Name Input */}
                        <View style={dynamicStyles.inputGroup}>
                            <Text style={[dynamicStyles.label, { color: COLORS.textPrimary }]}>
                                {t('fullNameLabel')}
                            </Text>
                            <View
                                style={[
                                    dynamicStyles.inputContainer,
                                    {
                                        backgroundColor: COLORS.surface,
                                        borderColor: touched.fullName && errors.fullName !== ""
                                            ? COLORS.error
                                            : COLORS.border,
                                    },
                                ]}
                            >
                                <TextInput
                                    style={[dynamicStyles.input, { color: COLORS.textPrimary }]}
                                    placeholder={t('fullNamePlaceholder')}
                                    placeholderTextColor={COLORS.textTertiary}
                                    value={fullName}
                                    onChangeText={setFullName}
                                    onBlur={() => {
                                        setTouched((prev) => ({ ...prev, fullName: true }));
                                        validateField("fullName");
                                    }}
                                    autoCapitalize="words"
                                />
                            </View>
                            {touched.fullName && errors.fullName !== "" && (
                                <Text style={[dynamicStyles.errorText, { color: COLORS.error }]}>
                                    {errors.fullName}
                                </Text>
                            )}
                        </View>

                        {/* Email Input */}
                        <View style={dynamicStyles.inputGroup}>
                            <Text style={[dynamicStyles.label, { color: COLORS.textPrimary }]}>
                                {t('emailLabel')}
                            </Text>
                            <View
                                style={[
                                    dynamicStyles.inputContainer,
                                    {
                                        backgroundColor: COLORS.surface,
                                        borderColor: touched.email && errors.email !== ""
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
                                        setTouched((prev) => ({ ...prev, email: true }));
                                        validateField("email");
                                    }}
                                    autoCapitalize="none"
                                    keyboardType="email-address"
                                />
                            </View>
                            {touched.email && errors.email !== "" && (
                                <Text style={[dynamicStyles.errorText, { color: COLORS.error }]}>
                                    {errors.email}
                                </Text>
                            )}
                        </View>

                        {/* Password Input */}
                        <View style={dynamicStyles.inputGroup}>
                            <Text style={[dynamicStyles.label, { color: COLORS.textPrimary }]}>
                                {t('passwordLabel')}
                            </Text>
                            <View
                                style={[
                                    dynamicStyles.inputContainer,
                                    {
                                        backgroundColor: COLORS.surface,
                                        borderColor: touched.password && errors.password !== ""
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
                                        setTouched((prev) => ({ ...prev, password: true }));
                                        validateField("password");
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
                            {touched.password && errors.password !== "" && (
                                <Text style={[dynamicStyles.errorText, { color: COLORS.error }]}>
                                    {errors.password}
                                </Text>
                            )}
                        </View>

                        {/* Confirm Password Input */}
                        <View style={dynamicStyles.inputGroup}>
                            <Text style={[dynamicStyles.label, { color: COLORS.textPrimary }]}>
                                {t('confirmPasswordLabel')}
                            </Text>
                            <View
                                style={[
                                    dynamicStyles.inputContainer,
                                    {
                                        backgroundColor: COLORS.surface,
                                        borderColor: touched.confirmPassword && errors.confirmPassword !== ""
                                            ? COLORS.error
                                            : COLORS.border,
                                    },
                                ]}
                            >
                                <TextInput
                                    style={[dynamicStyles.input, { color: COLORS.textPrimary }]}
                                    placeholder={t('confirmPasswordPlaceholder')}
                                    placeholderTextColor={COLORS.textTertiary}
                                    value={confirmPassword}
                                    onChangeText={setConfirmPassword}
                                    onBlur={() => {
                                        setTouched((prev) => ({ ...prev, confirmPassword: true }));
                                        validateField("confirmPassword");
                                    }}
                                    secureTextEntry={!showConfirmPassword}
                                />
                                <TouchableOpacity
                                    onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                                    style={dynamicStyles.eyeIcon}
                                >
                                    {showConfirmPassword ? (
                                        <EyeOff color={COLORS.textSecondary} size={20} />
                                    ) : (
                                        <Eye color={COLORS.textSecondary} size={20} />
                                    )}
                                </TouchableOpacity>
                            </View>
                            {touched.confirmPassword && errors.confirmPassword !== "" && (
                                <Text style={[dynamicStyles.errorText, { color: COLORS.error }]}>
                                    {errors.confirmPassword}
                                </Text>
                            )}
                        </View>

                        {/* Sign Up Button */}
                        <TouchableOpacity
                            style={[
                                dynamicStyles.signupButton,
                                {
                                    backgroundColor: isValid ? COLORS.primary : COLORS.surface,
                                    borderWidth: isValid ? 0 : 1,
                                    borderColor: COLORS.border,
                                },
                            ]}
                            onPress={handleSignup}
                            disabled={!isValid}
                        >
                            <Text
                                style={[
                                    dynamicStyles.signupButtonText,
                                    { color: isValid ? "#FFFFFF" : COLORS.textSecondary },
                                ]}
                            >
                                {isValid ? t('registerButton') : t('enterDetails')}
                            </Text>
                        </TouchableOpacity>

                        {/* OR Divider */}
                        <View style={dynamicStyles.dividerContainer}>
                            <View style={[dynamicStyles.divider, { backgroundColor: COLORS.border }]} />
                            <Text style={[dynamicStyles.dividerText, { color: COLORS.textSecondary }]}>
                                {t('orDivider')}
                            </Text>
                            <View style={[dynamicStyles.divider, { backgroundColor: COLORS.border }]} />
                        </View>

                        {/* Google Sign Up Button */}
                        <TouchableOpacity
                            style={[
                                dynamicStyles.googleButton,
                                {
                                    backgroundColor: COLORS.surface,
                                    borderWidth: 1,
                                    borderColor: COLORS.border,
                                },
                            ]}
                            onPress={handleGoogleSignup}
                        >
                            <Image
                                source={require("../../assets/images/googlelo-removebg-preview.png")}
                                style={dynamicStyles.googleIcon}
                                resizeMode="contain"
                            />
                            <Text style={[dynamicStyles.googleButtonText, { color: COLORS.textPrimary }]}>
                                {t('googleSignUp')}
                            </Text>
                        </TouchableOpacity>

                        {/* Footer / Sign In Link */}
                        <View style={dynamicStyles.footer}>
                            <Text style={[dynamicStyles.footerText, { color: COLORS.textSecondary }]}>
                                {t('alreadyHaveAccount')}{" "}
                            </Text>
                            <TouchableOpacity onPress={() => navigation.navigate("LoginScreen")}>
                                <Text style={[dynamicStyles.footerLink, { color: COLORS.primary }]}>
                                    {t('signInLink')}
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
        scrollContent: {
            flexGrow: 1,
            paddingHorizontal: 24,
            paddingBottom: 40,
            justifyContent: "flex-start",
        },
        header: {
            marginTop: 20,
            marginBottom: 20,
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
        },
        backButton: {
            padding: 8,
            marginLeft: -8,
            width: 40,
        },
        titleContainer: {
            marginTop: 50,
            marginBottom: 40,
            alignItems: "center",
        },
        titleTextWrapper: {
            display: 'none',
        },
        titleText: {
            fontSize: 32,
            fontWeight: "800",
            letterSpacing: 0.5,
        },
        brandRow: {
            flexDirection: "row",
            alignItems: "center",
            marginBottom: 8,
        },
        logoImage: {
            width: 50,
            height: 50,
            marginRight: 8,
        },
        logoText: {
            fontSize: 32,
            fontWeight: "800",
            letterSpacing: 0.5,
        },
        subtitle: {
            fontSize: 16,
            fontWeight: "400",
        },
        formContainer: {
            width: "100%",
        },
        inputGroup: {
            marginBottom: 20,
        },
        label: {
            fontSize: 14,
            fontWeight: "600",
            marginBottom: 8,
            marginLeft: 4,
        },
        inputContainer: {
            flexDirection: "row",
            alignItems: "center",
            borderRadius: 12,
            height: 56,
            paddingHorizontal: 16,
            borderWidth: 1,
        },
        input: {
            flex: 1,
            fontSize: 16,
            height: "100%",
        },
        eyeIcon: {
            padding: 8,
        },
        signupButton: {
            height: 56,
            borderRadius: 28,
            justifyContent: "center",
            alignItems: "center",
            marginBottom: 24,
            shadowColor: colors.primary,
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.3,
            shadowRadius: 8,
            elevation: 6,
        },
        signupButtonText: {
            fontSize: 16,
            fontWeight: "700",
        },
        dividerContainer: {
            flexDirection: "row",
            alignItems: "center",
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
            justifyContent: "center",
            alignItems: "center",
            flexDirection: "row",
            marginBottom: 20,
        },
        googleIcon: {
            width: 24,
            height: 24,
            marginRight: 12,
        },
        googleButtonText: {
            fontSize: 16,
            fontWeight: "600",
        },
        footer: {
            flexDirection: "row",
            justifyContent: "center",
            marginTop: 20,
        },
        footerText: {
            fontSize: 14,
        },
        footerLink: {
            fontSize: 14,
            fontWeight: "700",
            marginLeft: 4,
        },
        errorText: {
            fontSize: 13,
            marginTop: 4,
            marginLeft: 4,
        },
    });
