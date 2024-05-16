export default class BudgetController {
    _db;

    constructor(database) {
        this._db = database // Must be SQLite open Database
    }

    getBudgets = async () => {
        try {
            const result = await this._db.getAllAsync('SELECT * FROM Budgets');
            return result
        } catch (error) {
            throw new Error("Error while getting budgets: ", error)
        }
    }

    addNewBudget = async (name, budget_amt, start_date, end_date, reset_frequency) => {
        const createBudgetStatement = await this._db.prepareAsync(
          `INSERT INTO Budgets (name, budget_amt, start_date, end_date, reset_frequency) VALUES ($name, $budget_amt, $start_date, $end_date, $reset_frequency);`
        );
        try{
          await createBudgetStatement.executeAsync({
            $name: name,
            $budget_amt: budget_amt,
            $start_date: start_date,
            $end_date: end_date,
            $reset_frequency: reset_frequency
          })
          const result = await this._db.getAllAsync('SELECT * FROM Budgets');
          return result
        }
        catch(error){
          throw new Error(error)
        }
        finally{
          await createBudgetStatement.finalizeAsync();
          console.log("budget added")
        }
      }  
}