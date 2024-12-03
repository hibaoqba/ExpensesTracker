using ExpenseTrackerAPI.Data;
using ExpenseTrackerAPI.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace ExpenseTrackerAPI.Controllers
{
	[ApiController]
	[Route("api/[controller]")]
	public class BudgetController : ControllerBase
	{
		private readonly ExpenseTrackerContext _context;

		public BudgetController(ExpenseTrackerContext context)
		{
			_context = context;
		}

		[HttpPost]
		public async Task<IActionResult> SetBudget([FromBody] Budget budget)
		{
			if (budget == null || budget.MonthlyBudget <= 0)
			{
				return BadRequest("Le budget est invalide.");
			}

			var existingBudget = await _context.Budgets
				.FirstOrDefaultAsync(b => b.Month.Year == budget.Month.Year && b.Month.Month == budget.Month.Month);

			if (existingBudget != null)
			{
				_context.Budgets.Remove(existingBudget);
			}

			_context.Budgets.Add(budget);
			await _context.SaveChangesAsync();

			return Ok("Budget défini avec succès.");
		}

		[HttpGet("current")]
		public async Task<IActionResult> GetCurrentBudget()
		{
			var currentMonth = DateTime.Now.Month;
			var currentYear = DateTime.Now.Year;

			var budget = await _context.Budgets
				.FirstOrDefaultAsync(b => b.Month.Month == currentMonth && b.Month.Year == currentYear);

			if (budget == null)
			{
				return NotFound("Aucun budget défini pour le mois en cours.");
			}

			return Ok(budget);
		}

		[HttpGet("status")]
		public async Task<IActionResult> CheckBudgetStatus()
		{
			var currentMonth = DateTime.Now.Month;
			var currentYear = DateTime.Now.Year;

			var budget = await _context.Budgets
				.FirstOrDefaultAsync(b => b.Month.Month == currentMonth && b.Month.Year == currentYear);

			if (budget == null)
			{
				return NotFound("Aucun budget défini pour le mois en cours.");
			}

			var totalExpenses = await _context.Expenses
				.Where(e => e.Date.Month == currentMonth && e.Date.Year == currentYear)
				.SumAsync(e => e.Amount);

			var status = new
			{
				Budget = budget.MonthlyBudget,
				TotalExpenses = totalExpenses,
				IsExceeded = totalExpenses > budget.MonthlyBudget
			};

			return Ok(status);
		}
	}
}
