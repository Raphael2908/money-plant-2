import * as SQLite from 'expo-sqlite';

async function setup(env) {
  if (env == "development"){
    const db = await SQLite.openDatabaseAsync('money-plant-database');
    await db.execAsync(`
      DROP TABLE IF EXISTS Settings;
      DROP TABLE IF EXISTS Budgets;
      CREATE TABLE IF NOT EXISTS Settings (id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL , name TEXT, appearance INTEGER); 
      INSERT INTO Settings (name, appearance) VALUES ('raphael', 'dark');
      CREATE TABLE IF NOT EXISTS Budgets (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT, budget_amt INTEGER, start_date TEXT, end_date TEXT, reset_frequency TEXT);
      INSERT INTO Budgets (name, budget_amt, start_date, end_date, reset_frequency) VALUES ('Monthly Budget', 40000, '2024-05-11', '2024-06-11', 'monthly');
    `)
    console.log( "Development database initialised")
  }
  else if (env == "production"){
    const db = await SQLite.openDatabaseAsync('money-plant-database');
    await db.execAsync(`
      CREATE TABLE IF NOT EXISTS Settings (id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL , name TEXT, appearance INTEGER); 
      CREATE TABLE IF NOT EXISTS Budgets (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT, budget_amt INTEGER, start_date TEXT, end_date TEXT, reset_frequency TEXT);
    `)
    console.log( "Production database initialised")
  }
  else {
    throw new Error("Database Environment invalid")
  }
}

export default setup