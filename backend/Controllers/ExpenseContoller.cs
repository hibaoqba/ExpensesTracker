using ExpenseTrackerAPI.Data;
using ExpenseTrackerAPI.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;

namespace ExpenseTrackerAPI.Controllers
{
	[ApiController]
	[Route("api/[controller]")]
	public class ExpenseController : ControllerBase
	{
		private readonly ExpenseTrackerContext _context;

		public ExpenseController(ExpenseTrackerContext context)
		{
			_context = context;
		}
        private int GetUserIdFromToken()
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier); // Get the user ID from the JWT token
            if (string.IsNullOrEmpty(userId))
            {
                throw new UnauthorizedAccessException("User is not authenticated.");
            }
            return int.Parse(userId); // Parse the user ID from the token
        }

        [HttpGet]
		public async Task<ActionResult<IEnumerable<Expense>>> GetExpenses()
		{
			return await _context.Expenses.ToListAsync();
		}

        [HttpPost]
        public async Task<ActionResult<Expense>> AddExpense(Expense expense)
        {
            var userId = GetUserIdFromToken(); // Get the user ID from the JWT token
            expense.UserId = userId; // Associate the expense with the logged-in user

            _context.Expenses.Add(expense);
            await _context.SaveChangesAsync();
            return CreatedAtAction(nameof(GetExpenses), new { id = expense.Id }, expense);
        }




        [HttpDelete("{id}")]
		public async Task<IActionResult> DeleteExpense(int id)
		{
			var expense = await _context.Expenses.FindAsync(id);
			if (expense == null) return NotFound();

			_context.Expenses.Remove(expense);
			await _context.SaveChangesAsync();
			return NoContent();
		}


        [HttpGet("monthly-expenses")]
        public async Task<IActionResult> GetMonthlyExpenses()
        {
            var startDate = DateTime.Now.AddMonths(-12); 
            var expenses = await _context.Expenses
                .Where(e => e.Date >= startDate) 
                .ToListAsync();

            var groupedExpenses = expenses
                .GroupBy(e => new { e.Date.Year, e.Date.Month }) 
                .Select(g => new
                {
                    Year = g.Key.Year,
                    Month = g.Key.Month,
                    Expenses = g.Select(e => new
                    {
                        e.Id,
                        e.Description,
                        e.Amount,
                        e.Category,
                        e.Date
                    }).ToList()
                })
                .OrderBy(g => g.Year)
                .ThenBy(g => g.Month)
                .ToList();

            return Ok(groupedExpenses);
        }
        [HttpGet("totals")]
        public async Task<IActionResult> GetExpenseTotals()
        {
            var now = DateTime.Now;
            var startOfCurrentMonth = new DateTime(now.Year, now.Month, 1);
            var startOfLastYear = startOfCurrentMonth.AddMonths(-12);

            var expenses = await _context.Expenses
                .Where(e => e.Date >= startOfLastYear) 
                .ToListAsync();

            var totalForCurrentMonth = expenses
                .Where(e => e.Date >= startOfCurrentMonth)
                .Sum(e => e.Amount);


            return Ok(new
            {
                TotalForCurrentMonth = totalForCurrentMonth,
            });
        }


        [HttpGet("monthly-totals")]
        public async Task<IActionResult> GetMonthlyExpenseTotals()
        {
            var now = DateTime.Now;
            var startOfLastYear = now.AddMonths(-12);

            var expenses = await _context.Expenses
                .Where(e => e.Date >= startOfLastYear)
                .ToListAsync();

            var monthlyTotals = expenses
                .GroupBy(e => new { e.Date.Year, e.Date.Month })
                .Select(g => new
                {
                    Year = g.Key.Year,
                    Month = g.Key.Month,
                    TotalExpense = g.Sum(e => e.Amount)
                })
                .OrderBy(g => g.Year)
                .ThenBy(g => g.Month)
                .ToList();

            return Ok(monthlyTotals);
        }



    }
}
