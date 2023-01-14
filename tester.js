const child_process = require('child_process');
const fs = require('fs');
const readline = require('readline');

if (!fs.existsSync('./config.json')) {
    throw new Error('Сначала запустите yarn configure');
}

const config = require('./config.json');

const language_to_exec_mapping = {
    js: config.node,
    py: config.python,
    java: {
        runner: config.java,
        compiler: config.javac,
    },
};

const log_green = (message) => console.log('\033[32m' + message + '\033[0m');
const log_red = (message) => console.log('\033[31m' + message + '\033[0m');

const possibleLangs = Object.keys(language_to_exec_mapping);

const argsToFilter = ['--big', '--run'];
const isBig = process.argv.includes('--big');
const isJustRun = process.argv.includes('--run');
const filteredArgs = process.argv.filter((item, index) => index > 1 && !argsToFilter.includes(item));

const task = filteredArgs[0];
const lang = filteredArgs[1];

if (!task) {
    throw new Error('Первым параметром нужно передать номер задания');
}

if (!possibleLangs.includes(lang)) {
    throw new Error(`Вторым параметром нужно передать язык (${possibleLangs.join(', ')})`);
}

const taskSuffix = filteredArgs.length > 2 && filteredArgs[2] ? filteredArgs[2] : '';

const solutionFile = `${config.year}/task${task}/task${task}${taskSuffix ? `_${taskSuffix}` : ''}.${lang}`;
const testsFile = `${config.year}/task${task}/tests.txt`;

const compileCode = () => {
    return new Promise((resolve, reject) => {
        fs.copyFileSync(solutionFile, 'Main.java');
        const child = child_process.spawn(language_to_exec_mapping[lang].compiler, ['Main.java']);

        child.on('exit', (code, signal) => {
            if (code !== 0 || signal !== null) {
                reject(`Solution compile exit code is ${code}, signal id ${signal}`);
                return;
            }
            resolve();
        });

        child.stdout.pipe(process.stdout);
        child.stderr.pipe(process.stderr);
    });
}

const cleanUp = () => {
    const exec = language_to_exec_mapping[lang];

    if (exec.compiler) {
        fs.unlinkSync('Main.java');
        fs.unlinkSync('Main.class');
    }
}

const prepareRunner = async () => {
    const exec = language_to_exec_mapping[lang];

    if (exec.compiler) {
        console.log('Compiling...');

        await compileCode();
        return {
            executable: exec.runner,
            solution: 'Main',
        }
    }

    return {
        executable: exec,
        solution: solutionFile,
    }
};


const testSolution = (inputLines, outputLines, runner) => {
    return new Promise(async (resolve, reject) => {
        let startTime = new Date();
        const child = child_process.spawn(runner.executable, [runner.solution], { shell: true });
        let resultLines = [];

        child.stderr.pipe(process.stderr);

        child.on('exit', (code, signal) => {
            const runningTime = new Date() - startTime;
            if (code !== 0 || signal !== null) {
                reject(`Solution exit code is ${code}, signal id ${signal}`);
                return;
            }

            if (inputLines && JSON.stringify(resultLines) !== JSON.stringify(outputLines)) {
                log_red(`Expected:\n${outputLines.join('\n')}`);
                log_red(`Received:\n${resultLines.join('\n')}`);
                reject({runningTime});
                return;
            }

            log_green(`Ok, duration ${runningTime}ms`)
            resolve();
        });

        if (inputLines) {
            child.stdout.on('data', (data) => {
                resultLines.push(...data.toString().trim().split('\n'));
            });

            for (const line of inputLines) {
                child.stdin.cork();
                child.stdin.write(line + '\n');
                child.stdin.uncork();
            }
            child.stdin.end();
        } else {
            child.stdout.pipe(process.stdout);
            process.stdin.pipe(child.stdin);

            process.stdin.on('data', () => {
                startTime = new Date();
            });
        }
    });
};

const processTests = async () => {
    const runner = await prepareRunner();

    const fileStream = fs.createReadStream(testsFile);

    const rl = readline.createInterface({
        input: fileStream,
        crlfDelay: Infinity
    });

    let waitingForAnswer = false;
    let inputLines = [];
    let outputLines = [];
    let currentLine = 0;
    let testsCount = 0;
    let failuresCount = 0;


    for await (const line of rl) {
        currentLine++;
        if (line === '') {
            waitingForAnswer = true;
            continue;
        }

        if (line === '##') {
            try {
                console.log('test', inputLines);
                testsCount += 1;
                await testSolution(inputLines, outputLines, runner);
            } catch (e) {
                if (!e.runningTime) {
                    throw e;
                }
                const lineNum = currentLine - inputLines.length - outputLines.length - 1;
                log_red(`Test failed at ${testsFile}:${lineNum}, duration ${e.runningTime}ms`);
                failuresCount += 1;
            } finally {
                inputLines = [];
                outputLines = [];
            }

            waitingForAnswer = false;
            continue;
        }

        if (!waitingForAnswer) {
            inputLines.push(line);
        } else {
            outputLines.push(line);
        }
    }

    if (failuresCount) {
        log_red(`${failuresCount} of ${testsCount} tests failed. See above messages for details`)
    } else {
        log_green(`${testsCount} tests finished successfully`)
    }

    cleanUp();
}

const processBigTest = async () => {
    const runner = await prepareRunner();

    const inputLines = fs.readFileSync(`${config.year}/task${task}/bigtest.txt`)
        .toString('utf-8')
        .split('\n')
        .filter(item => !!item);
    const outputLines = fs.readFileSync(`${config.year}/task${task}/biganswer.txt`)
        .toString('utf-8')
        .split('\n')
        .filter(item => !!item);

    console.log('Running bigtest.txt');
    try {
        await testSolution(inputLines, outputLines, runner);
    } catch (e) {
        if (!e.runningTime) {
            throw e;
        }
        log_red(`Big test failed, duration ${e.runningTime}ms`);
    }

    cleanUp();
};

if (isJustRun) {
    testSolution();
} else if (isBig) {
    processBigTest();
} else {
    processTests();
}

