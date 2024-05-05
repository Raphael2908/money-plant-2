import db from './db';
import resetDatabase from './reset-db';

// Create Settings Table Schema
function createSettingsTable() {
    const SettingsTableSchema = `CREATE TABLE IF NOT EXISTS Settings (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT
    );`;
    db.transaction(
        tx => {
          tx.executeSql(
            SettingsTableSchema,
            [],
            (txObj, resultSet) => {
              console.log("Settings table created!")
            },
            (txObj, error) => {
              console.log(error)
            }
          );
        },
      );
}


function seedSettingsTable() {
  const Command = `INSERT INTO Settings (name) VALUES ('raphael')`;
  db.transaction(
      tx => {
        tx.executeSql(
          Command,
          [], 
          (txObj, resultSet) => {
            console.log("Settings table seeded:", resultSet)
          },
          (txObj, error) => {
            console.log("error:", error)
          }
        );
      },
    );
}

// Create Budget Table 
function createBudgetTable() {
    const BudgetTableSchema = `CREATE TABLE IF NOT EXISTS Budgets (
        Id INTEGER PRIMARY KEY AUTOINCREMENT,
        Name TEXT,
        BudgetAmt REAL,
        StartDate TEXT,
        EndDate TEXT,
        ResetFrequency TEXT
    );`
    db.transaction(
        tx => {
          tx.executeSql(
            BudgetTableSchema,
            [],
            (txObj, resultSet) => {
              console.log("Budget table created!")
            },
            (txObj, error) => {
              console.log(error)
            }
          );
        },
      );
}

// Function to set up the database
const setupDatabase = () => {
  resetDatabase()
  createSettingsTable()
  seedSettingsTable()
  createBudgetTable()
};

export default setupDatabase;
