const Promise = require('bluebird');
const models = require('../../loading/loading');
const Stripe = require('stripe');
const stripe = new Stripe(process.env.STRIPE_KEY);


module.exports = Promise.method(function userBankAccount(userParameters) {
  return models.User
    .findOne(
      {
        where: { id: userParameters.id }
      }
    )
    .then((data) => {
      if(data.dataValues.account_id) {
        return stripe.accounts.listExternalAccounts(data.dataValues.account_id, {object: "bank_account"}).then((bank_accounts) => {
          if(bank_accounts.data.length) {
             return bank_accounts.data[0];
          }
          return false;
        });

      }
    })
});
