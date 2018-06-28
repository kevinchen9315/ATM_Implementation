//Enables NodeJS to read from command line
const readline = require('readline');
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

//Global variables that's used to create new bank accounts
//Definitely not a good idea to use a global variable
//But I didn't want to create a "Bank" object for the scope of this project
const bankAccounts = [];
let accountNumberAssignment = 1000000;

const createAccount = (atmLocation) => {
	rl.question('Enter a PIN: ', (PIN) => {
		const newAccount = accountFactory(PIN.toString());
		bankAccounts.push(newAccount);
		console.log('Your account number is ' + newAccount.accountNumber);
		console.log('Your daily withdrawal limit is $' + newAccount.dailyWithdrawLimit)
		atmLocation.anotherTransaction();
	})
}

const findAccount = (accountNumber) => {
	for(account of bankAccounts){
		if(parseInt(accountNumber) === account.accountNumber){
			return account;
		}
	}
	return false;
}



//Personal account function factory
const accountFactory = (accountPIN) => {
	const accountNumber = accountNumberAssignment++;
	let accountValue = 0;

	const withdrawalDates = {};
	const dailyWithdrawLimit = 500;




	//Use traditional function declaration to bind this
	function deposit(value){
		this.accountValue += value;
	}

	function withdraw(value){
		if (this.accountValue - value < 0){
			console.log("You don't have enough money in your account")
		} else {
			const today = new Date();
			const dateString = (today.getMonth()+1)+"-"+today.getDate()+"-"+today.getFullYear();
			
			let withdrawToday = this.withdrawalDates[dateString] || 0;
			
			//Checks to see if customer has hit their daily withdrawal limit
			if(withdrawToday + value > this.dailyWithdrawLimit){
				console.log("Your daily withdrawal limit is $" + this.dailyWithdrawLimit)
				console.log("Today, you have already withdrew $" + withdrawToday)
			} else {
				this.accountValue-=value;
				this.withdrawalDates[dateString] = withdrawToday + value;
			}		
		}
	}

	return {
		accountValue,
		accountNumber,		
		accountPIN,
		deposit,
		withdraw,
		withdrawalDates,
		dailyWithdrawLimit
	}
}

//ATM function factory to create ATM objects
const atmFactory = (location) => {

	//When a customer arrives at the ATM
	function customerArrived(){
		console.log('Welcome to ATM: ' + location)

		rl.question('Enter your account number or type "new" to create a new account: ', (response) => {
			//Creates a new account
			if(response === 'new'){
				createAccount(this);
			} 
			else if(response===''){
				this.anotherTransaction();
			}
			else {
				const accountFound = findAccount(response);
				if(accountFound){
					this.verifyPIN(accountFound);
				} else {
					console.log('Account "' + response + '" not found');
					this.anotherTransaction();
				}
			}			
		})
	}

	function verifyPIN(account){
		rl.question('Enter your PIN: ', (PIN) => {
			if(account.accountPIN === PIN.toString()){
				this.homeScreen(account)
			}
			else {
				console.log('Invalid PIN')
				this.anotherTransaction();
			}
		})
	}

	function homeScreen(account){
		console.log('[QUERY]   [DEPOSIT]   [WITHDRAW]')
		rl.question('What would you like to do: ', (response) => {
			response = response.toUpperCase();
			if(response === 'QUERY'){
				console.log('You have $' + account.accountValue + ' in your account.')
				this.anotherTransaction();
			}
			else if(response === 'DEPOSIT'){
				this.deposit(account);
			}
			else if(response === 'WITHDRAW'){
				this.withdraw(account);
			}
			else{
				console.log('Invalid Selection')
				this.anotherTransaction();
			}
		})
	}

	function deposit(account){
		rl.question('How much would you like to deposit: ', (response) => {
			if(isNaN(response)){
				console.log('Invalid Entry');
				this.anotherTransaction();
			} else {
				account.deposit(parseInt(response))
				console.log('Your new balance is $' + account.accountValue)
				this.anotherTransaction();
			}
		})
	}

	function withdraw(account){
		rl.question('How much would you like to withdraw: ', (response) => {
			if(isNaN(response)){
				console.log('Invalid Entry');
				this.anotherTransaction();
			} else {
				account.withdraw(parseInt(response))
				console.log('Your current balance is $' + account.accountValue)
				this.anotherTransaction();
			}
		})
	}

	//Ask the customer if they want to perform a new transaction
	function anotherTransaction(){
		rl.question('Type "Y" if you would like to perform another transaction: ', (answer) => {
			if(answer.toUpperCase()==='Y'){
				console.log('------------------------------------------------------')
				this.customerArrived();
			} else {
				console.log('Good Bye!')
				rl.close();

			}
		})
	}

	return {
		location,
		customerArrived,
		verifyPIN,
		homeScreen,
		deposit,
		withdraw,
		anotherTransaction
	}
}

//Creates a new ATM object
const atmAustin = atmFactory('Austin');

atmAustin.customerArrived();



