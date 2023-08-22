import math

# Проверяем, можно ли успеть съесть все печеньки с выбранным количеством
def can_be_eaten(cookies_amounts, per_hour, hours):
    time_to_eat = 0
    for amount in cookies_amounts:
        time_to_eat += math.ceil(amount / per_hour)

    return time_to_eat <= hours


def get_minimal_amount_to_eat(cookies_amounts, hours):
    # Если количество мест с печеньками больше количества часов - Фёдор точно не успеет
    if len(list(filter(lambda amount: amount > 0, cookies_amounts))) > hours:
        return 0

    start = 1
    end = max(cookies_amounts)

    while start < end:
        # Приближаемся к точному значению через бинарный поиск
        middle = start + math.floor((end - start) / 2)

        if can_be_eaten(cookies_amounts, middle, hours):
            end = middle
        else:
            start = middle + 1

    return end


if __name__ == '__main__':
    N, M = [int(x) for x in input().split()]  # Читаем N и M в первой строке
    C = [int(input()) for _ in range(N)]  # Читаем Cn в последующих строках

    print(get_minimal_amount_to_eat(C, M))
