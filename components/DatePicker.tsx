import React from 'react';
import RNDateTimePicker, {
    DateTimePickerEvent,
} from '@react-native-community/datetimepicker';

interface DatePickerProps {
    showPicker: boolean;
    date: Date | undefined;
    onChange: (event: DateTimePickerEvent, selectedDate?: Date) => void;
}

const DatePicker: React.FC<DatePickerProps> = ({
    showPicker,
    date,
    onChange,
}) => {
    if (!showPicker) return null;

    return (
        <RNDateTimePicker
            value={date || new Date()}
            mode="date"
            display="default"
            onChange={onChange}
        />
    );
};

export default DatePicker;
