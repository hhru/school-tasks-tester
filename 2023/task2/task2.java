import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.io.IOException;
import java.util.LinkedList;
import java.util.Queue;
import java.util.StringTokenizer;

public class Main {

    public static void main(String[] args) throws IOException {
        BufferedReader br = new BufferedReader(new InputStreamReader(System.in));
        StringTokenizer st = new StringTokenizer(br.readLine());

        short N = Short.parseShort(st.nextToken());
        short M = Short.parseShort(st.nextToken());

        st = new StringTokenizer(br.readLine());
        short x1 = Short.parseShort(st.nextToken());
        short y1 = Short.parseShort(st.nextToken());

        st = new StringTokenizer(br.readLine());
        short x2 = Short.parseShort(st.nextToken());
        short y2 = Short.parseShort(st.nextToken());

        short[][] maze = new short[N][M];

        for (short i = 0; i < N; i++) {
            st = new StringTokenizer(br.readLine());
            for (short j = 0; j < M; j++) {
                maze[i][j] = Short.parseShort(st.nextToken());
            }
        }

        br.close();

        System.out.println(shortestPath(maze, y1, x1, y2, x2));
    }

    public static short shortestPath(short[][] maze, short x1, short y1, short x2, short y2) {
        short N = (short) maze.length;
        short M = (short) maze[0].length;

        Queue<Short> queue = new LinkedList<>();
        queue.add(x1);
        queue.add(y1);
        queue.add((short)0);

        maze[x1][y1] = 2; // Пометим точку входа, как посещённую

        while (!queue.isEmpty()) {
            short x = queue.poll();
            short y = queue.poll();
            short dist = queue.poll();

            if (x == x2 && y == y2) {
                return dist;
            }

            // Проверим соседние клетки
            if (x > 0 && maze[x-1][y] == 0) {
                queue.add((short)(x-1));
                queue.add(y);
                queue.add((short)(dist+1));
                maze[x-1][y] = 2;
            }
            if (x < N-1 && maze[x+1][y] == 0) {
                queue.add((short)(x+1));
                queue.add(y);
                queue.add((short)(dist+1));
                maze[x+1][y] = 2;
            }
            if (y > 0 && maze[x][y-1] == 0) {
                queue.add(x);
                queue.add((short)(y-1));
                queue.add((short)(dist+1));
                maze[x][y-1] = 2;
            }
            if (y < M-1 && maze[x][y+1] == 0) {
                queue.add(x);
                queue.add((short)(y+1));
                queue.add((short)(dist+1));
                maze[x][y+1] = 2;
            }
        }

        return 0; // Путь не найден
    }
}
