namespace api.Models;

public class NewsPost 
{
    public string? Id { get; set; }
    public DateOnly? PostDate {  get; set; }
    public string? Title { get; set; }
    public string? Content { get; set; }

}
