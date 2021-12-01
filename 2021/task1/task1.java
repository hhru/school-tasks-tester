import java.util.Arrays;
import java.util.Scanner;
import java.util.stream.IntStream;

public class Main {

    public static void main(String[] args) {
        Scanner in = new Scanner(System.in);
        int n = in.nextInt();
        int m = in.nextInt();
        int[] c = new int[n];
        IntStream.range(0, n).forEach(i -> c[i] = in.nextInt());
        Arrays.sort(c);
        if (m <= n) {
            System.out.println(c[n-m]);
            return;
        }

        int allMoney = Arrays.stream(c).sum();
        if (allMoney < m) {
            System.out.println(0);
            return;
        }

        int maxResult = allMoney / m;
        int a = 1;
        int b = maxResult;
        int result = (a+b) / 2;
        int currentManagerCount = 0;
        while (true) {
            currentManagerCount = 0;
            for(int i =0;i <n;i++) {
                currentManagerCount += c[i] / result;
            }
            if (currentManagerCount < m) {
                b = result;
                result = (a+b)/2;
            } else if (b-a<=1) {
                break;
            } else {
                a = result;
                result = (a+b)/2;
            }

        }

        currentManagerCount = 0;
        for(int i =0;i <n;i++) {
            currentManagerCount += c[i] / (result+1);
        }
        if (currentManagerCount >=m) {
            result++;
        }

        System.out.println(result);
    }
}
