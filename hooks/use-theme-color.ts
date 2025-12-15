import { useColorScheme } from 'react-native';
import { lightTheme, darkTheme } from '@/constants/theme';

export function useThemeColor(
    props: { light?: string; dark?: string },
    colorName: keyof typeof lightTheme.COLORS
) {
    // 1. Detect the current system theme (light or dark)
    const theme = useColorScheme() ?? 'light';

    // 2. Select the correct color palette based on the theme
    const activeColors = theme === 'dark' ? darkTheme.COLORS : lightTheme.COLORS;

    // 3. Check if a specific override color was passed in props
    const colorFromProps = props?.[theme];

    if (colorFromProps) {
        return colorFromProps;
    } else {
        // 4. Return the color from your new theme system
        return activeColors[colorName];
    }
}