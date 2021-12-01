import java.io.IOException;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Deque;
import java.util.HashMap;
import java.util.LinkedList;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.util.Scanner;
import java.util.function.BiFunction;
import java.util.function.Function;
import java.util.stream.Collectors;
import java.util.stream.IntStream;

public class Main {
    private static final Double EPS = 0.0001;

    public static void main(String[] args) throws IOException {
        Scanner in = new Scanner(System.in);

        // Reading data using readLine
        String expr = in.nextLine();
        var result = evaluate(expr);
        result.keySet().stream()
                .sorted()
                .forEach(value -> {
                    System.out.println(value.toString() + ' ' + String.format(Locale.ROOT, "%.2f", result.get(value)).trim());
                });
    }

    private static void check(String message, boolean predicate) {
        if (!predicate) {
            throw new RuntimeException(message);
        }
    }

    private static Map<Integer, Double> evaluate(String expr) {
        List<Token> tokens = parse(expr);
        Deque<Map<Integer, Double>> operands = new LinkedList<>();
        Deque<TokenType> operations = new LinkedList<>();
        for (Token token : tokens) {
            if (token.type == TokenType.VALUE) {
                operands.push(convert(token.expr));
            } else if (token.type == TokenType.LPAR) {
                operations.push(TokenType.LPAR);
            } else if (token.type == TokenType.RPAR) {
                while(operations.peekFirst() != TokenType.LPAR) {
                    var valueB = operands.pop();
                    var valueA = operands.pop();
                    var operation = operations.pop();
                    operands.push(calcOperation(valueA, valueB, operation.function));
                }
                // pop left parenthesis
                operations.pop();

            } else {
                var lastOp = operations.peekFirst();
                while (lastOp != null && lastOp != TokenType.LPAR && lastOp.priority <= token.type.priority) {
                    var valueB = operands.pop();
                    var valueA = operands.pop();
                    var operation = operations.pop();
                    operands.push(calcOperation(valueA, valueB, operation.function));
                    lastOp = operations.peekFirst();
                }
                operations.push(token.type);
            }
        }
        return operands.pop();
    }

    public enum TokenType {

        LPAR("(", 0, null),
        RPAR(")", 0, null),
        MUL("*", 1, (a, b) -> a * b),
        ADD("+", 2, (a, b) -> a + b),
        SUB("-", 2, (a, b) -> a - b),
        COMP(">", 3, (a, b) -> a > b ? 1 : 0),
        VALUE("", -1, null);

        public final String op;
        public final int priority;
        public final BiFunction<Integer, Integer, Integer> function;

        TokenType(String op, int priority, BiFunction<Integer, Integer, Integer> function) {
            this.op = op;
            this.priority = priority;
            this.function = function;
        }

        public static TokenType fromString(String s) {
            return Arrays.stream(values()).filter(type -> type.op.equals(s)).findFirst().orElse(VALUE);
        }
    }

    static class Token {
        public String expr;
        public TokenType type;

        public Token(String expr, TokenType type) {
            this.expr = expr;
            this.type = type;
        }
    }

    private static List<Token> parse(String expression) {
        expression = "(" + expression.replaceAll("\\s", "") + ")";
        StringBuilder value = new StringBuilder();
        List<Token> scannedExpr = new ArrayList<>();
        for (char c : expression.toCharArray()) {
            TokenType type = TokenType.fromString(String.valueOf(c));
            if (!type.equals(TokenType.VALUE)) {
                if (value.length() > 0) {
                    //Add the full value TOKEN
                    Token st = new Token(value.toString(), TokenType.VALUE);
                    scannedExpr.add(st);
                }
                value = new StringBuilder(String.valueOf(c));
                Token st = new Token(value.toString(), type);
                scannedExpr.add(st);
                value = new StringBuilder();
            } else {
                value.append(c);
            }
        }
        return scannedExpr;
    }

    private static Map<Integer, Double> convert(String value) {
        if (value.charAt(0) == 'd') {
            int n = Integer.parseInt(value.substring(1));
            return IntStream.range(1, n + 1).boxed()
                    .collect(Collectors.toMap(Function.identity(), i -> 100d / n));
        } else {
            return Map.of(Integer.parseInt(value), 100d);
        }
    }

    private static Map<Integer, Double> calcOperation(Map<Integer, Double> distributionA,
                                                      Map<Integer, Double> distributionB,
                                                      BiFunction<Integer, Integer, Integer> operation) {
        Map<Integer, Double> probabilities = new HashMap<>();
        for (Integer valueA : distributionA.keySet()) {
            for (Integer valueB : distributionB.keySet()) {
                Integer result = operation.apply(valueA, valueB);
                Double probability = distributionA.get(valueA) * distributionB.get(valueB) / 100;
                if (probabilities.containsKey(result)) {
                    probabilities.put(result, probabilities.get(result) + probability);
                } else {
                    probabilities.put(result, probability);
                }
            }
        }
        return probabilities;
    }
}