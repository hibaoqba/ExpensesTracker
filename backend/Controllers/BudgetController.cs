using ExpenseTrackerAPI.Data;
using ExpenseTrackerAPI.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Security.Claims;

namespace ExpenseTrackerAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class BudgetController : ControllerBase
    {
        private readonly ExpenseTrackerContext _context;
        private readonly IHttpContextAccessor _httpContextAccessor;

        public BudgetController(ExpenseTrackerContext context, IHttpContextAccessor httpContextAccessor)
        {
            _context = context;
            _httpContextAccessor = httpContextAccessor;
        }

        private int GetUserIdFromToken()
        {
            var userId = _httpContextAccessor.HttpContext.User.FindFirstValue(ClaimTypes.NameIdentifier);  // Get the user ID from JWT token
            if (string.IsNullOrEmpty(userId))
            {
                throw new UnauthorizedAccessException("User is not authenticated.");
            }
            return int.Parse(userId); 
        }


        [HttpPost]
        public async Task<IActionResult> SetBudget([FromBody] Budget budget)
        {
            if (budget == null || budget.MonthlyBudget <= 0)
            {
                return BadRequest("Le budget est invalide.");
            }

            var userId = GetUserIdFromToken();

            var existingBudget = await _context.Budgets
                .FirstOrDefaultAsync(b => b.Month.Year == budget.Month.Year
                                          && b.Month.Month == budget.Month.Month
                                          && b.UserId == userId);

            if (existingBudget != null)
            {
                _context.Budgets.Remove(existingBudget);
            }

            budget.UserId = userId;

            _context.Budgets.Add(budget);
            await _context.SaveChangesAsync();

            return Ok(budget);
        }



        [HttpGet("current")]
        public async Task<IActionResult> GetCurrentBudget()
        {
            var userId = GetUserIdFromToken(); 
            var currentMonth = DateTime.Now.Month;
            var currentYear = DateTime.Now.Year;

            var budget = await _context.Budgets
                .FirstOrDefaultAsync(b => b.Month.Month == currentMonth && b.Month.Year == currentYear && b.UserId == userId);

            if (budget == null)
            {
                return NotFound("Aucun budget défini pour le mois en cours.");
            }

            return Ok(budget);
        }

        [HttpGet("status")]
        public async Task<IActionResult> CheckBudgetStatus()
        {
            var userId = GetUserIdFromToken(); 
            var currentMonth = DateTime.Now.Month;
            var currentYear = DateTime.Now.Year;

            var budget = await _context.Budgets
                .FirstOrDefaultAsync(b => b.Month.Month == currentMonth && b.Month.Year == currentYear && b.UserId == userId);

            if (budget == null)
            {
                return NotFound("Aucun budget défini pour le mois en cours.");
            }

            var totalExpenses = await _context.Expenses
                .Where(e => e.Date.Month == currentMonth && e.Date.Year == currentYear && e.UserId == userId)
                .SumAsync(e => e.Amount);

            var status = new
            {
                Budget = budget.MonthlyBudget,
                TotalExpenses = totalExpenses,
                IsExceeded = totalExpenses > budget.MonthlyBudget
            };

            return Ok(status);
        }

        [HttpGet("last-12-months")]
        public async Task<IActionResult> GetLast12MonthsBudgets()
        {
            var userId = GetUserIdFromToken(); 
            var lastYear = DateTime.Now.AddMonths(-12);

            var budgets = await _context.Budgets
                .Where(b => b.Month >= lastYear && b.UserId == userId)
                .OrderBy(b => b.Month)
                .ToListAsync();

            var expenses = await _context.Expenses
                .Where(e => e.Date >= lastYear && e.UserId == userId)
                .GroupBy(e => new { e.Date.Year, e.Date.Month })
                .Select(g => new
                {
                    Year = g.Key.Year,
                    Month = g.Key.Month,
                    TotalSpent = g.Sum(e => e.Amount)
                })
                .ToListAsync();

            var result = budgets
                .Select(b => new
                {
                    Year = b.Month.Year,
                    Month = b.Month.Month,
                    Budget = b.MonthlyBudget,
                    TotalSpent = expenses
                        .FirstOrDefault(e => e.Year == b.Month.Year && e.Month == b.Month.Month)?.TotalSpent ?? 0,
                    IsExceeded = expenses
                        .FirstOrDefault(e => e.Year == b.Month.Year && e.Month == b.Month.Month)?.TotalSpent > b.MonthlyBudget
                })
                .OrderBy(b => b.Year)
                .ThenBy(b => b.Month)
                .ToList();

            return Ok(result);
        }
    }

}
