using ExpenseTrackerAPI.Models;
using Microsoft.EntityFrameworkCore;

namespace ExpenseTrackerAPI.Data
{
	public class ExpenseTrackerContext : DbContext
	{
		public ExpenseTrackerContext(DbContextOptions<ExpenseTrackerContext> options) : base(options) { }

		public DbSet<Expense> Expenses { get; set; }
		public DbSet<User> Users { get; set; }
        public DbSet<Budget> Budgets { get; set; }
    }
}