import { useSQLiteContext } from 'expo-sqlite';
import { useState, useCallback } from 'react';

export type Config = {
    id: number;
    horapadrao: Date;
    intervalopadrao: Date;
    diasdasemana: string[];
};

export function useConfigTable() {
    const database = useSQLiteContext();
    const [notifyChange, setNotifyChange] = useState<() => void>(
        () => () => {}
    );

    const setNotificationCallback = useCallback((callback: () => void) => {
        setNotifyChange(() => callback);
    }, []);

    async function create(data: Omit<Config, 'id'>) {
        const statement = await database.prepareAsync(
            'INSERT INTO config (horapadrao, intervalopadrao, diasdasemana) VALUES (?, ?, ?)'
        );

        try {
            const result = await statement.executeAsync([
                data.horapadrao.toISOString(),
                data.intervalopadrao.toISOString(),
                data.diasdasemana.join(','),
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

    async function update(data: Config) {
        const { id, horapadrao, intervalopadrao, diasdasemana } = data;

        const statement = await database.prepareAsync(
            'UPDATE config SET horapadrao = ?, intervalopadrao = ?, diasdasemana = ? WHERE id = ?'
        );

        try {
            await statement.executeAsync([
                horapadrao.toISOString(),
                intervalopadrao.toISOString(),
                diasdasemana.join(','),
                id,
            ]);

            notifyChange();

            console.log('Configuração atualizada com sucesso!');
        } catch (error) {
            console.error('Erro ao atualizar configuração:', error);
            throw error;
        } finally {
            await statement.finalizeAsync();
        }
    }

    async function show(id: number) {
        try {
            const query = 'SELECT * FROM config WHERE id = ?';
            const response = await database.getFirstAsync<any>(query, [id]);

            if (response) {
                return {
                    ...response,
                    horapadrao: new Date(response.horapadrao),
                    intervalopadrao: new Date(response.intervalopadrao),
                    diasdasemana: response.diasdasemana.split(','),
                };
            }

            return null;
        } catch (error) {
            console.error('Erro ao buscar registro:', error);
            throw error;
        }
    }

    async function clearDatabase() {
        const statement = await database.prepareAsync('DELETE FROM config');

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

    return { create, update, show, setNotificationCallback, clearDatabase };
}
