def two_stacks(max_sum, a, b):
    a = list(reversed(a))
    b = list(reversed(b))
    total_sum = 0
    len_a = len(a)
    len_b = len(b)

    selected_numbers = []
    # берем все элементы из первого стека пока не превысим лимит
    for _ in range(len_a):
        value = a.pop()
        if total_sum + value > max_sum:
            break
        total_sum += value
        selected_numbers.append(value)

    # будем заменять по одному из второго стека
    max_count = len(selected_numbers)
    current_count = max_count
    while len_b:
        if total_sum + b[-1] <= max_sum:
            total_sum += b.pop()
            len_b -= 1
            current_count += 1
            if current_count > max_count:
                max_count = current_count
            continue
        if not len(selected_numbers):
            break
        value_from_first_stack = selected_numbers.pop()
        total_sum -= value_from_first_stack
        current_count -= 1
    return max_count


if __name__ == '__main__':
    task_input = input().rstrip().split(' ')
    n = int(task_input[0])
    m = int(task_input[1])
    max_sum = int(task_input[2])
    a = []
    b = []

    for i in range(max(n, m)):
        [ai, bi] = input().rstrip().split(' ')
        if ai.isnumeric():
            a.append(int(ai))
        if bi.isnumeric():
            b.append(int(bi))

    result = two_stacks(max_sum, a, b)

    print(str(result))
