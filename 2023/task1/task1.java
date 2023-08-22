import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner in = new Scanner(System.in);
        int N = in.nextInt(); // количество мест
        int M = in.nextInt(); // количество часов
        int[] C = new int[N]; // количество печенек

        int start = 0;
        int end = 0;

        for (int i = 0; i < N; i++) {
            C[i] = in.nextInt();
            end = Math.max(C[i], end);
        }
        getMinimalAmountToEat(C, M, start, end);
    }

    private static void getMinimalAmountToEat(int[] cookiesAmount, int hours, int start, int end) {
        while (start < end) {
            int middle = (start + end) / 2;
            if (isEatable(middle, cookiesAmount, hours)) {
                end = middle;
            } else {
                start = middle + 1;
            }
        }
        if (isEatable(start, cookiesAmount, hours)) {
            System.out.println(start);
        } else {
            System.out.println(0);
        }
    }

    private static boolean isEatable(int perHour, int[] cookiesAmount, int hours) {
        if (perHour == 0) {
            return false;
        }
        int timeToEat = 0;
        for (int amount : cookiesAmount) {
            timeToEat += (amount + perHour - 1) / perHour;
        }
        return timeToEat <= hours;
    }

}
