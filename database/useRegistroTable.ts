import { useSQLiteContext } from 'expo-sqlite';
import { useState, useCallback } from 'react';

// Atualizando o tipo Registro para incluir o campo tipo
export type Registro = {
    id: number;
    data: Date;
    tipo: 'entrada' | 'saida'; // Adiciona o tipo de ponto
};

interface DatabaseRegistro {
    id: number;
    data: string;
    tipo: string; // Tipo vem como string no banco de dados
}

// Atualiza o hook useRegistroTable
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
            'INSERT INTO registro (data, tipo) VALUES (?, ?)'
        );

        try {
            const result = await statement.executeAsync([
                data.data.toISOString(),
                data.tipo,
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
            const query = `SELECT * FROM registro ORDER BY data ASC`;
            const response = (await database.getAllAsync(
                query
            )) as unknown as DatabaseRegistro[];

            if (Array.isArray(response) && response.length > 0) {
                return response.map((record) => {
                    if (
                        'id' in record &&
                        'data' in record &&
                        'tipo' in record
                    ) {
                        return {
                            id: record.id,
                            data: new Date(record.data),
                            tipo: record.tipo as 'entrada' | 'saida', // Faz a conversão correta para o tipo
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

    async function clearDatabase() {
        const statement = await database.prepareAsync('DELETE FROM registro');

        try {
            await statement.executeAsync([]);
            notifyChange();
            console.log('Banco de dados limpo com sucesso.');
        } catch (error) {
            console.error('Erro ao limpar banco de dados:', error);
            throw error;
        } finally {
            await statement.finalizeAsync();
        }
    }

    return { create, show, setNotificationCallback, clearDatabase };
}
