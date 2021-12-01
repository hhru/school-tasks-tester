import sys
from enum import Enum, auto
from typing import NamedTuple, Any, List


class TokenType(Enum):
    NUMBER = auto()
    DICE_RESULT = auto()
    PLUS = auto()
    MINUS = auto()
    PROD = auto()
    COMPARE = auto()
    SKOBKA_START = auto()
    SKOBKA_END = auto()


class Token(NamedTuple):
    token_type: TokenType
    value: int = None


class Node(NamedTuple):
    token: Token
    children: List[Any] = None


class Lexer:
    _DIGIT_CHARS = set(str(s) for s in range(10))

    _DICE_RESULT_START = 'd'

    _OPERATIONS_CHARS = {
        '+': TokenType.PLUS,
        '-': TokenType.MINUS,
        '*': TokenType.PROD,
        '>': TokenType.COMPARE,
        '(': TokenType.SKOBKA_START,
        ')': TokenType.SKOBKA_END
    }

    def __init__(self, input_string: str):
        if not input_string:
            raise RuntimeError('empty or None input string not supported')
        self.chars_sequence = (char for char in input_string)
        self.current_char = None

    def _next_char(self):
        self.current_char = next(self.chars_sequence, None)
        return self.current_char

    def _read_number(self, first_symbol=''):
        result = first_symbol
        while True:
            self._next_char()
            if self.current_char is None or self.current_char not in Lexer._DIGIT_CHARS:
                break
            result += self.current_char
        return int(result)

    def tokens(self):
        self._next_char()
        while self.current_char:
            if self.current_char in (' ', '\r', '\n'):
                self._next_char()
                continue
            if self.current_char in Lexer._OPERATIONS_CHARS:
                yield Token(token_type=Lexer._OPERATIONS_CHARS[self.current_char])
                self._next_char()
            elif self.current_char in Lexer._DIGIT_CHARS:
                yield Token(token_type=TokenType.NUMBER, value=self._read_number(self.current_char))
            elif self.current_char == Lexer._DICE_RESULT_START:
                yield Token(token_type=TokenType.DICE_RESULT)
                self._next_char()
            else:
                raise RuntimeError(f'unexpected char {self.current_char}')


class Parser:

    def __init__(self, input_string: str):
        self.tokens_seq = (token for token in Lexer(input_string).tokens())
        self.current_token = None

    def _next_token(self):
        self.current_token = next(self.tokens_seq, None)
        return self.current_token

    def _can_continue_parsing(self, *token_types_to_continue):
        return self.current_token is not None and self.current_token.token_type in token_types_to_continue

    def _check_and_skip_current_token(self, expected_type: TokenType):
        if not self.current_token:
            raise RuntimeError(f'unexpected end of tokens')

        if self.current_token.token_type != expected_type:
            raise RuntimeError(f'unexpected token {self.current_token}')

        self._next_token()

    def parse(self) -> Node:
        return self._parse_compare()

    def _parse_compare(self, left_node=None) -> Node:
        if left_node:
            left_token = self.current_token

        first_sum = self._parse_sum()

        if left_node:
            node = Node(left_token, [left_node, first_sum])
        else:
            node = first_sum

        if not self._can_continue_parsing(TokenType.COMPARE):
            return node
        return self._parse_compare(node)

    def _parse_sum(self) -> Node:
        first_prod = self._parse_prod()
        if not self._can_continue_parsing(TokenType.PLUS, TokenType.MINUS):
            return first_prod
        return Node(self.current_token, [first_prod, self._parse_sum()])

    def _parse_prod(self) -> Node:
        first_term = self._parse_term()
        if not self._can_continue_parsing(TokenType.PROD):
            return first_term
        return Node(self.current_token, [first_term, self._parse_prod()])

    def _parse_term(self) -> Node:
        token = self._next_token()
        if token.token_type == TokenType.NUMBER:
            self._next_token()
            return Node(token)

        if token.token_type == TokenType.DICE_RESULT:
            return Node(token, [self._parse_term()])

        if token.token_type == TokenType.SKOBKA_START:
            expression = self._parse_compare()
            self._check_and_skip_current_token(TokenType.SKOBKA_END)
            return expression

        raise RuntimeError(f'unexpected token {token}')


class Evaluator:
    _OPERATIONS_MAPPING = {
        TokenType.PLUS: lambda a, b: a + b,
        TokenType.MINUS: lambda a, b: a - b,
        TokenType.PROD: lambda a, b: a * b,
        TokenType.COMPARE: lambda a, b: 1 if a > b else 0
    }

    def __init__(self, node: Node):
        self.node = node

    def evaluate_result_counters(self):
        return self._evaluate_recursively(self.node)

    def _evaluate_recursively(self, node) -> dict:
        if node.token.token_type == TokenType.NUMBER:
            return {node.token.value: 1}

        if node.token.token_type == TokenType.DICE_RESULT:
            possible_results = self._evaluate_recursively(node.children[0])
            result = {}
            for value, count in possible_results.items():
                if value <= 0:
                    continue
                for d in range(value):
                    result[d + 1] = result.get(d + 1, 0) + count
            return result

        if len(node.children) != 2:
            raise RuntimeError(f'Unexpected node {node}')

        left, right = self._evaluate_recursively(node.children[0]), self._evaluate_recursively(node.children[1])
        result = {}
        operation_function = Evaluator._OPERATIONS_MAPPING[node.token.token_type]
        for left_value, left_count in left.items():
            for right_value, right_count in right.items():
                result_value = operation_function(left_value, right_value)
                result[result_value] = result.get(result_value, 0) + left_count * right_count
        return result

# Evaluates expressions like '(d7>3) + 5 + d8 * (4 - d2)'
# where dX - possible dice throw result
# prints possibilities of each result

if __name__ == '__main__':
    expression_string = input()
    print(expression_string, file=sys.stderr, flush=True)
    root_node = Parser(expression_string).parse()
    counters = Evaluator(root_node).evaluate_result_counters()
    total_possible_results = sum(counters.values())
    for result, counters in sorted(counters.items(), key=lambda pair: pair[0]):
        possibility = counters / total_possible_results * 100
        print(result, f'{possibility:.2f}')
