export default class SubscriptionItemController {
    _db;

    constructor(database) {
        this._db = database // Must be SQLite open Database
    }

    getSubscriptionItems = async (subscription_id) => {
        return {
            whereIdEquals: async (subscription_id) => {
                const result = await this._db.getAllAsync(`SELECT * FROM Subscription_items WHERE subscription_id = ${subscription_id}`);
                return result
            },
            all: async () => {
                try {
                    const result = await this._db.getAllAsync('SELECT * FROM Subscription_items');
                    return result
                } catch (error) {
                    throw new Error("Error while getting subscription_items: ", error)
                }
            }
        }
    }
    addSubscriptionItem = async (name, price, color, start_date, reset_type, reset_interval, subscription_id) => {
      let validationError = {error: true}
      if (name == '' || name == undefined || name == null) {
        validationError.nameError = "Name must not be null"
      }
      if (price == '' || price == undefined || price == null) {
        validationError.priceError = "Price must not be null"
      }
      if (subscription_id == '' || subscription_id == undefined || subscription_id == null) {
        validationError.subscription_idError = "Subscription Id type must not be null, if it is, contact developer"
      }
      if (price == '' || price == undefined || price == null) {
        validationError.priceError = "Price must not be null"
      }
      if (reset_interval == '' || reset_interval == undefined || reset_interval == null) {
        validationError.reset_intervalError = "reset interval must not be null"
      }

      if (Object.keys(validationError).length > 1){
        return validationError
      }


      const createSubscriptionItemStatement = await this._db.prepareAsync(`
        INSERT INTO Subscription_items (name, price, color, start_date, next_billing_date, reset_type, reset_interval, subscription_id) 
        VALUES ($name, $price, $color, $start_date, $next_billing_date, $reset_type, $reset_interval, $subscription_id);
      `);
      
      // reset type logic 
      // Calculate next billing date given a start date and the reset typer
      let temp_start_date = new Date(start_date)
      let next_billing_date = ""

      switch (reset_type) {
        case 'daily':
          // calculate next billing datet
          // Add the days to the given date
          temp_start_date.setDate(temp_start_date.getDate() + parseInt(reset_interval))           
          // Format the new date back to 'YYYY-MM-DD'
          next_billing_date = temp_start_date.toISOString().split('T')[0];
          break;
        
        case 'monthly':
          // calculate next billing from start date and becare ful of days that some months don't have like 29 feb
          // charge on the same date of every month, otherwise, end of the month
          // Get current year, month, and day
          let year = temp_start_date.getFullYear();
          let month = temp_start_date.getMonth();
          let day = temp_start_date.getDate();

          // Increment the month
          let nextMonth = month + 1;

          // Set reset_interval to next month
          reset_interval = nextMonth

          // Adjust the year if month overflows to the next year
          if (nextMonth > 11) {
              nextMonth = 0;  // Reset to January
              year += 1;
          }

          // Create a new date for the first day of the next month
          let nextMonthDate = new Date(year, nextMonth, 1);

          // Calculate the last day of the next month
          let lastDayOfNextMonth = new Date(year, nextMonth + 1, 0).getDate();

          // Ensure the day is within the valid range of the next month
          if (day > lastDayOfNextMonth) {
              day = lastDayOfNextMonth;
          }
          
          // Set the date to the adjusted day
          nextMonthDate.setDate(day);

          // Add back time difference between UTC and Singapore
          nextMonthDate = new Date(nextMonthDate.getTime() - nextMonthDate.getTimezoneOffset() * 60000) // 8 hrs converted to milliseconds

          next_billing_date = nextMonthDate.toISOString().split('T')[0];
          break;

        default:
          throw new Error("Something messed up in subscription item controller bruh")
      }
      // Add data to database
      try{
        await createSubscriptionItemStatement.executeAsync({
          $name: name,
          $price: price,
          $color: color, 
          $start_date: start_date, 
          $next_billing_date: next_billing_date,
          $reset_type: reset_type, 
          $reset_interval: reset_interval, 
          $subscription_id: subscription_id
        })
        const result = await this._db.getAllAsync('SELECT * FROM Subscription_items');
        return result
      }
      catch(error){
        throw new Error(error)
      }
      finally{
        await createSubscriptionItemStatement.finalizeAsync();
        console.log("Subscription item added")
      }
    }     
}