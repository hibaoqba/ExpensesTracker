using ExpenseTrackerAPI.Data;
using ExpenseTrackerAPI.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

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

		[HttpGet]
		public async Task<ActionResult<IEnumerable<Expense>>> GetExpenses()
		{
			return await _context.Expenses.ToListAsync();
		}

		[HttpPost]
		public async Task<ActionResult<Expense>> AddExpense(Expense expense)
		{
			_context.Expenses.Add(expense);
			await _context.SaveChangesAsync();
			return CreatedAtAction(nameof(GetExpenses), new { id = expense.Id }, expense);
		}
		[HttpGet("category/{category}")]
		public async Task<IActionResult> GetExpensesByCategory(string category)
		{
			var expenses = await _context.Expenses
				.Where(e => e.Category.ToLower() == category.ToLower())
				.ToListAsync();
			return Ok(expenses);
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
	}
}
