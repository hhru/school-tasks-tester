const readline = require('readline').createInterface(process.stdin, process.stdout);

let width = null;
let height = null;
const map = [];
const queue = [];
let linesCount = 0;
let nextRegionIndex = 0;
const regions = [];

const getRegionArea = (region) => (region.maxX - region.minX + 1) * (region.maxY - region.minY + 1);
const getRegionValue = (region) => {
    let goodSpots = 0;

    for (let x = region.minX; x <= region.maxX; x++) {
        for (let y = region.minY; y <= region.maxY; y++) {
            goodSpots += map[y][x].value;
        }
    }

    return goodSpots;
}

const checkNeighbours = (centerX, centerY, point) => {
    for (let x = centerX - 1; x <= centerX + 1; x++) {
        if (x < 0 || x >= width) {
            continue;
        }
        for (let y = centerY - 1; y <= centerY + 1; y++) {
            if (y < 0 || y >= height) {
                continue;
            }

            if (map[y][x].value) {
                map[y][x].region = point.region;
                queue.unshift({ x, y })
            }
        }
    }
}

const getBestRegionSize = () => {
    while (queue.length > 0) {
        const candidate = queue[0];
        let currentX = candidate.x;
        let currentY = candidate.y;
        const point = map[currentY][currentX];

        if (point.region === null) {
            point.region = nextRegionIndex;
            regions.push({ minX: currentX, maxX: currentX, minY: currentY, maxY: currentY });
            nextRegionIndex += 1;
        }
        let region = regions[point.region];

        if (point.visited) {
            queue.shift();
            continue;
        }

        point.visited = true;

        if (point.value) {
            region.minX = Math.min(currentX, region.minX);
            region.maxX = Math.max(currentX, region.maxX);
            region.minY = Math.min(currentY, region.minY);
            region.maxY = Math.max(currentY, region.maxY);
            checkNeighbours(currentX, currentY, point);
        }
    }

    const resultRegions = regions
        .filter(item => getRegionArea(item) > 1)
        .map(region => ({
            value: getRegionValue(region),
            area: getRegionArea(region),
        }))
        .sort((a, b) => {
            const valueDiff = (b.value / b.area) - (a.value / a.area);
            return valueDiff === 0 ? b.area - a.area : valueDiff;
        });

    return resultRegions.length > 0 ? resultRegions[0].area : 0;
};

readline.on('line', (line) => {
    if (linesCount === 0) {
        [width, height] = line.split(' ').map(item => Number(item));
    } else {

        map.push(line.split(' ').map((item, index) => {
            if (item === '1') {
                queue.push({ x: index, y: linesCount - 1 })
            }
            return {
                value: Number(item),
                visited: false,
                region: null,
            }
        }));

    }
    if (linesCount++ === height) {
        console.log(getBestRegionSize());
        readline.close();
    }
}).on('close', () => process.exit(0));
