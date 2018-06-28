# ATM_Implementation

This implementation of an ATM offers the following features
1. Create a new bank account with a secure PIN
2. Enter account number and secure PIN to unlock access to bank account
3. Query, Withdraw, and Deposit into bank account from ATM machine
4. Withdraws are limited by a daily withdrawal limit

# Tech/framework used

This is written completely using vanilla NodeJS. A single readline library is required, but that is included in the NodeJS package.

The readline functionality is asynchronous so it's theoretically possible to scale this application so multiple people can be using the same ATM machine

# Coding Style

Two function factories are used to create ATM Objects and Bank Account Objects

Only one ATM Object is created, but you can add a few additional lines of code to create additional ATM Objects

Bank Account Objects should only be created through user input

I decided to opt to use function factories rather than the ES6 class syntax for better maintainability in the future.

# Instructions

Open a NodeJS Environment in same directory as the Javascript file and write out "node ATM_Implementation.js".

You will have to create a new account everytime you launch this application as it doesn't use a database.

Once the account is created, you will have to enter the account number (which is generated), along with your PIN (that you set) to access your bank account.

Once logged in, you can query, deposit, and withdraw from your bank account.

As with a normal ATM, anytime you type something incorrect or want to reset the prompt, you will have to relogin with your credentials.



