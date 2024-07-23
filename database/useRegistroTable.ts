import { useSQLiteContext } from 'expo-sqlite';
import { useState, useCallback } from 'react';

export type Registro = {
    id: number;
    data: Date;
};

export function useRegistroTable() {
    const database = useSQLiteContext();
    const [notifyChange, setNotifyChange] = useState<() => void>(
        () => () => {}
    );

    const setNotificationCallback = useCallback((callback: () => void) => {
        setNotifyChange(() => callback);
    }, []);

    async function create(data: Omit<Registro, 'id'>) {
        const statement = await database.prepareAsync(
            'INSERT INTO registro (data) VALUES (?)'
        );

        try {
            const result = await statement.executeAsync([
                data.data.toISOString(),
            ]);

            const insertedRowId = result.lastInsertRowId;

            notifyChange();

            return { insertedRowId };
        } catch (error) {
            throw error;
        } finally {
            await statement.finalizeAsync();
        }
    }

    async function show() {
        try {
            const query = 'SELECT * FROM registro';
            const response = await database.getAllAsync<any[]>(query); // Usando getAllAsync para obter todos os registros

            if (response && response.length > 0) {
                return response.map((record) => ({
                    id: record.id,
                    data: new Date(record.data),
                }));
            }

            return [];
        } catch (error) {
            console.error('Erro ao buscar registros:', error);
            throw error;
        }
    }

    return { create, show, setNotificationCallback };
}
