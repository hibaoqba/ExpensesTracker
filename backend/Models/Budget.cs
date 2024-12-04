namespace ExpenseTrackerAPI.Models
{
    public class Budget
    {
        public int Id { get; set; }
        public decimal MonthlyBudget { get; set; }
        public decimal TotalSpent { get; set; }
        public DateTime Month { get; set; }

        public int UserId { get; set; }


    }
}
