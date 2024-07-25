import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface RecordItemHistoricoProps {
    time: string;
    type: string;
    isDarkMode: boolean;
}

const RecordItemHistorico: React.FC<RecordItemHistoricoProps> = ({
    time,
    type,
    isDarkMode,
}) => {
    return (
        <View
            style={[
                styles.recordItem,
                { backgroundColor: isDarkMode ? '#161B22' : '#FFFFFF' },
            ]}
        >
            <Text
                style={[
                    styles.recordText,
                    { color: isDarkMode ? '#FFFFFF' : '#070707' },
                ]}
            >
                {time} - {type}
            </Text>
        </View>
    );
};

const styles = StyleSheet.create({
    recordItem: {
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#DDDDDD',
        width: '100%',
    },
    recordText: {
        fontSize: 16,
        lineHeight: 24,
    },
});

export default RecordItemHistorico;
