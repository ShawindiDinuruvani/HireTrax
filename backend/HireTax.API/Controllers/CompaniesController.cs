using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using HireTax.API.Models;
using HireTax.API.DTOs;
using HireTax.API.Repositories.Interfaces;

namespace HireTax.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class CompaniesController : ControllerBase
    {
        private readonly IGenericRepository<Company> _companyRepository;

        public CompaniesController(IGenericRepository<Company> companyRepository)
        {
            _companyRepository = companyRepository;
        }

        // GET /api/companies — Public: list all companies (for dropdown in register form)
        [HttpGet]
        [AllowAnonymous]
        public async Task<IActionResult> GetAll()
        {
            var companies = await _companyRepository.GetAllAsync();
            return Ok(companies);
        }

        // GET /api/companies/{id}
        [HttpGet("{id}")]
        [AllowAnonymous]
        public async Task<IActionResult> GetById(int id)
        {
            var companies = await _companyRepository.GetAllAsync();
            var company = companies.FirstOrDefault(c => c.Id == id);
            if (company == null)
                return NotFound(new { message = "Company not found." });
            return Ok(company);
        }

        // POST /api/companies — Public: any recruiter can register a new company
        [HttpPost]
        [AllowAnonymous]
        public async Task<IActionResult> Create(CreateCompanyDto dto)
        {
            var all = await _companyRepository.GetAllAsync();

            // Prevent duplicate company names
            if (all.Any(c => c.Name.ToLower() == dto.Name.ToLower()))
                return BadRequest(new { message = "A company with this name already exists." });

            var company = new Company
            {
                Name = dto.Name,
                Industry = dto.Industry,
                ContactEmail = dto.ContactEmail,
                CreatedAt = DateTime.UtcNow
            };

            await _companyRepository.AddAsync(company);
            await _companyRepository.SaveChangesAsync();

            return Ok(new { message = "Company registered successfully!", company });
        }

        // DELETE /api/companies/{id} — Admin only
        [HttpDelete("{id}")]
        [Authorize(Roles = "admin")]
        public async Task<IActionResult> Delete(int id)
        {
            var companies = await _companyRepository.GetAllAsync();
            var company = companies.FirstOrDefault(c => c.Id == id);
            if (company == null)
                return NotFound(new { message = "Company not found." });

            _companyRepository.Delete(company);
            await _companyRepository.SaveChangesAsync();

            return Ok(new { message = "Company deleted." });
        }
    }
}
