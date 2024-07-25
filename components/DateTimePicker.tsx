import React from 'react';
import RNDateTimePicker, {
    DateTimePickerEvent,
} from '@react-native-community/datetimepicker';

interface DateTimePickerProps {
    showPicker: 'defaultTime' | 'intervalTime' | null;
    date: Date;
    onChange: (event: DateTimePickerEvent, selectedDate?: Date) => void;
}

const DateTimePicker: React.FC<DateTimePickerProps> = ({
    showPicker,
    date,
    onChange,
}) => {
    if (!showPicker) return null;

    return (
        <RNDateTimePicker
            display="default"
            mode="time"
            value={date}
            onChange={onChange}
            locale="pt-BR"
            is24Hour={true}
        />
    );
};

export default DateTimePicker;
