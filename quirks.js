// This file exports an array of "quirks". Quirks are objects containing a name, id, and a pair of functions that
// serve as conditions and callbacks. Conditions return a bool, callbacks return a change object
// In our example we only have one quirk that returns random denominations if the the owed amount is divisible by 3.
// All quirk conditions and callbacks are functions that take in the transaction data as a parameter.
// The purpose of this set up is to have a structure that allows us to easily add and remove quirks and
// even persist them to a database

randomByDivisorFactory = require('./RandomByDivisorFactory');

module.exports = [
    {
        id: 1,
        name: "randomIfDivisibleByThree",
        condition: randomByDivisorFactory(3),
        callback: function(transaction) {

            const changeAsPennies = transaction.paid*100-transaction.owed*100;
            let remaining = changeAsPennies;

            let result = {
                quirkId: this.id,
                change: changeAsPennies/100,
                denominations: {}
            }

            // Because we're doing this randomly, we know the number of pennies will just be
            // however many cents are left at the end of the loop below so we can leave them out
            // here and calculate them at the end
            let denominations = {
                dollars: 100,
                quarters: 25,
                dimes: 10,
                nickles: 5
            }

            Object.keys(denominations).map(key => {
                // Calculate how many times this denomination could fit into remaining
                const limit = Math.floor(remaining/denominations[key])

                // Select a random number between 0 and the limit
                const count = Math.floor(Math.random() * (limit+1))
            
                // Store the denomination count and decrement our remaining change
                result.denominations[key] = count;
                remaining -= denominations[key]*count;
            })

            result.denominations.pennies = remaining;

            return result;

        }
    }
]