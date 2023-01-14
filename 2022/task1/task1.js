const readline = require('readline').createInterface(process.stdin, process.stdout);

let aSize = null;
let bSize = null;
let maxSum = 0;
let a = [];
let b = [];
let linesCount = 0;

function twoStacks(maxSum, a, b) {
    a.reverse();
    b.reverse();
    let totalSum = 0;
    let lenA = a.length;
    let lenB = b.length;

    let selectedNumbers = [];
    // берем все элементы из первого стека пока не превысим лимит
    for (const _ of [...Array(lenA)]) {
        const value = a.pop();
        if (totalSum + value > maxSum) {
            break;
        }
        totalSum += value;
        selectedNumbers.push(value);
    }

    // будем заменять по одному из второго стека
    let maxCount = selectedNumbers.length;
    let currentCount = maxCount;
    while (lenB > 0) {
        if (totalSum + b[lenB - 1] <= maxSum) {
            totalSum += b.pop();
            lenB -= 1;
            currentCount += 1;
            if (currentCount > maxCount) {
                maxCount = currentCount;
            }
            continue;
        }
        if (selectedNumbers.length === 0) {
            break;
        }
        const valueFromFirstStack = selectedNumbers.pop()
        totalSum -= valueFromFirstStack
        currentCount -= 1
    }

    return maxCount
}

readline.on('line', (line) => {
    if (linesCount === 0) {
        [aSize, bSize, maxSum] = line.split(' ').map(item => Number(item));
    } else {
        const [ai, bi] = line.split(' ');
        if (ai !== '-') {
            a.push(Number(ai));
        }

        if (bi !== '-') {
            b.push(Number(bi))
        }
    }
    if (linesCount++ === Math.max(aSize, bSize)) {
        console.log(twoStacks(maxSum, a, b));
        readline.close();
    }
}).on('close', () => process.exit(0));
