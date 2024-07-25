import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface RecordItemProps {
    item: {
        id: number;
        data: Date;
    };
    isDarkMode: boolean;
}

const RecordItem: React.FC<RecordItemProps> = ({ item, isDarkMode }) => {
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
                {item.data.toLocaleString()}
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

export default RecordItem;
