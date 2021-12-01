const readline = require('readline').createInterface(process.stdin, process.stdout);

let accountsCount = null;
let managersCount = null;
const accountsList = [];
let totalAmount = 0;
let linesCount = 0;

const getTransactionsCount = (amount) => {
    return accountsList.filter(item => item >= amount).reduce((acc, item) => acc + Math.floor(item / amount), 0);
}

const solve = () => {
    accountsList.sort().reverse();

    if (totalAmount < managersCount) {
        return 0;
    }

    let minAmount = Math.floor(accountsList[0] / managersCount);
    let maxAmount = Math.floor(totalAmount / managersCount);
    let transactions = 0;
    let steps = 0;
    let midPoint = 0;

    while (true) {
        midPoint = (minAmount + maxAmount) / 2;
        transactions = getTransactionsCount(Math.round(midPoint));
        if (Math.abs(minAmount - maxAmount) <= 0.5 && transactions >= managersCount) {
            break;
        }

        if (transactions >= managersCount) {
            minAmount = midPoint
        } else {
            maxAmount = midPoint
        }
        steps++;
    }

    return Math.round(midPoint);
};

readline.on('line', (line) => {
    if (linesCount === 0) {
        [accountsCount, managersCount] = line.split(' ').map(item => Number(item));
    } else {
        totalAmount += Number(line);
        accountsList.push(Number(line));
    }
    if (linesCount++ === accountsCount) {
        console.log(solve());
        readline.close();
    }
}).on('close', () => process.exit(0));
