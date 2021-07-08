/* Html Elements */
const transactionsUl = document.querySelector('#transactions');
const incomeDisplay = document.querySelector('#money-plus');
const expenseDisplay = document.querySelector('#money-minus');
const balanceDisplay = document.querySelector('#balance');
const form = document.querySelector('#form');
const inputTransactionName = document.querySelector('#text');
const inputTransactionAmount = document.querySelector('#amount');
const spanErrorName = document.querySelector('#tx-name');
const spanErrorAmount = document.querySelector('#tx-amount');

/* Variables */
const localStorageTransactions = JSON.parse(localStorage.getItem('transactions'));

let transactions = localStorage.getItem('transactions') !== null? localStorageTransactions : [];


/* Functions */
const generateId = () => Math.round(Math.random() * 1000);

const updateLocalStorage = () => {
    localStorage.setItem('transactions', JSON.stringify(transactions));
}

const addTransactionIntoDOM = transaction => {
    const operator = transaction.amount < 0? '-': '+';
    const cssClass = transaction.amount < 0? 'minus': 'plus';
    const amountWithoutOperator = Math.abs(transaction.amount);
    const li = document.createElement('li');
    
    li.classList.add(cssClass);
    li.innerHTML = 
    `${transaction.name} 
    <span>${operator}$ ${amountWithoutOperator}</span>
    <button class="delete-btn" onClick="removeTransaction(${transaction.id})">x</button>`;
    
    transactionsUl.prepend(li);
}

const removeTransaction = id => {
    transactions = transactions.filter(transaction => transaction.id !== id);
    updateLocalStorage();
    init();
}


/* Getters */
const getTransactionsAmounts = () => transactions
    .map(transaction => transaction.amount);

const getTotal = transactionsAmounts => transactionsAmounts
    .reduce((accumulator, transaction) => accumulator + transaction, 0).toFixed(2);

const getIncome = transactionsAmounts => transactionsAmounts
    .filter(amount => amount > 0)
    .reduce((acc, amount) => acc + amount, 0).toFixed(2);

const getExpense = transactionsAmounts => Math.abs(transactionsAmounts
    .filter(amount => amount < 0)
    .reduce((acc, amount) => acc + amount, 0).toFixed(2));


const updateBalanceValues = () => {
    const transactionsAmounts = getTransactionsAmounts();
    const total = getTotal(transactionsAmounts);
    const income = getIncome(transactionsAmounts);
    const expense = getExpense(transactionsAmounts);

    balanceDisplay.textContent = `R$ ${total}`;
    incomeDisplay.textContent = `R$ ${income}`;
    expenseDisplay.textContent = `R$ ${expense}`;
}

const validateInputs = event => {
    spanErrorName.innerHTML = '';
    spanErrorAmount.innerHTML = '';
    const message = "Este campo precisa ser preenchido";
    
    if(inputTransactionName.value.trim() === '') {
        spanErrorName.innerHTML = message;
        return true;
    }

    if(inputTransactionAmount.value == 0) {
        spanErrorAmount.innerHTML += message;
        return true;
    }

    return false;
}

const addToTransactionsIntoArray = (transactionName, transactionAmount) => {
    const transaction  = { id: generateId(), name: transactionName, amount: Number(transactionAmount) };
    transactions.push(transaction);
}

const clearInputs = () => {
    inputTransactionName.value = '';
    inputTransactionAmount.value = '';
}

const handleFormSubmit = event => {
    event.preventDefault();

    if(validateInputs(event)) return;
    
    const transactionName = inputTransactionName.value.trim();
    const transactionAmount = inputTransactionAmount.value.trim();

    addToTransactionsIntoArray(transactionName, transactionAmount);
    init();
    updateLocalStorage();
    clearInputs();
}


const init = () => {
    transactionsUl.innerHTML = '';
    transactions.forEach(addTransactionIntoDOM);
    updateBalanceValues();
}

init()

form.addEventListener('submit', handleFormSubmit);