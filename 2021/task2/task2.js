const readline = require('readline').createInterface(process.stdin, process.stdout);

const TokenKind = { Value: "Value", Operator: "Operator", Brace: "Brace" };
const OPS = ["+", "-", "*", ">"];
const BRACES = ["(", ")"];
const LEFT = 0;
const RIGHT = 1;

function dieWrapper(operation, a, b) {
    if (Array.isArray(a) && Array.isArray(b)) {
        const res = Array(a.length * b.length);
        for (let i = 0; i < a.length; i++) {
            for (let j = 0; j < b.length; j++) {
                res[i * b.length + j] = operation(a[i], b[j]);
            }
        }
        return res;
    }
    if (Array.isArray(a)) {
        return a.map(a => operation(a, b[0]));
    }
    if (Array.isArray(b)) {
        return b.map(b => operation(a[0], b));
    }
    return [operation(a[0], b[0])];
}

const Operator = {
    "+": {
        op: (a, b) => dieWrapper((a, b) => a + b, a, b),
        precedence: 2,
        sym: "+"
    },
    "-": {
        op: (a, b) => dieWrapper((a, b) => a - b, a, b),
        precedence: 2,
        sym: "-"
    },
    "*": {
        op: (a, b) => dieWrapper((a, b) => a * b, a, b),
        precedence: 3,
        sym: "*"
    },
    ">": {
        op: (a, b) => dieWrapper((a, b) => a > b ? 1 : 0, a, b),
        precedence: 1,
        sym: ">"
    },
};

class ValueToken {
    constructor(value) {
        this.kind = TokenKind.Value;
        this.isDie = false;
        this.toString = () => {
            return `${this.isDie ? 'd[' : ''}${this.value}${this.isDie ? ']' : ''}`;
        };
        if (Array.isArray(value)) {
            this.value = value;
            return;
        }
        if (value.startsWith('d')) {
            const max = parseInt(value.slice(1));
            this.value = [...Array(max).keys()].map(e => e + 1);
            this.isDie = true;
            return;
        }
        this.value = [parseInt(value, 10)];
    }
}

class OpToken {
    constructor(value) {
        this.kind = TokenKind.Operator;
        this.value = Operator[value];
    }
    toString() {
        return this.value.sym;
    }
}

class BraceToken {
    constructor(value) {
        this.kind = TokenKind.Brace;
        this.value = value;
    }
    toString() {
        return "BRACE" + this.value;
    }
}

function _pp(tokens) {
    return tokens.map(t => t.toString());
}

function includes(coll, el) {
    return coll.includes(el);
}

function tip(arr) {
    if (!arr.length)
        return undefined;
    return arr[arr.length - 1];
}

function* tokenize(expr) {
    let accum = "";
    for (let part of expr) {
        if (includes(BRACES, part) || includes(OPS, part)) {
            if (accum.length > 0) {
                yield new ValueToken(accum);
                accum = "";
            }
        }
        if (includes(BRACES, part)) {
            yield new BraceToken(part);
            continue;
        }
        if (includes(OPS, part)) {
            yield new OpToken(part);
            continue;
        }
        accum += part;
    }
    if (accum.length > 0) {
        yield new ValueToken(accum);
    }
    return undefined;
}

function translateToRPN(expr) {
    const outputQueue = [];
    const opsStack = [];
    // Shunting-yard algorithm
    for (let token of tokenize(expr)) {
        switch (token.kind) {
            case TokenKind.Value: {
                outputQueue.push(token);
                break;
            }
            case TokenKind.Operator: {
                while (true) {
                    const opsTip = tip(opsStack);
                    if (!opsTip) {
                        break;
                    }
                    if (opsTip.kind === TokenKind.Brace && includes(BRACES, opsTip.value)) {
                        break;
                    }
                    if (opsTip.kind === TokenKind.Operator &&
                        opsTip.value.precedence >= token.value.precedence) {
                        outputQueue.push(opsStack.pop());
                        continue;
                    }
                    break;
                }
                opsStack.push(token);
                break;
            }
            case TokenKind.Brace: {
                if (token.value === BRACES[LEFT]) {
                    opsStack.push(token);
                }
                if (token.value === BRACES[RIGHT]) {
                    while (true) {
                        const opsTip = tip(opsStack);
                        if (!opsTip) {
                            throw Error("Missmatched braces");
                        }
                        if (opsTip.kind === TokenKind.Brace && opsTip.value === BRACES[LEFT]) {
                            break;
                        }
                        outputQueue.push(opsStack.pop());
                    }
                    opsStack.pop();
                }
                break;
            }
            default: {
                throw Error("Unknown token kind: " + token.kind);
            }
        }
    }
    if (opsStack.length) {
        return outputQueue.concat(opsStack.reverse());
    }
    return outputQueue;
}
function evaluateRPNExpression(tokens) {
    const stack = [];
    for (let t of tokens) {
        if (t.kind === TokenKind.Operator) {
            const b = stack.pop(), a = stack.pop();
            if (a === undefined || b === undefined || a.kind !== TokenKind.Value || b.kind !== TokenKind.Value) {
                throw new Error("Bad RPN expression");
            }
            stack.push(new ValueToken(t.value.op(a.value, b.value)));
        }
        else {
            stack.push(t);
        }
    }
    return stack[0].value;
}

function countValues(results) {
    const buckets = new Map();
    for (let k of results) {
        buckets.set(k, (buckets.get(k) || 0) + 1);
    }
    return { buckets, total: results.length };
}

function printDistribution(values) {
    for (let k of [...values.buckets.keys()].sort((a, b) => a - b)) {
        console.log(k, ((values.buckets.get(k) || 0) / values.total * 100).toFixed(2));
    }
}

readline.on('line', (line) => {
    printDistribution(countValues(evaluateRPNExpression(translateToRPN(line))));
    readline.close();

    process.exit();
})
