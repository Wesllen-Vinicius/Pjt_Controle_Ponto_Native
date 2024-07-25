import React from 'react';
import {
    TouchableOpacity,
    TextStyle,
    ViewStyle,
    StyleSheet,
} from 'react-native';
import { ThemedText } from '@/components/ThemedText';

interface TimePickerButtonProps {
    label: string;
    time: Date | null;
    isDarkMode: boolean;
    onPress: () => void;
}

const TimePickerButton: React.FC<TimePickerButtonProps> = ({
    label,
    time,
    isDarkMode,
    onPress,
}) => {
    const buttonStyle = (isSelected: boolean): ViewStyle => ({
        backgroundColor: isSelected
            ? isDarkMode
                ? '#FFFFFF'
                : '#161B22'
            : isDarkMode
            ? '#010409'
            : '#bdb9b9',
        paddingVertical: 12,
        paddingHorizontal: 16,
        borderRadius: 8,
        alignItems: 'center',
        marginTop: 8,
        width: '100%',
    });

    const buttonTextStyle = (isSelected: boolean): TextStyle => ({
        color: isSelected
            ? isDarkMode
                ? '#000000'
                : '#FFFFFF'
            : isDarkMode
            ? '#FFFFFF'
            : '#161B22',
        fontSize: 16,
    });

    const formatTime = (date: Date | null) => {
        if (!date) return '00:00';
        const hours = date.getHours().toString().padStart(2, '0');
        const minutes = date.getMinutes().toString().padStart(2, '0');
        return `${hours}:${minutes}`;
    };

    return (
        <TouchableOpacity style={buttonStyle(!!time)} onPress={onPress}>
            <ThemedText type="subtitle" style={buttonTextStyle(!!time)}>
                {formatTime(time)}
            </ThemedText>
        </TouchableOpacity>
    );
};

export default TimePickerButton;
