N, M = [int(x) for x in input().split()]  # Читаем N и M в первой строке
C = [int(input()) for _ in range(N)]  # Читаем Cn в последующих строках


def solve(M, C):
    max_amount = sum(C) // M  # максимум - средняя сумма на менеджера
    # // - оператор деления с округлением в меньшую сторону до целого

    if max_amount == 0:  # если она равна 0 – можно выйти сразу
        return 0

    rounded_middle = 1
    min_amount = 1  # начинаем с 1, потому что 0 уже не может быть
    transactions = M

    # Бинарный поиск, второе условие компенсирует перебор
    while max_amount - min_amount >= 0.5 or transactions < M:
        # пробуем сумму между максимальным и минимальным
        middle = (min_amount + max_amount) / 2
        rounded_middle = round(middle)

        # вычисляем количество транзакций (целых премий) с такой суммой
        transactions = sum([x // rounded_middle for x in C if x >= rounded_middle])
        if transactions < M:
            max_amount = middle  # сужаем сверху при недоборе
        else:
            min_amount = middle  # сужаем снизу при переборе

    return rounded_middle

print(solve(M, C))