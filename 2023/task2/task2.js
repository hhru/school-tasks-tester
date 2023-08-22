const readline = require('readline').createInterface(process.stdin, process.stdout);

let linesCount = 0;
let height, width;
let startX, startY;
let endX, endY;
let map = [];

const solve = () => {
    const visitedDistance = { [`${startX},${startY}`]: 0 }
    const next = [[startX, startY, 0]];

    const tryMove = (x, y, distance) => {
        //console.log({ a: 'try', x, y, distance });
        if (x < 0 || x >= width || y < 0 || y >= height) {
            return;
        }

        if (map[y][x] === 1) {
            return;
        }

        if (visitedDistance[`${x},${y}`] !== undefined && visitedDistance[`${x},${y}`] <= distance) {
            return;
        }

        // console.log({ a: 'add', x, y, distance, v: visited[`${x},${y}`] });
        visitedDistance[`${x},${y}`] = distance;
        next.push([x, y, distance]);
    }

    while (next.length > 0) {
        const [x, y, distance] = next.shift();

        // if (x === endX && y === endY) {
        //     break;
        // }

        // console.log({ x, y, distance, l: next.length });

        tryMove(x - 1, y, distance + 1);
        tryMove(x + 1, y, distance + 1);
        tryMove(x, y - 1, distance + 1);
        tryMove(x, y + 1, distance + 1);

        // if (next.length === 0) {
        //     console.log({ x, y, distance })
        // }
    }
    // console.log({ visited, endX, endY });


    return visitedDistance[`${endX},${endY}`] !== undefined ? visitedDistance[`${endX},${endY}`] : 0;
}

readline.on('line', (line) => {
    if (linesCount === 0) {
        [height, width] = line.split(' ').map(item => Number(item));
    }
    if (linesCount === 1) {
        [startX, startY] = line.split(' ').map(item => Number(item));
    }
    if (linesCount === 2) {
        [endX, endY] = line.split(' ').map(item => Number(item));
    }

    if (linesCount > 2) {
        map[linesCount-3] = line.split(' ').map(item => Number(item));
    }

    if (linesCount++ >= height + 2) {
        console.log(solve());
        readline.close();
    }
}).on('close', () => process.exit(0));
