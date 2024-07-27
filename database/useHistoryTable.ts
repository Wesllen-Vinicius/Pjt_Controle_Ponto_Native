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

    async function show(startDate?: Date, endDate?: Date): Promise<Registro[]> {
        if (!database) {
            throw new Error('Banco de dados não disponível.');
        }

        let whereClause = '';
        const queryParams: (string | number)[] = [];

        if (startDate) {
            whereClause += 'data >= ?';
            queryParams.push(startDate.toISOString());
        }
        if (endDate) {
            if (whereClause.length > 0) {
                whereClause += ' AND ';
            }
            whereClause += 'data <= ?';
            queryParams.push(endDate.toISOString());
        }

        const query = `SELECT * FROM registro${
            whereClause ? ` WHERE ${whereClause}` : ''
        } ORDER BY data DESC`;

        try {
            const response = (await database.getAllAsync(
                query,
                queryParams
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
