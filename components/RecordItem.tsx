import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';

interface RecordItemProps {
    item: {
        id: number;
        data: Date;
    };
    isDarkMode: boolean;
    isNewRecord?: boolean;
}

const RecordItem: React.FC<RecordItemProps> = ({
    item,
    isDarkMode,
    isNewRecord,
}) => {
    const animatedValue = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        if (isNewRecord) {
            Animated.timing(animatedValue, {
                toValue: 1,
                duration: 500,
                useNativeDriver: true,
            }).start();
        }
    }, [isNewRecord]);

    return (
        <View
            style={[
                styles.recordItem,
                { backgroundColor: isDarkMode ? '#1E1E1E' : '#F7F7F7' },
            ]}
        >
            <Animated.View
                style={[
                    styles.line,
                    {
                        backgroundColor: isDarkMode ? '#3C4F5F' : '#E0E0E0',
                        width: animatedValue.interpolate({
                            inputRange: [0, 1],
                            outputRange: [0, 4],
                        }),
                    },
                ]}
            />
            <View style={styles.textContainer}>
                <Text
                    style={[
                        styles.recordText,
                        { color: isDarkMode ? '#FFFFFF' : '#070707' },
                    ]}
                >
                    {item.data.toLocaleString()}
                </Text>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    recordItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 12,
        paddingHorizontal: 16,
        marginVertical: 4,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: 'rgba(0, 0, 0, 0.1)',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
        overflow: 'hidden',
    },
    line: {
        height: '100%',
        position: 'absolute',
        left: 0,
        borderTopLeftRadius: 8,
        borderBottomLeftRadius: 8,
    },
    textContainer: {
        flex: 1,
        paddingLeft: 12,
    },
    recordText: {
        fontSize: 16,
        lineHeight: 24,
        fontWeight: '500',
    },
});

export default RecordItem;
