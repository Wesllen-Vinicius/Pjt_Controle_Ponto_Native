import { useSQLiteContext } from 'expo-sqlite';
import { useState, useCallback } from 'react';

export type Registro = {
    id: number;
    data: Date;
};

interface DatabaseRegistro {
    id: number;
    data: string;
}

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

    async function show(): Promise<Registro[]> {
        try {
            const query = `SELECT * FROM registro  ORDER BY data ASC`;
            const response = (await database.getAllAsync(
                query
            )) as unknown as DatabaseRegistro[];

            if (Array.isArray(response) && response.length > 0) {
                return response.map((record) => {
                    if ('id' in record && 'data' in record) {
                        return {
                            id: record.id,
                            data: new Date(record.data),
                        } as Registro;
                    } else {
                        throw new Error('Registro com formato inválido.');
                    }
                });
            }

            return [];
        } catch (error) {
            console.error('Erro ao buscar registros:', error);
            throw error;
        }
    }

    return { create, show, setNotificationCallback };
}
