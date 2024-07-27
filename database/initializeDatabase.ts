import { SQLiteDatabase } from 'expo-sqlite';

export async function initializeDatabase(database: SQLiteDatabase) {
    try {
        await database.execAsync(
            `CREATE TABLE IF NOT EXISTS registro (
                id INTEGER PRIMARY KEY AUTOINCREMENT, 
                data DATETIME NOT NULL
            );`
        );
        await database.execAsync(
            `CREATE TABLE IF NOT EXISTS config (
                id INTEGER PRIMARY KEY AUTOINCREMENT,  
                horapadrao DATETIME NOT NULL, 
                intervalopadrao DATETIME NOT NULL, 
                diasdasemana VARCHAR(255)
            );`
        );
    } catch (error) {
        console.error('Erro ao inicializar o banco de dados:', error);
        throw error;
    }
}
