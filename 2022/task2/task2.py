n, m = map(int, input().split())
data_map = [[0] * (n + 2)]
for _ in range(m):
    data_map.append([0] + list(map(int, input().split())) + [0])
data_map.append([0] * (n + 2))

good_spots = set()
for i in range(m + 2):
    for j in range(n + 2):
        if data_map[i][j] == 1:
            good_spots.add((i, j))

regions = []
while good_spots:
    region_spots = [good_spots.pop()]
    max_x = 1
    max_y = 1
    min_x = m + 2
    min_y = m + 2
    while region_spots:
        x, y = region_spots.pop(-1)
        max_x = max(max_x, x)
        min_x = min(min_x, x)
        max_y = max(max_y, y)
        min_y = min(min_y, y)

        for step_x, step_y in ((-1, -1), (-1, 0), (-1, +1), (0, 1), (1, 1), (1, 0), (1, -1), (0, -1)):
            new_x = x + step_x
            new_y = y + step_y
            if (new_x, new_y) in good_spots:
                region_spots.append((new_x, new_y))
                good_spots.remove((new_x, new_y))

    regions.append((min_x, min_y, max_x, max_y))

efficiency = 0
best_region_area = 0

for x1, y1, x2, y2 in regions:
    region_area = (x2 - x1 + 1) * (y2 - y1 + 1)
    region_good_spots_count = 0
    for row in range(x1, x2 + 1):
        region_good_spots_count += sum(data_map[row][y1:y2 + 1])

    if region_good_spots_count > 1:
        efficiency_temp = region_good_spots_count / region_area
        if efficiency_temp > efficiency:
            efficiency = efficiency_temp
            best_region_area = region_area
        elif efficiency_temp == efficiency:
            if region_area > best_region_area:
                efficiency = efficiency_temp
                best_region_area = region_area

print(best_region_area)
