from collections import deque


# Функция для проверки, является ли ячейка внутри лабиринта и доступной
def is_valid(x, y, N, M, maze):
    if 0 <= x < M and 0 <= y < N:
        return maze[y][x] == 0
    else:
        return False


def shortest_path_length(N, M, x1, y1, x2, y2, maze):
    queue = deque([(x1, y1, 0)])  # Каждый элемент очереди - кортеж (x, y, расстояние)

    visited = [[False] * N for _ in range(M)]
    visited[x1][y1] = True

    # Возможные направления движения (вверх, вниз, влево, вправо)
    directions = [(-1, 0), (1, 0), (0, -1), (0, 1)]

    while queue:
        x, y, distance = queue.popleft()

        if x == x2 and y == y2:
            return distance

        for dx, dy in directions:
            new_x, new_y = x + dx, y + dy
            if is_valid(new_x, new_y, N, M, maze) and not visited[new_x][new_y]:
                queue.append((new_x, new_y, distance + 1))
                visited[new_x][new_y] = True

    return 0


N, M = map(int, input().split())
x1, y1 = map(int, input().split())
x2, y2 = map(int, input().split())

maze = []
for _ in range(N):
    row = list(map(int, input().split()))
    maze.append(row)

result = shortest_path_length(N, M, x1, y1, x2, y2, maze)
print(result)
