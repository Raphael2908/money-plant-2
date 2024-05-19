import * as SQLite from 'expo-sqlite';

async function setup(env) {
  if (env == "development"){
    const db = await SQLite.openDatabaseAsync('money-plant-database');
    await db.execAsync(`
      DROP TABLE IF EXISTS Settings;
      DROP TABLE IF EXISTS Budgets;
      DROP TABLE IF EXISTS Subscriptions;
      DROP TABLE IF EXISTS Subscription_items;

      CREATE TABLE IF NOT EXISTS Settings (id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL , name TEXT, appearance INTEGER); 
      INSERT INTO Settings (name, appearance) VALUES ('raphael', 'dark');

      CREATE TABLE IF NOT EXISTS Budgets (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT, budget_amt INTEGER, start_date TEXT, end_date TEXT, reset_frequency TEXT);
      INSERT INTO Budgets (name, budget_amt, start_date, end_date, reset_frequency) VALUES ('Monthly Budget', 40000, '2024-05-11', '2024-06-11', 'monthly');
      
      CREATE TABLE IF NOT EXISTS Subscriptions (id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL , name TEXT); 
      INSERT INTO Subscriptions (name) VALUES ('Entertainment Subscriptions');

      CREATE TABLE IF NOT EXISTS Subscription_items (
        id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL, subscription_id INT, 
        name TEXT, price INTEGER, color TEXT, start_date TEXT, next_billing_date TEXT, reset_type TEXT, reset_interval INTEGER, 
        FOREIGN KEY (subscription_id) REFERENCES Subscriptions(id)
        ON DELETE CASCADE
        ON UPDATE CASCADE
      ); 
      -- Start date has to be in YYYY-MM-DD
      INSERT INTO Subscription_items (name, price, color, start_date, next_billing_date, reset_type, reset_interval, subscription_id) VALUES ('Spotify', 1798, '52CA5E', '2024-05-08', '2024-06-08', 'Monthly', 8, 1); 
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