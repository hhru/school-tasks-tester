const readline = require('readline').createInterface(process.stdin, process.stdout);

let linesCount = 0;
let placeCount = 0;
let hours;
let cookiesAmounts = [];

function check(cookiesAmounts, middle, H) {
    let time = 0;
    for (let i = 0; i < cookiesAmounts.length; i++) {
        time += Math.ceil(cookiesAmounts[i] / middle);
    }

    return time <= H;
}

function solve() {
    if (cookiesAmounts.filter(item => item > 0).length > hours) {
        return 0;
    }

    let start = 1;

    let end = [...cookiesAmounts].sort((a, b) => b - a)[0];

    while (start < end) {
        let middle = start + Math.floor((end - start) / 2);

        if (check(cookiesAmounts, middle, hours)) {
            end = middle;
        } else {
            start = middle + 1;
        }
    }

    return end;
}


readline.on('line', (line) => {
    if (linesCount === 0) {
        [placeCount, hours] = line.split(' ').map(item => Number(item));
    }

    if (linesCount > 0) {
        cookiesAmounts[linesCount-1] = Number(line)
    }

    if (linesCount++ >= placeCount) {
        console.log(solve());
        readline.close();
    }
}).on('close', () => process.exit(0));
