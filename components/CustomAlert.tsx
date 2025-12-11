import React from 'react';
import { Modal, View, Text, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import { CheckCircle, XCircle } from 'lucide-react-native';

// Get screen width just for fallbacks, but we rely on maxWidth for the "portable" look
const { width } = Dimensions.get('window');

interface CustomAlertProps {
    visible: boolean;
    title: string;
    message: string;
    type: 'success' | 'error';
    onClose: () => void;
    colors: any;
}

export default function CustomAlert({ visible, title, message, type, onClose, colors }: CustomAlertProps) {
    return (
        <Modal
            transparent
            visible={visible}
            animationType="fade"
            onRequestClose={onClose}
        >
            <View style={styles.overlay}>
                {/* Modern, Compact Card */}
                <View style={[styles.alertContainer, { backgroundColor: colors.surface, borderColor: colors.border }]}>

                    {/* ICON - Slightly smaller for compact look */}
                    <View style={styles.iconContainer}>
                        {type === 'success' ? (
                            <CheckCircle size={40} color={colors.primary} />
                        ) : (
                            <XCircle size={40} color={colors.error || '#FF4444'} />
                        )}
                    </View>

                    {/* TEXT */}
                    <Text style={[styles.title, { color: colors.textPrimary }]}>{title}</Text>
                    <Text style={[styles.message, { color: colors.textSecondary }]}>{message}</Text>

                    {/* BUTTON - Compact height */}
                    <TouchableOpacity
                        style={[styles.button, { backgroundColor: colors.primary, shadowColor: colors.primary }]}
                        onPress={onClose}
                        activeOpacity={0.8}
                    >
                        <Text style={styles.buttonText}>OK</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.4)', // Slightly lighter dim for modern feel
        justifyContent: 'center',
        alignItems: 'center',
    },
    alertContainer: {
        width: '75%',           // Takes up less screen width
        maxWidth: 280,          // Stops it from getting too big (The "Portable" look)
        borderRadius: 20,       // Soft, modern corners
        paddingVertical: 24,
        paddingHorizontal: 20,
        alignItems: 'center',
        borderWidth: 1, // Subtle border

        // Modern Deep Shadow
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.25,
        shadowRadius: 10,
        elevation: 10,
    },
    iconContainer: {
        marginBottom: 12,
    },
    title: {
        fontSize: 18,           // Slightly smaller title
        fontWeight: '700',
        textAlign: 'center',
        marginBottom: 6,
    },
    message: {
        fontSize: 14,           // Compact body text
        textAlign: 'center',
        marginBottom: 20,
        lineHeight: 20,
        opacity: 0.9,
    },
    button: {
        width: '100%',
        paddingVertical: 10,    // Slimmer button
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',

        // Subtle Glow
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 6,
        elevation: 4,
    },
    buttonText: {
        color: '#FFFFFF',
        fontSize: 14,
        fontWeight: '600',
        letterSpacing: 0.5,
    },
});