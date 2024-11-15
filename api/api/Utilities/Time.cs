namespace api.Utilities;

public static class Time
{
    public static DateTime UtcToSaskTime(DateTime time)
    {
        return time.AddHours(-6);
    }
}
