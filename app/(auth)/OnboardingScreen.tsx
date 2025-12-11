import React, { useMemo } from 'react';
import {
    View,
    Text,
    StyleSheet,
    Image,
    StatusBar,
    Dimensions,
    useColorScheme, // 1. Import this to detect system theme
} from 'react-native';
import AppSlider from 'react-native-app-intro-slider';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

// 2. Import the theme objects instead of direct COLORS
import { lightTheme, darkTheme, ColorTheme } from '@/constants/theme';

// Define the type for your navigation stack
type AuthStackParamList = {
    LoginScreen: undefined;
    RegisterScreen: undefined;
};

type OnboardingNavigationProp = NativeStackNavigationProp<AuthStackParamList, 'LoginScreen'>;

const { width } = Dimensions.get("window");

const slides = [
    {
        key: '1',
        title: 'AI POWERED ANALYSIS',
        text: 'Our advanced AI scans the market 24/7 to find profitable opportunities before they happen.',
        image: require('../../assets/images/generated-image__12_-removebg-preview.png'),
    },
    {
        key: '2',
        title: 'REAL-TIME SIGNALS',
        text: 'Get instant notifications for high-profitability trade setups sent directly to your device.',
        image: require('../../assets/images/not.png'),
    },
    {
        key: '3',
        title: 'TRADE SMARTER',
        text: 'Utilize powerful tools for risk management, backtesting, and portfolio growth.',
        image: require('../../assets/images/unnamed__1_-removebg-preview.png'),
    },
];

export default function OnboardingScreen() {
    const navigation = useNavigation<OnboardingNavigationProp>();

    // 3. Detect Theme
    const scheme = useColorScheme();
    const isDarkMode = scheme === 'dark';

    // 4. Select the active colors based on the scheme
    const theme = isDarkMode ? darkTheme : lightTheme;
    const { COLORS } = theme;

    // 5. Generate styles dynamically using useMemo
    // (This prevents re-calculating styles on every render, only when theme changes)
    const styles = useMemo(() => createStyles(COLORS), [COLORS]);

    const onDone = () => {
        navigation.replace('LoginScreen');
    };

    const renderItem = ({ item }: { item: typeof slides[0] }) => {
        return (
            <View style={styles.slide}>
                <View>
                    <Image
                        source={require('../../assets/images/cypsniplogo-removebg-preview.png')}
                        style={styles.logoImage}
                    />
                    <Text style={styles.titleText}>CRYPSNIP TRADER</Text>
                </View>

                <View style={styles.imageContainer}>
                    <Image
                        source={item.image}
                        style={styles.image}
                        resizeMode="contain"
                    />
                </View>
                <View style={styles.textContainer}>
                    <Text style={styles.title}>{item.title}</Text>
                    <Text style={styles.text}>{item.text}</Text>
                </View>
            </View>
        );
    };

    const renderNextButton = () => {
        return (
            <View style={styles.buttonCircle}>
                <Text style={styles.btnText}>Next</Text>
            </View>
        );
    };

    const renderDoneButton = () => {
        return (
            <View style={[styles.buttonCircle, styles.doneButton]}>
                <Text style={styles.btnTextBold}>Get Started</Text>
            </View>
        );
    };

    const renderSkipButton = () => {
        return (
            <View style={styles.skipContainer}>
                <Text style={styles.skipText}>Skip</Text>
            </View>
        )
    }

    return (
        <View style={styles.container}>
            {/* 6. Update StatusBar to be dynamic */}
            <StatusBar
                barStyle={isDarkMode ? "light-content" : "dark-content"}
                backgroundColor={COLORS.background}
            />

            <AppSlider
                renderItem={renderItem}
                data={slides}
                onDone={onDone}
                renderNextButton={renderNextButton}
                renderDoneButton={renderDoneButton}
                showSkipButton={true}
                onSkip={onDone}
                renderSkipButton={renderSkipButton}

                // Dot Styles using dynamic COLORS
                activeDotStyle={{
                    backgroundColor: COLORS.primary,
                    width: 25,
                    height: 8,
                    borderRadius: 4,
                }}
                dotStyle={{
                    backgroundColor: COLORS.border, // Changed from hardcoded #333 to adaptive border color
                    width: 8,
                    height: 8,
                    borderRadius: 4,
                }}
                bottomButton={true}
            />
        </View>
    );
}

// 7. Wrap styles in a function that accepts the COLORS object
const createStyles = (COLORS: ColorTheme) => StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.background,
    },
    titleText:{
        fontSize: 20,
        color: COLORS.textPrimary,
        textAlign: 'center',
        lineHeight: 24,
        paddingHorizontal: 10,
    },
    slide: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 20,
        paddingTop: 50,
    },
    imageContainer: {
        flex: 0.5,
        justifyContent: 'center',
        alignItems: 'center',
        width: width * 0.9,
        marginBottom: 20,
    },
    image: {
        width: '80%',
        height: '100%',
    },
    textContainer: {
        flex: 0.4,
        alignItems: 'center',
        justifyContent: 'flex-start',
        paddingTop: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: '800',
        color: COLORS.primary,
        textAlign: 'center',
        marginBottom: 15,
        letterSpacing: 1,
        textTransform: 'uppercase',
    },
    text: {
        fontSize: 16,
        color: COLORS.textSecondary,
        textAlign: 'center',
        lineHeight: 24,
        paddingHorizontal: 10,
    },
    buttonCircle: {
        width: '100%',
        height: 55,
        backgroundColor: 'transparent',
        justifyContent: 'center',
        alignItems: 'center',
        borderColor: COLORS.primary,
        borderWidth: 1,
        borderRadius: 12,
        marginBottom: 10,
    },
    doneButton: {
        backgroundColor: COLORS.primary,
    },
    btnText: {
        color: COLORS.primary,
        fontSize: 16,
        fontWeight: '600',
    },
    btnTextBold: {
        color: COLORS.white, // Keep white for filled buttons usually, or adapt if needed
        fontSize: 16,
        fontWeight: 'bold'
    },
    skipContainer: {
        height: 50,
        justifyContent: 'center',
        alignItems: 'center',
    },
    skipText: {
        color: COLORS.textSecondary,
        fontSize: 14,
    },
    logoImage: {
        height: 50,
        width: 50,
        resizeMode: 'contain',
        marginRight: 9,
    }
});