import java.util.Random;


public class WeatherGenerator {
    public static void main(String[] args) {
        Random random = new Random();

        int high = random.nextInt(61) + 50;
        int drop = random.nextInt(16) + 20;
        int low = high - drop;

        System.out.println("Today's high: " + high + "°F");
        System.out.println("Today's low: " + low + "°F");
    }
}

console.log(high)
