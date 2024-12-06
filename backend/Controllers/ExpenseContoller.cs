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
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier); 
            if (string.IsNullOrEmpty(userId))
            {
                throw new UnauthorizedAccessException("User is not authenticated.");
            }
            return int.Parse(userId); 
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<Expense>>> GetExpenses()
        {
            var userId = GetUserIdFromToken();

            var now = DateTime.Now;
            var startOfMonth = new DateTime(now.Year, now.Month, 1);
            var endOfMonth = startOfMonth.AddMonths(1).AddDays(-1);

            var expenses = await _context.Expenses
                .Where(e => e.UserId == userId && e.Date >= startOfMonth && e.Date <= endOfMonth)
                .ToListAsync();

            return Ok(expenses);
        }


        [HttpPost]
        public async Task<ActionResult<Expense>> AddExpense(Expense expense)
        {
            var userId = GetUserIdFromToken(); 
            expense.UserId = userId; 

            _context.Expenses.Add(expense);
            await _context.SaveChangesAsync();
            return CreatedAtAction(nameof(GetExpenses), new { id = expense.Id }, expense);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteExpense(int id)
        {
            var userId = GetUserIdFromToken(); 
            var expense = await _context.Expenses
                .FirstOrDefaultAsync(e => e.Id == id && e.UserId == userId); 

            if (expense == null) return NotFound();

            _context.Expenses.Remove(expense);
            await _context.SaveChangesAsync();
            return NoContent();
        }

        [HttpGet("monthly-expenses")]
        public async Task<IActionResult> GetMonthlyExpenses()
        {
            var userId = GetUserIdFromToken(); 
            var startDate = DateTime.Now.AddMonths(-12);

            var expenses = await _context.Expenses
                .Where(e => e.UserId == userId && e.Date >= startDate) 
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
            var userId = GetUserIdFromToken(); 
            var now = DateTime.Now;
            var startOfCurrentMonth = new DateTime(now.Year, now.Month, 1);
            var startOfLastYear = startOfCurrentMonth.AddMonths(-12);

            var expenses = await _context.Expenses
                .Where(e => e.UserId == userId && e.Date >= startOfLastYear) 
                .ToListAsync();

            var totalForCurrentMonth = expenses
                .Where(e => e.Date >= startOfCurrentMonth)
                .Sum(e => e.Amount);

            return Ok(new
            {
                TotalForCurrentMonth = totalForCurrentMonth,
            });
        }
        [HttpGet("totals-by-category")]
        public async Task<IActionResult> GetTotalsByCategory()
        {
            try
            {
                var userId = GetUserIdFromToken(); 
                var now = DateTime.Now;
                var startOfCurrentMonth = new DateTime(now.Year, now.Month, 1);

                var totalsByCategory = await _context.Expenses
                    .Where(e => e.UserId == userId && e.Date >= startOfCurrentMonth)
                    .GroupBy(e => e.Category)
                    .Select(g => new
                    {
                        Category = g.Key,
                        Total = g.Sum(e => e.Amount)
                    })
                    .ToListAsync();

                return Ok(totalsByCategory);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { Message = "An error occurred while processing your request.", Details = ex.Message });
            }
        }


        [HttpGet("monthly-totals")]
        public async Task<IActionResult> GetMonthlyExpenseTotals()
        {
            var userId = GetUserIdFromToken(); 
            var now = DateTime.Now;
            var startOfLastYear = now.AddMonths(-12);

            var expenses = await _context.Expenses
                .Where(e => e.UserId == userId && e.Date >= startOfLastYear) 
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
