using System.Text;
using GithubSearch.Api.Data;
using GithubSearch.Api.Services;
using GithubSearch.Api.Services.Interfaces;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;

var builder = WebApplication.CreateBuilder(args);

// 1. Add services to the container.
builder.Services.AddControllers();

// 2. Configure SQLite Database Connection
var connectionString = builder.Configuration.GetConnectionString("DefaultConnection") 
                      ?? "Data Source=github-search.db";
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseSqlite(connectionString));

// 3. Register GitHub HTTP Client Service
builder.Services.AddHttpClient<IGitHubService, GitHubService>();

// 4. Configure JWT Authentication Services
var jwtSettings = builder.Configuration.GetSection("Jwt");
var secretKey = jwtSettings["Secret"] ?? "SuperSecureGithubSearchSecretKey1234567890!!!";
var issuer = jwtSettings["Issuer"] ?? "GithubSearchBackend";
var audience = jwtSettings["Audience"] ?? "GithubSearchFrontend";

builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
})
.AddJwtBearer(options =>
{
    options.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuer = true,
        ValidateAudience = true,
        ValidateLifetime = true,
        ValidateIssuerSigningKey = true,
        ValidIssuer = issuer,
        ValidAudience = audience,
        IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(secretKey)),
        ClockSkew = TimeSpan.Zero // Remove standard 5 mins delay for token expiration
    };
});

// 5. Configure CORS (To allow Angular Dev server http://localhost:4200 to connect)
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAngularClient", policy =>
    {
        policy.WithOrigins("http://localhost:4200")
              .AllowAnyHeader()
              .AllowAnyMethod()
              .AllowCredentials();
    });
});

var app = builder.Build();

// 6. Automatically Initialize SQLite database and tables on startup (Out-of-the-box ready!)
using (var scope = app.Services.CreateScope())
{
    var services = scope.ServiceProvider;
    try
    {
        var dbContext = services.GetRequiredService<AppDbContext>();
        // EnsureCreated() creates the database file and constructs the tables immediately
        // based on the AppDbContext structure. No migrations setup is needed!
        dbContext.Database.EnsureCreated();
    }
    catch (Exception ex)
    {
        var logger = services.GetRequiredService<ILogger<Program>>();
        logger.LogError(ex, "An error occurred while creating/initializing the database.");
    }
}

// 7. Configure Middleware Pipeline
app.UseHttpsRedirection();

app.UseCors("AllowAngularClient");

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

app.Run();
