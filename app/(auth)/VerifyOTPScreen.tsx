import React, { useState, useRef } from "react";
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
    ActivityIndicator
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation, useRoute, RouteProp } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { ArrowLeft } from "lucide-react-native";
import { lightTheme, darkTheme, ColorTheme } from "@/constants/theme";
import authService from "@/Services/authService";

// ✅ Import Custom Alert
import CustomAlert from "../../components/CustomAlert";

type AuthStackParamList = {
    LoginScreen: undefined;
    RegisterScreen: undefined;
    VerifyOTPScreen: { email: string };
    MainTabs: undefined;
};

type VerifyScreenRouteProp = RouteProp<AuthStackParamList, "VerifyOTPScreen">;
type VerifyOTPNavigationProp = NativeStackNavigationProp<AuthStackParamList, "VerifyOTPScreen">;

export default function VerifyOTPScreen() {
    const navigation = useNavigation<VerifyOTPNavigationProp>();

    // 1. GET THE EMAIL PASSED FROM REGISTER SCREEN
    const route = useRoute<VerifyScreenRouteProp>();
    const { email } = route.params;

    const [otp, setOtp] = useState(["", "", "", ""]);
    const [loading, setLoading] = useState(false);
    const inputRefs = useRef<TextInput[]>([]);

    // ✅ Alert State
    const [alertVisible, setAlertVisible] = useState(false);
    const [alertConfig, setAlertConfig] = useState({
        title: "",
        message: "",
        type: "success" as "success" | "error",
        onClose: () => {}
    });

    // Detect theme
    const scheme = useColorScheme();
    const isDarkMode = scheme === "dark";
    const currentTheme = isDarkMode ? darkTheme : lightTheme;
    const { COLORS } = currentTheme;
    const dynamicStyles = createStyles(COLORS);

    // ✅ Helper to show Custom Alert
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

    const handleOtpChange = (value: string, index: number) => {
        if (!/^\d*$/.test(value)) return;

        const newOtp = [...otp];
        newOtp[index] = value;
        setOtp(newOtp);

        if (value && index < 3) {
            inputRefs.current[index + 1]?.focus();
        }
    };

    const handleKeyPress = (key: string, index: number) => {
        if (key === "Backspace") {
            if (!otp[index] && index > 0) {
                inputRefs.current[index - 1]?.focus();
                const newOtp = [...otp];
                newOtp[index - 1] = "";
                setOtp(newOtp);
            } else {
                const newOtp = [...otp];
                newOtp[index] = "";
                setOtp(newOtp);
            }
        }
    };

    // ✅ VERIFY LOGIC WITH CUSTOM ALERT
    const handleVerifyOtp = async () => {
        const otpCode = otp.join("");

        if (otpCode.length !== 4) {
            showAlert("Invalid Input", "Please enter the full 4-digit code.", "error");
            return;
        }

        setLoading(true);
        try {
            await authService.verifyOtp({ email, otp: otpCode });

            // Success: Show Alert -> Then Navigate
            showAlert("Success", "Account verified! Please login.", "success", () => {
                navigation.replace("LoginScreen");
            });

        } catch (error: any) {
            showAlert("Verification Failed", error.message || "Invalid OTP", "error");
        } finally {
            setLoading(false);
        }
    };

    // ✅ RESEND LOGIC WITH CUSTOM ALERT
    const handleResendOtp = async () => {
        setLoading(true);
        try {
            await authService.resendOtp(email);
            showAlert("Code Sent", `A new code has been sent to ${email}`, "success");
        } catch (error: any) {
            showAlert("Error", error.message || "Could not resend OTP", "error");
        } finally {
            setLoading(false);
        }
    };

    const isOtpComplete = otp.every((digit) => digit !== "");

    return (
        <SafeAreaView style={[dynamicStyles.safeArea, { backgroundColor: COLORS.background }]}>
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
                    {/* Header Area */}
                    <View style={dynamicStyles.header}>
                        <TouchableOpacity
                            onPress={() => navigation.goBack()}
                            style={dynamicStyles.backButton}
                        >
                            <ArrowLeft color={COLORS.textPrimary} size={24} />
                        </TouchableOpacity>
                        <Text style={[dynamicStyles.titleText, { color: COLORS.textPrimary }]}>
                            Verify OTP
                        </Text>
                    </View>

                    {/* Logo & Title Area */}
                    <View style={dynamicStyles.titleContainer}>
                        <View style={dynamicStyles.brandRow}>
                            <Image
                                source={require("../../assets/images/cypsniplogo-removebg-preview.png")}
                                style={dynamicStyles.logoImage}
                                resizeMode="contain"
                            />
                            <Text style={[dynamicStyles.logoText, { color: COLORS.textPrimary }]}>
                                Crypsnip
                            </Text>
                        </View>

                        <Text style={[dynamicStyles.subtitle, { color: COLORS.textSecondary }]}>
                            Enter the 4-digit code sent to{"\n"}
                            <Text style={{ fontWeight: "700", color: COLORS.primary }}>{email}</Text>
                        </Text>
                    </View>

                    {/* OTP Input Area */}
                    <View style={dynamicStyles.formContainer}>
                        <View style={dynamicStyles.otpContainer}>
                            {otp.map((digit, index) => (
                                <TextInput
                                    key={index}
                                    ref={(ref: any) => {
                                        if (ref) inputRefs.current[index] = ref;
                                    }}
                                    style={[
                                        dynamicStyles.otpInput,
                                        {
                                            backgroundColor: COLORS.surface,
                                            borderColor: otp[index] ? COLORS.primary : COLORS.border,
                                            color: COLORS.textPrimary,
                                        },
                                    ]}
                                    maxLength={1}
                                    keyboardType="numeric"
                                    value={digit}
                                    onChangeText={(value) => handleOtpChange(value, index)}
                                    onKeyPress={({ nativeEvent }) => handleKeyPress(nativeEvent.key, index)}
                                    placeholder="0"
                                    placeholderTextColor={COLORS.textTertiary}
                                    editable={!loading}
                                />
                            ))}
                        </View>

                        {/* Verify Button */}
                        <TouchableOpacity
                            style={[
                                dynamicStyles.verifyButton,
                                {
                                    backgroundColor: isOtpComplete ? COLORS.primary : COLORS.textTertiary,
                                },
                            ]}
                            onPress={handleVerifyOtp}
                            disabled={!isOtpComplete || loading}
                        >
                            {loading ? (
                                <ActivityIndicator color="#FFFFFF" />
                            ) : (
                                <Text style={dynamicStyles.verifyButtonText}>Verify OTP</Text>
                            )}
                        </TouchableOpacity>

                        {/* Resend OTP */}
                        <View style={dynamicStyles.resendContainer}>
                            <Text style={[dynamicStyles.resendText, { color: COLORS.textSecondary }]}>
                                Didn't receive the code?
                            </Text>
                            <TouchableOpacity onPress={handleResendOtp} disabled={loading}>
                                <Text style={[dynamicStyles.resendLink, { color: COLORS.primary }]}>
                                    Resend OTP
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>

            {/* ✅ Custom Alert Component */}
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

const createStyles = (colors: ColorTheme) =>
    StyleSheet.create({
        safeArea: {
            flex: 1,
        },
        container: {
            flex: 1,
        },
        scrollContent: {
            flexGrow: 1,
            paddingHorizontal: 24,
            paddingBottom: 40,
        },
        header: {
            marginTop: 80,
            marginBottom: 70,
            flexDirection: "row",
            alignItems: "center",
            marginLeft: 70,
        },
        backButton: {
            padding: 8,
            marginLeft: -8,
        },
        titleText: {
            fontSize: 32,
            fontWeight: "800",
            letterSpacing: 0.5,
        },
        titleContainer: {
            marginBottom: 40,
            alignItems: "center",
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
            marginTop: 12,
            textAlign: "center",
        },
        formContainer: {
            width: "100%",
        },
        otpContainer: {
            flexDirection: "row",
            justifyContent: "space-between",
            marginBottom: 32,
            paddingHorizontal: 16,
        },
        otpInput: {
            width: 56,
            height: 56,
            borderRadius: 12,
            borderWidth: 2,
            fontSize: 24,
            fontWeight: "600",
            textAlign: "center",
        },
        verifyButton: {
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
        verifyButtonText: {
            color: "#FFFFFF",
            fontSize: 16,
            fontWeight: "700",
        },
        resendContainer: {
            flexDirection: "row",
            justifyContent: "center",
            alignItems: "center",
            gap: 4,
        },
        resendText: {
            fontSize: 14,
            fontWeight: "400",
        },
        resendLink: {
            fontSize: 14,
            fontWeight: "700",
        },
    });