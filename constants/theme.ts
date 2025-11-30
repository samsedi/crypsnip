import { Dimensions, TextStyle } from "react-native";
const { width, height } = Dimensions.get("window");

// 1. Define the Shape of your Colors Object
// This tells TypeScript exactly what colors to expect.
export interface ColorTheme {
    primary: string;
    background: string;
    surface: string;
    textPrimary: string;
    textSecondary: string;
    textTertiary: string;
    success: string;
    danger: string;
    warning: string;
    info: string;
    white: string;
    black: string;
    border: string;
    overlay: string;
    transparent: string;
    type: string;
    error: string;
}

export const SIZES = {
    base: 8,
    font: 14,
    radius: 12,
    padding: 24,
    largeTitle: 40,
    h1: 30,
    h2: 22,
    h3: 16,
    h4: 14,
    body1: 30,
    body2: 22,
    body3: 16,
    body4: 14,
    body5: 12,
    width,
    height,
    margin: 16,
    paddingSmall: 10,
    paddingMedium: 16,
    paddingLarge: 24,
};

const commonColors = {
    primary: "#3B82F6",
    success: "#10B981",
    danger: "#EF4444",
    warning: "#F59E0B",
    info: "#3B82F6",
    white: "#FFFFFF",
    black: "#000000",
    transparent: "transparent",
};

// Apply the interface ': ColorTheme' to ensure we don't miss any keys
const lightColors: ColorTheme = {
    ...commonColors,
    background: "#F8FAFC",
    surface: "#FFFFFF",
    textPrimary: "#0F172A",
    textSecondary: "#475569",
    textTertiary: "#94A3B8",
    border: "#E2E8F0",
    overlay: "rgba(0,0,0,0.3)",
    type: "light",
    error: "#EF4444",
};

const darkColors: ColorTheme = {
    ...commonColors,
    background: "#000000",
    surface: "#1E1E1E",
    textPrimary: "#F8FAFC",
    textSecondary: "#94A3B8",
    textTertiary: "#64748B",
    border: "#333333",
    overlay: "rgba(0,0,0,0.7)",
    type: "dark",
    error:"#EF4444"
};

// 2. Fix the Error: Type the 'colors' parameter
const getFonts = (colors: ColorTheme): { [key: string]: TextStyle } => ({
    largeTitle: { fontFamily: "Inter-Bold", fontSize: SIZES.largeTitle, lineHeight: 55, color: colors.textPrimary },
    h1: { fontFamily: "Inter-Bold", fontSize: SIZES.h1, lineHeight: 36, color: colors.textPrimary },
    h2: { fontFamily: "Inter-Bold", fontSize: SIZES.h2, lineHeight: 30, color: colors.textPrimary },
    h3: { fontFamily: "Inter-SemiBold", fontSize: SIZES.h3, lineHeight: 22, color: colors.textPrimary },
    h4: { fontFamily: "Inter-SemiBold", fontSize: SIZES.h4, lineHeight: 22, color: colors.textPrimary },
    body1: { fontFamily: "Inter-Regular", fontSize: SIZES.body1, lineHeight: 36, color: colors.textSecondary },
    body2: { fontFamily: "Inter-Regular", fontSize: SIZES.body2, lineHeight: 30, color: colors.textSecondary },
    body3: { fontFamily: "Inter-Regular", fontSize: SIZES.body3, lineHeight: 22, color: colors.textSecondary },
    body4: { fontFamily: "Inter-Regular", fontSize: SIZES.body4, lineHeight: 22, color: colors.textSecondary },
    body5: { fontFamily: "Inter-Regular", fontSize: SIZES.body5, lineHeight: 22, color: colors.textSecondary },
    mono: { fontFamily: "JetBrainsMono-Regular", fontSize: 14, color: colors.textPrimary },
});

// 2. Fix the Error: Type the 'colors' parameter here too
const getShadows = (colors: ColorTheme) => ({
    light: {
        shadowColor: colors.textPrimary,
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.22,
        shadowRadius: 2.22,
        elevation: 3,
    },
    medium: {
        shadowColor: colors.textPrimary,
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.29,
        shadowRadius: 4.65,
        elevation: 7,
    },
    dark: {
        shadowColor: colors.textPrimary,
        shadowOffset: { width: 0, height: 7 },
        shadowOpacity: 0.41,
        shadowRadius: 9.11,
        elevation: 14,
    },
    primaryGlow: {
        shadowColor: colors.primary,
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.5,
        shadowRadius: 10,
        elevation: 5,
    }
});

export const lightTheme = {
    COLORS: lightColors,
    SIZES: SIZES,
    FONTS: getFonts(lightColors),
    SHADOWS: getShadows(lightColors),
};

export const darkTheme = {
    COLORS: darkColors,
    SIZES: SIZES,
    FONTS: getFonts(darkColors),
    SHADOWS: getShadows(darkColors),
};

const appTheme = { lightTheme, darkTheme };

export default appTheme;