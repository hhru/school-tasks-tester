import java.util.Scanner;

public class Main {
    private static int size, width, height;
    private static double efficiency;
    private static int left, right, top, bottom;

    private static void findRegion(int[][] dataMap, boolean[][]visited, int x, int y) {
        if (visited[y][x]) {
            return;
        }
        visited[y][x] = true;
        left = Math.min(left, x);
        right = Math.max(right, x);
        top = Math.min(top, y);
        bottom = Math.max(bottom, y);
        
        if (x > 0 && dataMap[y][x - 1] == 1) {
            findRegion(dataMap, visited, x - 1, y);
        }
        
        if (width - x > 1 && dataMap[y][x + 1] == 1) {
            findRegion(dataMap, visited, x + 1, y);
        }
        
        if (y > 0 && dataMap[y - 1][x] == 1) {
            findRegion(dataMap, visited, x, y - 1);
        }
        
        if (height - y > 1 && dataMap[y + 1][x] == 1) {
            findRegion(dataMap, visited, x, y + 1);
        }

        if (x > 0 && y > 0 && dataMap[y - 1][x - 1] == 1) {
            findRegion(dataMap, visited,x - 1, y - 1);
        }
        
        if (width - x > 1 && y > 0 && dataMap[y - 1][x + 1] == 1) {
            findRegion(dataMap, visited, x + 1, y - 1);
        }
        
        if (x > 0 && height - y > 1 && dataMap[y + 1][x - 1] == 1) {
            findRegion(dataMap,visited, x - 1, y + 1);
        }
        
        if (width - x > 1 && height - y > 1 && dataMap[y + 1][x + 1] == 1) {
            findRegion(dataMap, visited, x + 1, y + 1);
        }

    }

    private static void initValues() {
        left = width - 1;
        right = 0;
        bottom = 0;
        top = height - 1;
    }

    private static int getGoodSpotsCount(int[][] dataMap) {
        int sum = 0;

        for (int i = top; i <= bottom; ++i) {
            for (int j = left; j <= right; ++j) {
                if (dataMap[i][j] == 1) {
                    ++sum;
                }
            }
        }
        return sum;
    }

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        width = sc.nextInt();
        height = sc.nextInt();

        int[][] dataMap = new int[height][width];
        boolean[][] visited = new boolean[height][width];

        for (int i = 0; i < height; ++i) {
            for (int j = 0; j < width; ++j) {
                dataMap[i][j] = sc.nextInt();
            }
        }

        for (int y = 0; y < height; ++y) {
            for (int x = 0; x < width; ++x) {
                if (dataMap[y][x] == 1 && !visited[y][x]) {
                    initValues();
                    findRegion(dataMap, visited, x, y);
                    int tmpArea = (right - left + 1) * (bottom - top + 1);
                    int goodSpotsCount = getGoodSpotsCount(dataMap);
                    double tmpEfficiency = (double) goodSpotsCount / tmpArea;

                    if (goodSpotsCount > 1 && tmpEfficiency > efficiency
                            || goodSpotsCount > 0 && tmpEfficiency == efficiency && tmpArea > size) {
                        size = tmpArea;
                        efficiency = tmpEfficiency;
                    }
                }
            }
        }
        
        System.out.println(size);
        sc.close();
    }
}
