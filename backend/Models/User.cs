using System.ComponentModel.DataAnnotations;
using System.Collections.Generic;
namespace ExpenseTrackerAPI.Models
{
    public class User
    {
        public int Id { get; set; }

        [Required]
        public string Username { get; set; }

        [Required]
        public string PasswordHash { get; set; }

        public string Email { get; set; }
        public string FullName { get; set; }
        public ICollection<Budget> Budgets { get; set; }
        public ICollection<Expense> Expenses { get; set; }
    }
}

