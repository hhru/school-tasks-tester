import java.util.Scanner;

public class Main {

  public static void main(String[] args) {
    Scanner in = new Scanner(System.in);
    String dates = in.nextLine();
    String[] arrayDates = dates.split(" ");
    int n = Integer.parseInt(arrayDates[0]), m = Integer.parseInt(arrayDates[1]), s = Integer.parseInt(arrayDates[2]);
    int maxCount = Math.max(n, m);
    int bestResumeCount, resumeCountA = 0, resumeCountB = 0;
    String[] a = new String[maxCount];
    String[] b = new String[maxCount];
    int resultA = s, resultB = s, sumA = 0;

    for (int i = 0; i < maxCount; i++) {
      String str = in.nextLine();
      String[] numbers = str.split(" ");
      a[i] = numbers[0];
      b[i] = numbers[1];

      if ((!a[i].equals("-")) && (Integer.parseInt(a[i]) <= resultA) && resumeCountA == i) {
        resumeCountA += 1;
        resultA -= Integer.parseInt(a[i]);
        sumA += Integer.parseInt(a[i]);
      }

      if ((!b[i].equals("-")) && (Integer.parseInt(b[i]) <= resultB) && resumeCountB == i) {
        resumeCountB += 1;
        resultB -= Integer.parseInt(b[i]);
      }

    }
    bestResumeCount = Math.max(resumeCountA, resumeCountB);

    for (int i = resumeCountA - 1; i >= 0 ; i--){
      if (i != resumeCountA - 1) sumA -= Integer.parseInt(a[i + 1]);
      int result = s - sumA;
      int steps = i + 1, y = 0;

      while (y < resumeCountB && result >= Integer.parseInt(b[y])){
        result -= Integer.parseInt(b[y]);
        steps += 1;
        y += 1;
      }

      bestResumeCount = Math.max(bestResumeCount, steps);
    }

    System.out.println(bestResumeCount);
  }

}
