import { useSQLiteContext } from 'expo-sqlite';

export type Registro = {
    id: number;
    data: Date;
};

interface DatabaseRegistro {
    id: number;
    data: string;
}

export function useHistoryTable() {
    const database = useSQLiteContext();

    async function show(): Promise<Registro[]> {
        if (!database) {
            throw new Error('Banco de dados não disponível.');
        }

        const query = `SELECT * FROM registro ORDER BY data ASC`;

        try {
            const response = (await database.getAllAsync(
                query
            )) as unknown as DatabaseRegistro[];

            console.log('Registros retornados:', response);

            if (Array.isArray(response) && response.length > 0) {
                return response.map((record) => {
                    if ('id' in record && 'data' in record) {
                        return {
                            id: record.id,
                            data: new Date(record.data),
                        } as Registro;
                    } else {
                        console.error('Registro com formato inválido:', record);
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

    return { show };
}
