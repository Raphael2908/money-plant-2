import db from './db';

// Reset Settings Table
function resetSettingsTable() {
    const Command = `DROP TABLE IF EXISTS Settings;`;
    db.transaction(
        tx => {
          tx.executeSql(
            Command,
            [], 
            (txObj, resultSet) => {
              console.log("Settings table dropped!", resultSet)
            },
            (txObj, error) => {
              console.log(error)
            }
          );
        }
      );
}

// Reset Budget Table
function resetBudgetTable() {
    const Command = `DROP TABLE IF EXISTS Budgets;`;
    db.transaction(
        tx => {
          tx.executeSql(
            Command,
            [], 
            (txObj, resultSet) => {
              console.log("Budget table dropped!", resultSet)
            },
            (txObj, error) => {
              console.log(error)
            }
          );
        }
      );
}

export default resetDatabase = () => {
    resetSettingsTable()
    resetBudgetTable()
}

  
  