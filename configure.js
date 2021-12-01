const fs = require('fs');
const readline = require('readline').createInterface(process.stdin, process.stdout);

const config = fs.existsSync('./config.json') ? require('./config.json') : {};

const steps = [
    { title: 'Введите год набора', name: 'year' },
    { title: 'Введите путь к node 12', name: 'node' },
    { title: 'Введите путь к python 3.8', name: 'python' },
    { title: 'Введите путь к java 13', name: 'java' },
];

let currentStep = 0;
console.log(`${steps[0].title} (${config[steps[0].name]}):`);
readline.on('line', (line) => {
    const stepName = steps[currentStep].name;
    config[stepName] = line || config[stepName];
    currentStep++;

    if (currentStep >= steps.length) {
        console.log('New config', config);
        fs.writeFileSync('./config.json', JSON.stringify(config, null, 2))
        readline.close();

        return;
    }
    console.log(`${steps[currentStep].title} (${config[steps[currentStep].name]}):`);
});