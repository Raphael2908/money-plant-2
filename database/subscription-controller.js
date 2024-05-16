export default class SubscriptionController {
    _db;

    constructor(database) {
        this._db = database // Must be SQLite open Database
    }

    getSubscriptions = async () => {
        try {
            const result = await this._db.getAllAsync('SELECT * FROM Subscriptions');
            return result
        } catch (error) {
            throw new Error("Error while getting subscriptions: ", error)
        }
    }
    addSubscription = async (name) => {
        if (name == '' || name == undefined || name == null) {
          validationError = {
            error: "Name must not be null"  
          }
          return validationError
        }
        const createSubscriptionStatement = await this._db.prepareAsync(
            `INSERT INTO Subscriptions (name) VALUES ($name);`
        );
        try{
            await createSubscriptionStatement.executeAsync({
              $name: name,
            })
            const result = await this._db.getAllAsync('SELECT * FROM Subscriptions');
            return result
          }
          catch(error){
            throw new Error(error)
          }
          finally{
            await createSubscriptionStatement.finalizeAsync();
            console.log("Subscription added")
          }
    }  
    
}