using ExpenseTrackerAPI.Models;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Text;
using System.Security.Claims;

namespace ExpenseTrackerAPI.Services
{
	public class TokenService
	{
		private readonly string _secretKey = "3b76a827d00476b315b7f0a7593e6e6ad7345f78f945f085e79a390eb93fc548"; // Replace with a secure key

		public string GenerateToken(User user)
		{
			var claims = new[]
			{
				new Claim(ClaimTypes.Name, user.Username),
				new Claim(ClaimTypes.NameIdentifier, user.Id.ToString())
			};

			var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_secretKey));
			var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

			var token = new JwtSecurityToken(
				issuer: "ExpenseTrackerAPI",
				audience: "ExpenseTrackerAPI",
				claims: claims,
				expires: DateTime.Now.AddDays(1),
				signingCredentials: creds
			);

			return new JwtSecurityTokenHandler().WriteToken(token);
		}
	}
}
