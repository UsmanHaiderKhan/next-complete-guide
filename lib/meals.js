import sql from 'better-sqlite3';
const db = sql('meals.db');

export async function getAllMeals() {
    await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate a 1 second delay
    const stmt = db.prepare('SELECT * FROM meals ORDER BY id DESC');
    return stmt.all();
}
