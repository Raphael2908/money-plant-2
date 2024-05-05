import db from "../db";

const getBudget = () => {
    // Return the list of budgets from the budgets table
    const Command = `SELECT * FROM Settings;`;

    db.transactionAsync(async tx => {
        const result = await tx.executeSqlAsync(Command, []);
        console.log('Count:', result);
    }, true);
}

export default getBudget